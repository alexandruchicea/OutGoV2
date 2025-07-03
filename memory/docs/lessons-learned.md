# Lessons Learned

This document captures important patterns, preferences, and project intelligence to improve future work.

## General Lessons:
- Always verify file existence before attempting to read or modify.
- Ensure all required memory files are present and properly structured.
- When debugging persistent errors, especially those related to server-side APIs (like `cookies()` in Next.js), consider restarting the development server to ensure all changes are applied and cached errors are cleared.

## Project-Specific Lessons:
- **Supabase Client Initialization:** When using `@supabase/auth-helpers-nextjs` in server components or API routes, ensure `createRouteHandlerClient` (or `createServerComponentClient`) is initialized by passing the `cookies` *function* directly, not the *result* of calling `cookies()`.
- **Client-side Revalidation after Auth:** After authentication actions (sign-in/sign-out), use `router.refresh()` to force a re-render of server components and re-fetch data, ensuring the UI reflects the updated session status immediately.