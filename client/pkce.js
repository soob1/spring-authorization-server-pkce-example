const AS_BASE = "http://localhost:9000";
const CLIENT_ID = "public-client";
const REDIRECT_URI = "http://127.0.0.1:8080/callback";
const SCOPE = "openid profile";

function base64UrlEncode(bytes) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomVerifier(length = 64) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes);
}

export async function createPkcePair() {
    const verifier = randomVerifier(64);
    const data = new TextEncoder().encode(verifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const challenge = base64UrlEncode(hash);
    return { verifier, challenge };
}

export function authorize({ challenge, state }) {
    const url = new URL(AS_BASE + "/oauth2/authorize");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    url.searchParams.set("scope", SCOPE);
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");
    location.href = url.toString();
}

export async function exchangeToken({ code, verifier }) {
    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("client_id", CLIENT_ID);
    body.set("redirect_uri", REDIRECT_URI);
    body.set("code", code);
    body.set("code_verifier", verifier);

    const res = await fetch(AS_BASE + "/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error("token error: " + res.status + "\n" + text);
    }
    return res.json();
}
