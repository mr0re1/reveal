import { uint8ToBase64 } from './utils.js';

export async function save(ciphertext) {
    let ct = uint8ToBase64(new Uint8Array(ciphertext));
    let response = await fetch('/save', {
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