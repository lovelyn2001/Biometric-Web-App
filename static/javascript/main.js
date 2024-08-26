// main.js
document.getElementById('scanBtn').addEventListener('click', function() {
    // Simulate fingerprint scanning process
    if (window.PublicKeyCredential) {
        navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array([/* Random bytes sent by server */]),
                rpId: window.location.hostname,
                userVerification: "preferred"
            }
        }).then(function (assertion) {
            // Send the assertion to the server for verification
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
        }).catch(function (err) {
            console.error(err);
            document.getElementById('status').innerText = 'Fingerprint scan failed!';
        });
    } else {
        document.getElementById('status').innerText = 'Fingerprint API not supported!';
    }
});

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
