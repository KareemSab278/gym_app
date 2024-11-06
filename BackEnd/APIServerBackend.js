const http = require("http");
const host = "0.0.0.0";
const port = "8000";
const express = require('express');
const mysql = require('mysql'); 
const bcrypt = require('bcrypt');
//const cors = require('cors'); // Include CORS
const multer = require('multer'); // For handling image uploads and forms

const upload = multer({ dest: 'uploads/' });

const app = express(); 
app.use(express.json()); 
//app.use(cors()); // Enable CORS

// Database configurations
const db = mysql.createConnection({
    host: 'testgym.mysql.database.azure.com', 
    user: 'kareem', 
    password: 'Assbucket@27',
    database: 'gym_db'
});

// Database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + db.threadId);
});

// Start server
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

// _______________________________ GET ENDPOINTS _______________________________

app.get('/equipment', (req, res) => {
    db.query("SELECT id, name, type, image FROM equipment", (err, results) => {
        if (err) {
            console.error('Error fetching equipment:', err); 
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

// Get all users
app.get('/users', (req, res) => {
    db.query("SELECT * FROM gym_users", (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        res.json(results);
    });
});

// Get all usage records for a specific user
app.get('/usage/:userId', (req, res) => {
    db.query("SELECT user_id, equipment_id, hours_used, usage_date FROM gym_preferences WHERE user_id = ?", [req.params.userId], (err, results) => {
        if (err) {
            console.error('Error fetching usage records:', err);
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        res.json(results);
    });
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
    db.query("SELECT * FROM gym_users WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching user by ID:', err);
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
});

// _______________________________ POST ENDPOINTS _______________________________

app.post('/equipment', upload.single('image'), (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const image = req.file ? req.file.filename : null;

    console.log({ name, type, image });

    db.query("INSERT INTO equipment(name, type, image) VALUES (?, ?, ?)", [name, type, image], (err, results) => {
        if (err) {
            console.error('Error inserting equipment:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

/auth/signup

// Sign up a new user
app.post('/auth/signup', async (req, res) => {
    const { name, email, telephone, dob, sex, password } = req.body;

    // Validate required fields
    if (!name || !email || !telephone || !dob || !sex || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query(
            "INSERT INTO gym_users (name, email, telephone, dob, sex, password) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, telephone, dob, sex, hashedPassword],
            (err, results) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({ message: 'Database query error', error: err });
                }

                const userId = results.insertId;
                res.status(201).json({ message: 'User created successfully', userId });
            }
        );
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Record usage of equipment
app.post('/usage', (req, res) => {
    console.log('Received request at /usage');
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);

    const { user_id, equipment_id, hours_used } = req.body;

    // Log the received values
    console.log('Parsed Values - user_id:', user_id, ', equipment_id:', equipment_id, ', hours_used:', hours_used);

    if (!user_id || !equipment_id || !hours_used) {
        console.error('Missing required fields: user_id, equipment_id, or hours_used');
        return res.status(400).json({ message: 'User ID, equipment ID, and hours used are required.' });
    }

    const sql = 'INSERT INTO gym_preferences (user_id, equipment_id, hours_used) VALUES (?, ?, ?)';
    db.query(sql, [user_id, equipment_id, hours_used], (err, result) => {
        if (err) {
            console.error('Failed to insert data:', err);
            return res.status(500).json({ message: 'Failed to record usage' });
        }
        console.log('Usage recorded successfully:', result);
        return res.status(200).json({ message: 'Usage recorded successfully' });
    });
});


// Deduct funds from a user
app.put('/users/:id/deduct-funds', (req, res) => {
    console.log('PUT /users/:id/deduct-funds called with params:', req.params);
    console.log('Request body:', req.body);

    const userId = req.params.id;
    const { amount } = req.body;

    if (!amount) {
        console.error('Amount is missing in the request body');
        return res.status(400).json({ message: 'Amount is required' });
    }

    db.query("UPDATE gym_users SET funds = funds - ? WHERE id = ?", [amount, userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        console.log('Funds deducted successfully for user ID:', userId);
        res.json({ message: 'Funds deducted successfully', results });
    });
});



// _______________________________ DELETE ENDPOINTS _______________________________

// Delete a piece of equipment
app.delete('/equipment/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM equipment WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error('Error deleting equipment:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json({ message: 'Equipment deleted successfully', results });
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    db.query("DELETE FROM gym_users WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        res.json({ message: 'User deleted successfully', results });
    });
});

// _______________________________ PATCH ENDPOINT _______________________________

app.patch('/use-equipment', (req, res) => {
    const { userId, equipmentId, action } = req.body;

    if (action === 'start') {
        // Handle the start of equipment usage
        const usageDate = new Date();
        db.query(
            "INSERT INTO gym_preferences (user_id, equipment_id, usage_date, hours_used) VALUES (?, ?, ?, ?)",
            [userId, equipmentId, usageDate, 0],
            (err, results) => {
                if (err) {
                    console.error('Error starting equipment usage:', err);
                    return res.status(500).json({ message: 'Error starting equipment usage', error: err });
                }
                res.status(200).json({ message: 'Usage started successfully' });
            }
        );
    } else if (action === 'end') {
        // Handle the end of equipment usage
        const endUsageDate = new Date();
        db.query(
            "UPDATE gym_preferences SET end_usage_date = ?, hours_used = TIMESTAMPDIFF(MINUTE, usage_date, ?) / 60 WHERE user_id = ? AND equipment_id = ? AND end_usage_date IS NULL",
            [endUsageDate, endUsageDate, userId, equipmentId],
            (err, results) => {
                if (err) {
                    console.error('Error ending equipment usage:', err);
                    return res.status(500).json({ message: 'Error ending equipment usage', error: err });
                }
                res.status(200).json({ message: 'Usage ended successfully', results });
            }
        );
    } else {
        res.status(400).json({ message: 'Invalid action' });
    }
});





// _______________________________ AUTHENTICATION _______________________________

// Sign in a user
app.post('/auth/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.query("SELECT * FROM gym_users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error('Error querying user by email:', err);
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        console.log('Retrieved password hash from DB:', user.password);

        const passwordMatch = await bcrypt.compare(password, user.password);

        console.log('Password comparison result:', passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Sign in successful', user });
    });
});
