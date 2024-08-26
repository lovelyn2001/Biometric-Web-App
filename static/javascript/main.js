// main.js
document.addEventListener('DOMContentLoaded', function() {
    const signInBtn = document.getElementById('signInBtn');
    const loginBtn = document.getElementById('loginBtn');
    const createPasskeyBtn = document.getElementById('createPasskeyBtn');
    const loginWithPasskeyBtn = document.getElementById('loginWithPasskeyBtn');
    const statusDiv = document.getElementById('status');
    const instruction = document.getElementById('instruction');

    // Event listener for "Sign In"
    signInBtn.addEventListener('click', function() {
        instruction.innerText = 'Create a passkey to sign in.';
        createPasskeyBtn.style.display = 'block';
        loginBtn.style.display = 'none';
    });

    // Event listener for creating a passkey
    createPasskeyBtn.addEventListener('click', function() {
        if (window.PublicKeyCredential) {
            navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array([/* Random bytes sent by server */]),
                    rp: {
                        name: "Civil Intelligence Center",
                        id: window.location.hostname
                    },
                    user: {
                        id: new Uint8Array(16), // Replace with a unique user ID from your server
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
                statusDiv.innerText = 'Passkey creation failed!';
            });
        } else {
            statusDiv.innerText = 'Passkey API not supported!';
        }
    });

    // Event listener for "Login"
    loginBtn.addEventListener('click', function() {
        fetch('/check-passkey')
            .then(response => response.json())
            .then(data => {
                if (data.hasPasskey) {
                    instruction.innerText = 'Please login with your passkey.';
                    loginWithPasskeyBtn.style.display = 'block';
                } else {
                    statusDiv.innerText = 'No passkey found. Please create a passkey first.';
                }
            });
    });

    // Event listener for logging in with passkey
    loginWithPasskeyBtn.addEventListener('click', function() {
        if (window.PublicKeyCredential) {
            navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array([/* Random bytes sent by server */]),
                    rpId: window.location.hostname,
                    userVerification: "required"
                }
            }).then(function (assertion) {
                verifyAssertion(assertion);
            }).catch(function (err) {
                console.error(err);
                statusDiv.innerText = 'Login failed!';
            });
        } else {
            statusDiv.innerText = 'Passkey API not supported!';
        }
    });

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
                  statusDiv.innerText = 'Passkey created successfully!';
                  loginWithPasskeyBtn.style.display = 'block';
              } else {
                  statusDiv.innerText = 'Passkey creation failed!';
              }
          });
    }

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
                  window.location.href = '/welcome';
              } else {
                  statusDiv.innerText = 'Access Denied!';
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
});
