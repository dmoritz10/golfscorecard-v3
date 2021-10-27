

function btnAuthHtml(event) {

    handleAuthClick();
    
}
    
function btnSignoutHtml(event) {

    handleSignoutClick();
    gotoTab('Auth')
}
      
async function btnEncryptHtml(event) {

  let msg = "hi dan"
  let key = "cTeetime101"

  var encryptMsg = await encryptMessage(key, msg)

  
console.log('encryptMsg')
console.log(encryptMsg)


}

async function btnDecryptHtml(event) {




    
}
async function encryptMessage(key, msg) {
    var encoded = msg;
    // The iv must never be reused with a given key.
    var iv = window.crypto.getRandomValues(new Uint8Array(12));
    var ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encoded
    )
    .then(function (encrypted) {
        console.log(new Uint8Array(encrypted));
        resolve (new Uint8Array(encrypted))
    })
    .catch(function (err) {
        console.error(err);
    });
}

async function decryptMessage(key, msg) {
    let encoded = msg;
    let decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encoded
    )
    .then(function (decrypted) {
        console.log(new Uint8Array(encrypted));
    })
    .catch(function (err) {
        console.error(err);
    });
}

