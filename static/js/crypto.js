const IV = new Uint8Array(16); // constant 0 IV

export async function do_encryption(plaintext) {
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

export async function do_decryption(key, ciphertext) {
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
