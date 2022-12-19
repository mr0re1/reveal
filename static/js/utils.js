export function uint8ToBase64(arr) {
    return btoa(
        Array(arr.length)
            .fill('')
            .map((_, i) => String.fromCharCode(arr[i]))
            .join('')
    );
    }

export function base64ToUint8(str) {
    return new Uint8Array(
        atob(str)
            .split('')
            .map(c => c.charCodeAt(0))
    );
}

export function utf8ToUint8(str) {
    return new TextEncoder().encode(str);
}

export function uint8ToUtf8(arr) {
    return new TextDecoder().decode(arr);
}
