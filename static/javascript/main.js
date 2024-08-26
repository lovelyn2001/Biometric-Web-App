// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for scanning fingerprint
    document.getElementById('scanBtn').addEventListener('click', function() {
        if (window.PublicKeyCredential) {
            navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array([/* Random bytes sent by server */]),
                    rpId: window.location.hostname,
                    userVerification: "preferred"
                }
            }).then(function (assertion) {
                verifyAssertion(assertion);
            }).catch(function (err) {
                console.error(err);
                document.getElementById('status').innerText = 'Fingerprint scan failed!';
            });
        } else {
            document.getElementById('status').innerText = 'Fingerprint API not supported!';
        }
    });

    // Event listener for creating a passkey
    document.getElementById('createPasskeyBtn').addEventListener('click', function() {
        if (window.PublicKeyCredential) {
            // Request for passkey creation
            navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array([/* Random bytes sent by server */]),
                    rp: {
                        name: "Civil Intelligence System",
                        id: window.location.hostname
                    },
                    user: {
                        id: new Uint8Array(16), // Ideally, this should be a unique user ID from your server
                        name: "user@example.com", // Replace with the actual user's email
                        displayName: "User Name"
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required"
                    }
                }
            }).then(function (attestation) {
                registerPasskey(attestation);
            }).catch(function (err) {
                console.error(err);
                document.getElementById('status').innerText = 'Passkey creation failed!';
            });
        } else {
            document.getElementById('status').innerText = 'Passkey API not supported!';
        }
    });
});

function verifyAssertion(assertion) {
    fetch('/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: assertion.id,
            rawId: arrayBufferToBase64(assertion.rawId),
            type: assertion.type,
            response: {
                clientDataJSON: arrayBufferToBase64(assertion.response.clientDataJSON),
                authenticatorData: arrayBufferToBase64(assertion.response.authenticatorData),
                signature: arrayBufferToBase64(assertion.response.signature),
                userHandle: arrayBufferToBase64(assertion.response.userHandle)
            }
        })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              document.getElementById('status').innerText = 'Access Granted!';
              // Redirect or load the protected content
          } else {
              document.getElementById('status').innerText = 'Access Denied!';
          }
      });
}

function registerPasskey(attestation) {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: attestation.id,
            rawId: arrayBufferToBase64(attestation.rawId),
            type: attestation.type,
            response: {
                clientDataJSON: arrayBufferToBase64(attestation.response.clientDataJSON),
                attestationObject: arrayBufferToBase64(attestation.response.attestationObject)
            }
        })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              document.getElementById('status').innerText = 'Passkey created successfully!';
          } else {
              document.getElementById('status').innerText = 'Passkey creation failed!';
          }
      });
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
