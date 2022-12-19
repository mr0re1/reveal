import { base64ToUint8, uint8ToUtf8 } from "./utils.js";
import { do_decryption } from "./crypto.js";
import { retrieve } from "./api.js";

function get_hash() {
    let hash = window.location.hash;
    if (hash.length == 0) {
        console.error("No key found in URL");
        return null;
    }
    return hash.substring(1);
}

function show_plaintext(plaintext) {
    document.getElementById("inputs").hidden = true;
    
    document.getElementById("plaintext_output").innerHTML = plaintext;
    document.getElementById("outputs").hidden = false;
}


function reveal() {
    let key_b64 = document.getElementById("key_input").value;
    if (key_b64.length == 0) {
        return alert("Please enter a key");
    }
    let key = base64ToUint8(key_b64);
    let id = document.getElementById("data_vault").getAttribute("data-id");
    
    retrieve(id).then(function (ct) {
        do_decryption(key, ct).then(function (result) {
            show_plaintext(uint8ToUtf8(result));
        });
    });
}

function on_load() {
    let key_b64 = get_hash();
    if (key_b64 != null) {
        document.getElementById("key_input").value = key_b64;
    }
    /*
    let ct_b64=document.getElementById("ciphertext_vault").getAttribute("data-ciphertext");
    let ct = base64ToUint8(ct_b64);
    let key = base64ToUint8(get_hash());
    
    ); */
}

document.addEventListener("DOMContentLoaded", on_load)
document.getElementById("reveal_button").addEventListener("click", reveal);