
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
    res.send(`
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #6a1b9a; /* Purple background for the whole body */
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    background-color: #fff; /* White background inside the container */
                    color: #000; /* Black text color */
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    width: 80%;
                    max-width: 800px;
                    text-align: center;
                }
                h1 {
                    color: #e1a5e; /* Custom purple color for the header */
                }
                p {
                    color: #333; /* Dark grey color for the paragraph text */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>The Civil Intelligence Center</h1>
                <p>The field of civil intelligence involves the strategic use of information to enhance public safety, governance, and societal functions. 
                This project, undertaken as part of my university studies in the department of Computer Science, aims to design and implement a sophisticated civil intelligence system 
                that employs biometric security features such as fingerprint and retina scanning. The primary objective is to develop a secure and efficient method for verifying identities 
                and controlling access, which is crucial for modern security systems.</p>
            </div>
        </body>
        </html>
    `);
});


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
