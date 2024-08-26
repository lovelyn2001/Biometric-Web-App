// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "static")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/verify', (req, res) => {
    const { id, rawId, type, response } = req.body;

    // Perform server-side verification of the fingerprint assertion
    // This typically involves checking the challenge, signature, and authenticator data

    const isValid = verifyFingerprintAssertion(id, rawId, type, response);

    if (isValid) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

function verifyFingerprintAssertion(id, rawId, type, response) {
    // Add your server-side verification logic here
    // This is a simplified example, in a real application you would need to:
    // - Verify the signature with the public key
    // - Verify the challenge matches the one sent to the client
    // - Validate the authenticator data

    return true; // For simplicity, we return true here
}

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
