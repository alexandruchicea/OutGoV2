### Issue: POST request to /api/activities not working

**Root Cause:** The `src/outgo-app/src/app/api/activities/route.ts` file was missing a `POST` function to handle incoming activity creation requests. It only contained a `GET` endpoint.

**Resolution:** A `POST` function was added to `src/outgo-app/src/app/api/activities/route.ts` to handle the insertion of new activity data into the Supabase database. The function includes user authentication check and sets the `merchant_id` based on the authenticated user's ID.

**Verification:** Send a POST request to `/api/activities` with a JSON body containing activity data. The API should now successfully create a new activity in the database.

### Issue: next/image unconfigured hostname
**Root Cause:** The `next/image` component was attempting to load an image from `https://example.com/sample-image.jpg`, but the hostname "example.com" was not configured in `next.config.js` under the `images.domains` array.
**Resolution:** Added `example.com` to the `domains` array within the `images` configuration in `src/outgo-app/next.config.ts`.
**Verification:** The application should now be able to load images from `example.com` without error.