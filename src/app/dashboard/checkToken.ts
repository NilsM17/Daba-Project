'use client';
let Token = "";
export async function checkToken(ptoken: string) {
    if (ptoken !== Token) {
        localStorage.removeItem('bearerToken');
            window.location.href = "/Login";
    }
}
export async function setToken(ptoken: string) {
    Token = ptoken;
}

export async function checkLocalStorage() {
    const tk = localStorage.getItem('bearerToken');
    if (tk) {
        return tk;
    }
}

