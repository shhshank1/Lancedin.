/**
 * Centralized API client.
 * All fetch calls go through here — never hardcode localhost:3000 directly in components.
 *
 * In dev:  requests go to http://localhost:3000
 * In prod: requests go to the value of VITE_API_URL env variable (Railway URL)
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = {
  get: (path: string) =>
    fetch(`${BASE_URL}${path}`, {
      credentials: "include", // Always send the JWT cookie
    }),

  post: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }),

  put: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      credentials: "include",
    }),

  upload: (path: string, formData: FormData) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      body: formData, // No Content-Type header — browser sets it with boundary for multipart
    }),
};
