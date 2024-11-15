const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const app = express();

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL username
    password: '', // MySQL password
    database: 'userdb',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.get('/isLoggedIn', (req, res) => {
    res.json({ isLoggedIn: !!req.session.user });
});

// Login page
app.get('/login', (req, res) => {
    const successMessage = req.session.successMessage; // Get success message from session
    req.session.successMessage = null; // Clear message after reading it
    res.sendFile(path.join(__dirname, '../login.html'), (err) => {
        if (err) {
            console.error('Error sending login.html:', err);
            res.status(err.status).end();
        }
    });
});

// Registration route
app.post('/register', (req, res) => { // Change the route to /register
    const { fullname, address, gmail, password, phone } = req.body;
    const query = `INSERT INTO users (fullname, address, gmail, password, phone) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [fullname, address, gmail, password, phone], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send('Error during registration.');
        }
        req.session.successMessage = 'User registered successfully!'; // Set success message
        res.redirect('/login?success=true'); // Redirect to the login page
    });
});

// Login route
app.post('/loggedin', (req, res) => { // This route is correctly set up for login
    console.log(req.body);
    const { gmail, password } = req.body;
    const query = `SELECT * FROM users WHERE gmail = ? AND password = ?`;

    db.query(query, [gmail, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).send('Error during login.');
        }
        if (results.length > 0) {
            req.session.user = results[0]; // Store user info in session
            // Optionally, redirect to a dashboard or home page instead of sending a simple message
            res.redirect('/home'); 
        } else {
            res.status(401).send('Invalid credentials.');
        }
    });
});

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error('Error')
        }
        res.redirect('/login')
    })
})

app.get('/home', (req, res) =>{
    res.sendFile(path.join(__dirname, '../testProject/index.html'));
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
