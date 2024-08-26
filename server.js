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
    const isValid = verifyFingerprintAssertion(id, rawId, type, response);

    if (isValid) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/register', (req, res) => {
    const { id, rawId, type, response } = req.body;

    // Server-side handling of passkey registration
    const isRegistered = registerPasskey(id, rawId, type, response);

    if (isRegistered) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

function verifyFingerprintAssertion(id, rawId, type, response) {
    // Add your server-side verification logic here
    // This includes checking the challenge, signature, and authenticator data

    return true; // For simplicity, return true
}

function registerPasskey(id, rawId, type, response) {
    // Add your server-side registration logic here
    // This includes storing the public key and associated data in your database

    return true; // For simplicity, return true
}

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });


