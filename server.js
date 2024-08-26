
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static")));

const passkeyFilePath = path.join(__dirname, 'passkeys.json');

// Utility function to load stored passkeys
function loadPasskeys() {
    if (fs.existsSync(passkeyFilePath)) {
        const data = fs.readFileSync(passkeyFilePath);
        return JSON.parse(data);
    }
    return {};
}

// Utility function to save passkeys
function savePasskeys(passkeys) {
    fs.writeFileSync(passkeyFilePath, JSON.stringify(passkeys));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/register', (req, res) => {
    const { id, rawId, type, response } = req.body;

    const passkeys = loadPasskeys();
    passkeys["user@example.com"] = { id, rawId, type, response }; // Store passkey data for user

    savePasskeys(passkeys);
    res.json({ success: true });
});

app.get('/welcome', (req, res) => {
    res.send('<h1>Welcome to the Civil Intelligence Center</h1>');
});

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
