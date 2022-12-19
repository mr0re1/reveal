import { base64ToUint8, uint8ToUtf8 } from "./utils.js";
import { do_decryption } from "./crypto.js";

function get_hash() {
    let hash = window.location.hash;
    if (hash.length == 0) {
        console.error("No key found in URL");
        return null;
    }
    return hash.substring(1);
}

function on_load() {
    let ct_b64=document.getElementById("ciphertext_vault").getAttribute("data-ciphertext");
    let ct = base64ToUint8(ct_b64);
    let key = base64ToUint8(get_hash());
    
    do_decryption(key, ct).then(function (result) {
        let plaintext = uint8ToUtf8(result);
        document.getElementById("plaintext_output").innerHTML = plaintext;
    });
}

document.addEventListener("DOMContentLoaded", on_load)