'use client';
import { get } from "http";
import { getToken } from "./checkTokenDB";
let Token: string | null = null; // Token stored in memory

export function setToken(ptoken: string) {
  Token = ptoken;
}

export async function checkToken(ptoken: string) {
  Token = await getToken(ptoken)
  if (!ptoken || ptoken !== Token) {
    Token = null; // Reset Token
    // Clear localStorage and redirect to login
    localStorage.removeItem('bearerToken');
    window.location.href = '/login';
  }
}

export async function checkLocalStorage() {
  const storedToken = localStorage.getItem('bearerToken');
  return storedToken || null;
}
