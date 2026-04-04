---
description: Verify the Astro Subscribe Form using the Browser Subagent
---
# Verify Subscribe Form

This workflow leverages a browser subagent to verify the interactability and hydration of the `SubscribeForm.astro` client-side logic. 

1. Ensure the development server is running locally. If not, start it in the background using `npm run dev`.
2. Wait for the server to be ready.
3. Spawn the browser subagent with the following task:
   - Navigate to `http://localhost:4321`
   - Locate the email input inside the "Join the quillt" subscription block.
   - Enter a test email (e.g. `test@example.com`).
   - Click the "Subscribe" button.
   - Verify that the success message or API fallback error appears properly without throwing an unhandled Javascript exception in the console.
   - Return the status and console logs if any.
4. Report the result back to the user.
