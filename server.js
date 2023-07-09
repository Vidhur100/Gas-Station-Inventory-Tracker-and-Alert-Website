const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const nodemailer = require('nodemailer'); // Add nodemailer package

const app = express();
const port = 3000; // Change this to the desired port number

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Your code for MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'inventory_user',
  password: 'password',
  database: 'inventory_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'your_email_service', // Replace with your email service (e.g., Gmail, Outlook)
  auth: {
    user: 'your_email@example.com', // Replace with your email address
    pass: 'your_password', // Replace with your email password
  },
});

// Function to send email notification
function sendRestockNotification(itemName) {
  const mailOptions = {
    from: 'your_email@example.com', // Replace with your email address
    to: 'recipient_email@example.com', // Replace with recipient's email address
    subject: 'Restock Notification',
    text: `The item "${itemName}" has reached 0 quantity and needs to be restocked.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email notification sent:', info.response);
    }
  });
}

// Handle GET request for inventory
app.get('/inventory', (req, res) => {
  const sql = 'SELECT * FROM inventory';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch inventory' });
    }

    res.json({ inventory: results });
  });
});

// Handle POST request to add new item to inventory
app.post('/inventory', (req, res) => {
  const { name, quantity, price } = req.body;
  const sql = 'INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)';

  connection.query(sql, [name, quantity, price], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add item to inventory' });
    }

    res.json({ message: 'Item added to inventory' });
  });
});

// Handle DELETE request to delete an item from inventory
app.delete('/inventory/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = 'DELETE FROM inventory WHERE id = ?';

  connection.query(sql, [itemId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete item from inventory' });
    }

    res.json({ message: 'Item deleted from inventory' });
  });
});

// Handle decrementing item quantity
app.put('/inventory/:id/decrement', (req, res) => {
  const itemId = req.params.id;
  const sqlSelect = 'SELECT name, quantity FROM inventory WHERE id = ?';
  const sqlUpdate = 'UPDATE inventory SET quantity = ? WHERE id = ?';

  connection.query(sqlSelect, [itemId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch item from inventory' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const itemName = results[0].name;
    let itemQuantity = results[0].quantity;

    if (itemQuantity === 0) {
      sendRestockNotification(itemName);
    }

    itemQuantity--;

    connection.query(sqlUpdate, [itemQuantity, itemId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update item quantity' });
      }

      res.json({ message: 'Item quantity updated' });
    });
  });
});

// Serve the client-side files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// SERVER.JS CODE WITHOUT EMAIL RESTOCK FEATURE
/*
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000; // Change this to the desired port number

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Your code for MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'inventory_user',
  password: 'password',
  database: 'inventory_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Handle GET request for inventory
app.get('/inventory', (req, res) => {
  const sql = 'SELECT * FROM inventory';

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch inventory' });
    }

    res.json({ inventory: results });
  });
});

// Handle POST request to add new item to inventory
app.post('/inventory', (req, res) => {
  const { name, quantity, price } = req.body;
  const sql = 'INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)';

  connection.query(sql, [name, quantity, price], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add item to inventory' });
    }

    res.json({ message: 'Item added to inventory' });
  });
});

// Handle DELETE request to delete an item from inventory
app.delete('/inventory/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = 'DELETE FROM inventory WHERE id = ?';

  connection.query(sql, [itemId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete item from inventory' });
    }

    res.json({ message: 'Item deleted from inventory' });
  });
});

// Serve the client-side files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
*/