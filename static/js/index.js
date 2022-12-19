import { do_encryption } from "./crypto.js";
import { uint8ToBase64, utf8ToUint8 } from "./utils.js";
import { save } from "./api.js";

function get_plaintext_input() {
    let plaintext = document.getElementById("plaintext_input").value;
    return utf8ToUint8(plaintext);
}

function compose_url(id, key) {
    let protocol = window.location.protocol;
    let host = window.location.host;
    let key_b64 = uint8ToBase64(new Uint8Array(key));
    return `${protocol}//${host}/${id}#${key_b64}`;
}

function on_make_button_click() {
    hide_alert()
    let plaintext = get_plaintext_input();
    if (plaintext.length == 0) {
        return show_alert("Please enter some text to encrypt");
    }

    do_encryption(plaintext).then(function (result) {
        let key = result.key;
        let ct = result.ciphertext;

        save(ct).then(function (response) {
            document.getElementById("page_author").hidden = true;
            show_link_page(compose_url(response.id, key))

        });

    });

}

function show_alert(txt) {
    let bar = document.getElementById("author_alert");
    bar.innerHTML = txt;
    bar.hidden = false
}

function hide_alert() {
    document.getElementById("author_alert").hidden = true;
}

function show_author_page() {
    hide_alert()
    document.getElementById("plaintext_input").innerHTML = "";
    document.getElementById("page_author").hidden = false;
}

function show_link_page(url) {
    let link = document.getElementById("link");
    link.href = url;
    link.innerHTML = url;
    document.getElementById("page_link").hidden = false;
}

document.getElementById("make_button").addEventListener("click", on_make_button_click);
document.addEventListener("DOMContentLoaded", show_author_page)