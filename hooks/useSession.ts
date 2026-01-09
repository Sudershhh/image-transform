'use client';

// Session is managed server-side via HTTP-only cookies
// This hook is kept for potential future use but currently not needed
// since session is automatically handled by the server
export function useSession() {
  // Session ID is managed server-side via HTTP-only cookies
  // Client doesn't need to know the session ID
  return { sessionId: null };
}
