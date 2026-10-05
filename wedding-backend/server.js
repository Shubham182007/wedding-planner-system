const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'wedding_planner_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
db.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL Database (wedding_planner_db)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

// ==================== AUTHENTICATION APIS ==================== //

app.post('/api/register', async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered!' });
        }
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
            [full_name, email, password]
        );
        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        console.error('❌ Register Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message || 'Error registering user' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = rows[0];
        res.json({ message: 'Login successful!', user: { id: user.id, full_name: user.full_name, email: user.email } });
    } catch (error) {
        console.error('❌ Login Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message || 'Error logging in' });
    }
});

// ==================== EVENT MANAGEMENT APIS ==================== //

app.get('/api/events/:userId', async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC', [req.params.userId]);
        res.json(events);
    } catch (error) {
        console.error('❌ Fetch Events Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.post('/api/events', async (req, res) => {
    const { user_id, event_type, event_date, event_time, location, description } = req.body;
    try {
        await db.query(
            'INSERT INTO events (user_id, event_type, event_date, event_time, location, description) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, event_type, event_date, event_time, location, description || '']
        );
        res.status(201).json({ message: 'Event added successfully!' });
    } catch (error) {
        console.error('❌ Add Event Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Event deleted successfully!' });
    } catch (error) {
        console.error('❌ Delete Event Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// ==================== GUEST MANAGEMENT APIS ==================== //

// Get all guests
app.get('/api/guests/:userId', async (req, res) => {
    try {
        const [guests] = await db.query(
            'SELECT * FROM guests WHERE user_id = ? ORDER BY created_at DESC', 
            [req.params.userId]
        );

        // Map column names cleanly for frontend
        const formattedGuests = guests.map(g => ({
            id: g.id,
            user_id: g.user_id,
            guest_name: g.guest_name || g.name || 'Guest',
            contact: g.contact || g.phone || '',
            category: g.category || 'General',
            total_members: g.total_members || 1,
            rsvp_status: g.rsvp_status || 'Pending'
        }));

        res.json(formattedGuests);
    } catch (error) {
        console.error('❌ Error fetching guests:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message || 'Error fetching guests' });
    }
});

// Add new guest (With strict validation & error handling)
app.post('/api/guests', async (req, res) => {
    const { user_id, guest_name, name, contact, phone, category, total_members, rsvp_status } = req.body;

    const finalUserId = parseInt(user_id);
    const finalName = guest_name || name;
    const finalContact = contact || phone || '';

    if (!finalUserId || isNaN(finalUserId)) {
        return res.status(400).json({ message: 'Invalid User ID. Please log out and log in again.' });
    }

    if (!finalName) {
        return res.status(400).json({ message: 'Guest name is required.' });
    }

    try {
        await db.query(
            `INSERT INTO guests (user_id, guest_name, contact, category, total_members, rsvp_status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                finalUserId, 
                finalName, 
                finalContact, 
                category || 'General', 
                parseInt(total_members) || 1, 
                rsvp_status || 'Pending'
            ]
        );

        res.status(201).json({ message: 'Guest added successfully!' });
    } catch (error) {
        console.error('❌ Error adding guest:', error.sqlMessage || error.message);
        res.status(500).json({ 
            message: error.sqlMessage || error.message || 'Database error adding guest' 
        });
    }
});

// Update guest status
app.put('/api/guests/:id', async (req, res) => {
    const { rsvp_status, category } = req.body;
    try {
        await db.query(
            'UPDATE guests SET rsvp_status = COALESCE(?, rsvp_status), category = COALESCE(?, category) WHERE id = ?', 
            [rsvp_status, category, req.params.id]
        );
        res.json({ message: 'Guest updated successfully!' });
    } catch (error) {
        console.error('❌ Update Guest Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// Delete guest
app.delete('/api/guests/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM guests WHERE id = ?', [req.params.id]);
        res.json({ message: 'Guest deleted successfully!' });
    } catch (error) {
        console.error('❌ Delete Guest Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// ==================== VENDOR MANAGEMENT APIS ==================== //

app.get('/api/vendors/:userId', async (req, res) => {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
        res.json(vendors);
    } catch (error) {
        console.error('❌ Fetch Vendors Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.post('/api/vendors', async (req, res) => {
    const { user_id, vendor_name, category, contact, price, paid_amount, booking_status } = req.body;
    try {
        await db.query(
            'INSERT INTO vendors (user_id, vendor_name, category, contact, price, paid_amount, booking_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, vendor_name, category || 'Other', contact, price || 0, paid_amount || 0, booking_status || 'Pending']
        );
        res.status(201).json({ message: 'Vendor added successfully!' });
    } catch (error) {
        console.error('❌ Add Vendor Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.put('/api/vendors/:id', async (req, res) => {
    const { vendor_name, category, contact, price, paid_amount, booking_status } = req.body;
    try {
        const [result] = await db.query(
            `UPDATE vendors
             SET vendor_name = ?, category = ?, contact = ?, price = ?, paid_amount = ?, booking_status = ?
             WHERE id = ?`,
            [vendor_name, category, contact, price || 0, paid_amount || 0, booking_status || 'Pending', req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }

        res.json({ message: 'Vendor updated successfully!' });
    } catch (error) {
        console.error('❌ Update Vendor Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.delete('/api/vendors/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM vendors WHERE id = ?', [req.params.id]);
        res.json({ message: 'Vendor deleted successfully!' });
    } catch (error) {
        console.error('❌ Delete Vendor Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// ==================== BUDGET & EXPENSES APIS ==================== //

app.get('/api/budget/target/:userId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT total_budget FROM budget_settings WHERE user_id = ?', [req.params.userId]);
        res.json(rows[0] || { total_budget: 0 });
    } catch (error) {
        console.error('❌ Fetch Budget Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.post('/api/budget/set-target', async (req, res) => {
    const { user_id, total_budget } = req.body;
    try {
        await db.query(
            'INSERT INTO budget_settings (user_id, total_budget) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_budget = ?',
            [user_id, total_budget, total_budget]
        );
        res.json({ message: 'Target budget updated successfully!' });
    } catch (error) {
        console.error('❌ Set Target Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.get('/api/budget/expenses/:userId', async (req, res) => {
    try {
        const [expenses] = await db.query('SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
        res.json(expenses);
    } catch (error) {
        console.error('❌ Fetch Expenses Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.get('/api/budget/:userId', async (req, res) => {
    try {
        const [budgetRows] = await db.query('SELECT total_budget FROM budget_settings WHERE user_id = ?', [req.params.userId]);
        const [expenses] = await db.query('SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
        res.json({ total_budget: budgetRows[0]?.total_budget || 0, expenses });
    } catch (error) {
        console.error('❌ Fetch Budget Data Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.post('/api/expenses', async (req, res) => {
    const { user_id, title, category, planned_amount, actual_amount } = req.body;
    try {
        await db.query(
            'INSERT INTO expenses (user_id, title, category, planned_amount, actual_amount) VALUES (?, ?, ?, ?, ?)',
            [user_id, title, category || 'Other', planned_amount || 0, actual_amount || 0]
        );
        res.status(201).json({ message: 'Expense added successfully!' });
    } catch (error) {
        console.error('❌ Add Expense Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.put('/api/expenses/:id', async (req, res) => {
    const { title, category, planned_amount, actual_amount } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE expenses SET title = ?, category = ?, planned_amount = ?, actual_amount = ? WHERE id = ?',
            [title, category || 'Other', planned_amount || 0, actual_amount || 0, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found.' });
        }
        res.json({ message: 'Expense updated successfully!' });
    } catch (error) {
        console.error('❌ Update Expense Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found.' });
        }
        res.json({ message: 'Expense deleted successfully!' });
    } catch (error) {
        console.error('❌ Delete Expense Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.post('/api/budget/expenses', async (req, res) => {
    const { user_id, category, item_name, planned_amount, actual_amount, payment_status } = req.body;
    try {
        await db.query(
            'INSERT INTO expenses (user_id, category, item_name, planned_amount, actual_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, category, item_name, planned_amount || 0, actual_amount || 0, payment_status || 'Pending']
        );
        res.status(201).json({ message: 'Expense added successfully!' });
    } catch (error) {
        console.error('❌ Add Expense Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.delete('/api/budget/expenses/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
        res.json({ message: 'Expense deleted successfully!' });
    } catch (error) {
        console.error('❌ Delete Expense Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// ==================== AI BUDGET PREDICTION APIS ==================== //

app.post('/api/predict-budget', async (req, res) => {
    const { user_id, guest_count, venue_tier, catering_tier, decor_tier, photography_tier, entertainment_tier, attire_tier } = req.body;

    if (!user_id || !guest_count) {
        return res.status(400).json({ message: 'User ID and guest count are required' });
    }

    const guests = parseInt(guest_count) || 0;

    const cateringRates = { Economy: 600, Standard: 1200, Premium: 2200, Luxury: 3500 };
    const cateringCost = guests * (cateringRates[catering_tier] || 1200);

    const venueRates = { Community_Hall: 80000, Banquet_Hall: 200000, Resort_Hotel: 500000, Luxury_Palace: 1200000 };
    const venueCost = venueRates[venue_tier] || 200000;

    const decorRates = { Minimal: 50000, Elegant: 150000, Grand: 350000, Royal: 800000 };
    const decorCost = decorRates[decor_tier] || 150000;

    const photoRates = { Basic: 40000, Standard: 100000, Cinematic: 220000, Celebrity: 500000 };
    const photoCost = photoRates[photography_tier] || 100000;

    const entertainmentRates = { Basic_DJ: 25000, Live_Band: 70000, Celebrity_DJ: 180000, Full_Show: 350000 };
    const entertainmentCost = entertainmentRates[entertainment_tier] || 70000;

    const attireRates = { Budget: 35000, Standard: 90000, Designer: 250000, High_End: 600000 };
    const attireCost = attireRates[attire_tier] || 90000;

    const subtotal = cateringCost + venueCost + decorCost + photoCost + entertainmentCost + attireCost;
    const bufferCost = Math.round(subtotal * 0.08);
    const estimatedTotal = subtotal + bufferCost;

    const breakdown = {
        catering: cateringCost,
        venue: venueCost,
        decor: decorCost,
        photography: photoCost,
        entertainment: entertainmentCost,
        attire: attireCost,
        contingency_buffer: bufferCost,
        estimated_total: estimatedTotal
    };

    try {
        await db.query(
            `INSERT INTO budget_predictions 
             (user_id, guest_count, venue_tier, catering_tier, decor_tier, photography_tier, entertainment_tier, attire_tier, estimated_total) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, guests, venue_tier, catering_tier, decor_tier, photography_tier, entertainment_tier, attire_tier, estimatedTotal]
        );

        res.json({ message: 'AI Prediction calculated successfully!', breakdown });
    } catch (error) {
        console.error('❌ Predict Budget Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.get('/api/predict-budget/:userId', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM budget_predictions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [req.params.userId]
        );
        res.json(rows[0] || null);
    } catch (error) {
        console.error('❌ Fetch Prediction Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// ==================== SEATING ARRANGEMENT APIS ==================== //

app.get('/api/seating/tables/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const [tables] = await db.query(
            'SELECT * FROM seating_tables WHERE user_id = ? ORDER BY created_at ASC',
            [userId]
        );

        const [assignments] = await db.query(
            `SELECT sa.id AS assignment_id, sa.table_id, sa.guest_id, g.* 
             FROM seating_assignments sa 
             LEFT JOIN guests g ON sa.guest_id = g.id 
             WHERE sa.user_id = ?`,
            [userId]
        );

        const formattedAssignments = assignments.map(a => ({
            assignment_id: a.assignment_id,
            table_id: a.table_id,
            guest_id: a.guest_id,
            guest_name: a.guest_name || a.name || a.full_name || 'Guest',
            category: a.category || a.group_name || 'General'
        }));

        res.json({ tables: tables || [], assignments: formattedAssignments });
    } catch (error) {
        console.error('❌ Error fetching seating tables:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.post('/api/seating/tables', async (req, res) => {
    const { user_id, table_name, capacity } = req.body;

    if (!user_id || !table_name) {
        return res.status(400).json({ message: 'Table name is required' });
    }

    try {
        await db.query(
            'INSERT INTO seating_tables (user_id, table_name, capacity) VALUES (?, ?, ?)',
            [user_id, table_name, capacity || 8]
        );
        res.status(201).json({ message: 'Table added successfully!' });
    } catch (error) {
        console.error('❌ Add Seating Table Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.delete('/api/seating/tables/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM seating_tables WHERE id = ?', [req.params.id]);
        res.json({ message: 'Table deleted successfully!' });
    } catch (error) {
        console.error('❌ Delete Seating Table Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.post('/api/seating/assign', async (req, res) => {
    const { user_id, table_id, guest_id } = req.body;

    if (!user_id || !table_id || !guest_id) {
        return res.status(400).json({ message: 'Missing assignment parameters' });
    }

    try {
        await db.query(
            `INSERT INTO seating_assignments (user_id, table_id, guest_id) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE table_id = ?`,
            [user_id, table_id, guest_id, table_id]
        );
        res.json({ message: 'Guest assigned to table successfully!' });
    } catch (error) {
        console.error('❌ Assign Seating Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

app.delete('/api/seating/unassign/:assignmentId', async (req, res) => {
    try {
        await db.query('DELETE FROM seating_assignments WHERE id = ?', [req.params.assignmentId]);
        res.json({ message: 'Guest unassigned successfully!' });
    } catch (error) {
        console.error('❌ Unassign Seating Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// ==================== REPORTS & ANALYTICS APIS ==================== //

app.get('/api/reports/summary/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const [guestStats] = await db.query(
            `SELECT 
                COUNT(*) AS total_guests,
                SUM(CASE WHEN rsvp_status = 'Accepted' THEN 1 ELSE 0 END) AS attending,
                SUM(CASE WHEN rsvp_status = 'Pending' THEN 1 ELSE 0 END) AS pending_rsvp,
                SUM(CASE WHEN rsvp_status = 'Declined' THEN 1 ELSE 0 END) AS declined,
                SUM(total_members) AS total_headcount
             FROM guests WHERE user_id = ?`, [userId]
        );

        const [budgetSetting] = await db.query('SELECT total_budget FROM budget_settings WHERE user_id = ?', [userId]);
        const [expenseStats] = await db.query(
            `SELECT 
                SUM(planned_amount) AS total_planned, 
                SUM(actual_amount) AS total_actual 
             FROM expenses WHERE user_id = ?`, [userId]
        );

        const [vendorStats] = await db.query(
            `SELECT 
                COUNT(*) AS total_vendors,
                SUM(CASE WHEN booking_status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed_vendors,
                SUM(price) AS total_vendor_cost,
                SUM(paid_amount) AS vendor_paid
             FROM vendors WHERE user_id = ?`, [userId]
        );

        const [eventStats] = await db.query('SELECT COUNT(*) AS total_events FROM events WHERE user_id = ?', [userId]);
        const [seatingStats] = await db.query('SELECT COUNT(*) AS seated_guests FROM seating_assignments WHERE user_id = ?', [userId]);

        res.json({
            guests: guestStats[0] || {},
            budget: {
                target_budget: budgetSetting.length > 0 ? budgetSetting[0].total_budget : 0,
                total_planned: expenseStats[0].total_planned || 0,
                total_actual: expenseStats[0].total_actual || 0
            },
            vendors: vendorStats[0] || {},
            events: eventStats[0].total_events || 0,
            seated_guests: seatingStats[0].seated_guests || 0
        });

    } catch (error) {
        console.error('❌ Report Summary Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// Public Endpoint: Couple submits wedding request (No Auth Required)
app.post('/api/public/wedding-inquiry', async (req, res) => {
    const { couple_name, contact_email, contact_phone, event_date, estimated_guests, estimated_budget } = req.body;

    if (!couple_name || !contact_email) {
        return res.status(400).json({ message: 'Couple name and contact email are required.' });
    }

    try {
        const inquiryEmail = `inquiry-${Date.now()}-${Math.random().toString(36).slice(2)}@royalcrest.local`;
        const [userResult] = await db.query(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [couple_name, inquiryEmail, 'public-inquiry', 'user']
        );

        const [result] = await db.query(
            `INSERT INTO client_weddings 
             (user_id, couple_name, contact_email, contact_phone, event_date, estimated_guests, estimated_budget) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userResult.insertId,
                couple_name, 
                contact_email, 
                contact_phone || '', 
                event_date || null, 
                parseInt(estimated_guests) || 100, 
                parseFloat(estimated_budget) || 0.00
            ]
        );

        res.status(201).json({ message: 'Inquiry submitted successfully! Our wedding planner will contact you soon.', id: result.insertId, userId: userResult.insertId });
    } catch (error) {
        console.error('❌ Public Inquiry Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// ==================== CLIENT INQUIRY & ADMIN APIS ==================== //

// 1. Public Endpoint: Couples submit wedding inquiry (No Auth Needed)
app.post('/api/public/wedding-inquiry', async (req, res) => {
    const { couple_name, contact_email, contact_phone, event_date, estimated_guests, estimated_budget } = req.body;

    if (!couple_name || !contact_email) {
        return res.status(400).json({ message: 'Couple name and contact email are required.' });
    }

    try {
        await db.query(
            `INSERT INTO client_weddings 
             (couple_name, contact_email, contact_phone, event_date, estimated_guests, estimated_budget) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                couple_name, 
                contact_email, 
                contact_phone || '', 
                event_date || null, 
                parseInt(estimated_guests) || 100, 
                parseFloat(estimated_budget) || 0.00
            ]
        );

        res.status(201).json({ message: 'Inquiry submitted successfully! The wedding planner will review your details soon.' });
    } catch (error) {
        console.error('❌ Public Inquiry Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message || 'Database error submitting inquiry' });
    }
});

// 2. Admin Endpoint: Fetch all registered client weddings for the Planner
app.get('/api/admin/client-weddings', async (req, res) => {
    try {
        const [clients] = await db.query('SELECT * FROM client_weddings ORDER BY created_at DESC');
        res.json(clients);
    } catch (error) {
        console.error('❌ Fetch Clients Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// Admin Endpoint: Resolve legacy inquiry IDs to a user ID used by management tables
app.post('/api/admin/resolve-client', async (req, res) => {
    const { couple_name, contact_email } = req.body;

    if (!couple_name || !contact_email) {
        return res.status(400).json({ message: 'Couple name and contact email are required.' });
    }

    try {
        const [clients] = await db.query(
            'SELECT id FROM client_weddings WHERE contact_email = ? ORDER BY created_at DESC LIMIT 1',
            [contact_email]
        );

        const inquiryEmail = clients.length > 0
            ? `legacy-inquiry-${clients[0].id}@royalcrest.local`
            : `legacy-inquiry-${Date.now()}-${Math.random().toString(36).slice(2)}@royalcrest.local`;
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [inquiryEmail]);
        if (existingUsers.length > 0) {
            return res.json({ id: existingUsers[0].id });
        }

        const [userResult] = await db.query(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [couple_name, inquiryEmail, 'public-inquiry', 'user']
        );
        res.json({ id: userResult.insertId });
    } catch (error) {
        console.error('❌ Resolve Client Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    }
});

// Admin Endpoint: Delete a couple and its management data
app.delete('/api/admin/client-weddings/:id', async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [clients] = await connection.query(
            'SELECT user_id FROM client_weddings WHERE id = ? FOR UPDATE',
            [req.params.id]
        );

        if (clients.length === 0) {
            await connection.commit();
            return res.json({ message: 'Couple inquiry was already deleted.' });
        }

        const userId = clients[0].user_id;
        if (userId) {
            await connection.query('DELETE FROM seating_assignments WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM seating_tables WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM guests WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM events WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM vendors WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM expenses WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM budget_settings WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM budget_predictions WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM tasks WHERE user_id = ?', [userId]);
        }
        await connection.query('DELETE FROM client_weddings WHERE id = ?', [req.params.id]);
        if (userId) {
            await connection.query('DELETE FROM users WHERE id = ? AND role = ?', [userId, 'user']);
        }

        await connection.commit();
        res.json({ message: 'Couple inquiry and management data deleted successfully.' });
    } catch (error) {
        await connection.rollback();
        console.error('❌ Delete Client Error:', error.sqlMessage || error.message);
        res.status(500).json({ message: error.sqlMessage || error.message });
    } finally {
        connection.release();
    }
});

// ==================== START SERVER ==================== //

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Wedding Planner Backend running on port ${PORT}`);
});