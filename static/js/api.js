import { uint8ToBase64, base64ToUint8 } from './utils.js';

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

export async function retrieve(id) {
    let response = await fetch(`/retrieve/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let resp_json = await response.json();
    console.log(resp_json.ciphertext);
    return base64ToUint8(resp_json.ciphertext);
}