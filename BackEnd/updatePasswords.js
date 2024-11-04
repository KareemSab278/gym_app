const mysql = require('mysql'); // or whatever database library you're using
const bcrypt = require('bcrypt');

// Create a connection to your database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gym_db'
  });

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the database.');

    // Start the password update process
    updatePasswords();
});

// Function to update passwords
async function updatePasswords() {
    try {
        // Get all users from the database
        const users = await new Promise((resolve, reject) => {
            db.query("SELECT id, password FROM gym_users", (err, results) => {
                if (err) {
                    console.error('Error fetching users:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });

        // Create an array of promises for updating passwords
        const updatePromises = users.map(async (user) => {
            // Log the user ID and existing password for debugging (optional)
            console.log(`Updating password for user ID: ${user.id}`);

            // Hash the existing password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Update the password in the database
            return new Promise((resolve, reject) => {
                db.query("UPDATE gym_users SET password = ? WHERE id = ?", [hashedPassword, user.id], (updateErr) => {
                    if (updateErr) {
                        console.error(`Error updating password for user ID ${user.id}:`, updateErr);
                        return reject(updateErr);
                    } else {
                        console.log(`Password updated for user ID: ${user.id}`);
                        resolve();
                    }
                });
            });
        });

        // Wait for all password updates to finish
        await Promise.all(updatePromises);
        console.log('All passwords have been updated successfully.');
    } catch (error) {
        console.error('Error updating passwords:', error);
    } finally {
        // Close the database connection after the updates are done
        db.end();
    }
}
