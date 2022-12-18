

const IV = new Uint8Array(16); // constant 0 IV

async function do_encryption(plaintext) {
    let subtle = window.crypto.subtle;

    let key = await subtle.generateKey(
        {
            name: "AES-GCM",
            length: 128
        },
        true,
        ["encrypt", "decrypt"]
    );

    let ciphertext = await subtle.encrypt(
        {
            name: "AES-GCM",
            iv: IV
        },
        key,
        plaintext
    );

    let raw_key = await subtle.exportKey("raw", key);

    return {
        ciphertext: ciphertext,
        key: raw_key
    };
}

async function do_decryption(key, ciphertext) {
    let subtle = window.crypto.subtle;

    let imported_key = await subtle.importKey(
        "raw",
        key,
        {
            name: "AES-GCM",
            length: 128
        },
        true,
        ["encrypt", "decrypt"]
    );

    let plaintext = await subtle.decrypt(
        {
            name: "AES-GCM",
            iv: IV
        },
        imported_key,
        ciphertext
    );
    return plaintext;
}

function uint8ToBase64(arr) {
    return btoa(
        Array(arr.length)
            .fill('')
            .map((_, i) => String.fromCharCode(arr[i]))
            .join('')
    );
    }

function base64ToUint8(str) {
    return new Uint8Array(
        atob(str)
            .split('')
            .map(c => c.charCodeAt(0))
    );
}

function utf8ToUint8(str) {
    return new TextEncoder().encode(str);
}

function uint8ToUtf8(arr) {
    return new TextDecoder().decode(arr);
}

async function save(ciphertext) {
    let ct = uint8ToBase64(new Uint8Array(ciphertext));
    response = await fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ciphertext: ct
        })
    });
    return response.json();
}


