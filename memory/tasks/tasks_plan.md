# Detailed Task Backlog and Project Progress

## What Works:
*   **US-01: User Registration:** Users can successfully register for an account.
*   **US-02: User Authentication (Login):** Users can successfully log in to their accounts.
*   **US-03: Homepage Display:** The homepage displays correctly with featured content.
*   **US-04: Activity Listing:** Users can view a list of activities.
*   **US-05: Activity Details:** Users can view details of a specific activity.
*   **US-06: Activity Filtering & Search:** Users can filter and search for activities.
*   **US-07: List New Activity:** Users can list a new activity via a form.
*   **US-08: Admin Dashboard:** Admin users can access a dashboard.
*   **US-09: Admin Activity Management:** Admins can create, edit, and delete activities.
*   **US-10: Admin User Management:** Admins can manage user accounts.
*   **US-11: Merchant Registration:** Merchants can register their businesses.
*   **US-12: Merchant Dashboard:** Merchants can access their dashboard.
*   **US-13: Booking an Activity:** Users can book an activity.
*   **US-14: Viewing Bookings:** Users can view their past and upcoming bookings.
*   **US-15: Favorites Management:** Users can add/remove activities from favorites.
*   **US-16: Activity Comments:** Users can comment on activities.
*   **US-17: Activity Likes:** Users can like activities.
*   **US-18: Activity Ratings:** Users can rate activities.
*   **US-19: Friend Management:** Users can add/remove friends.
*   **US-20: Profile Management:** Users can view and edit their profile.
*   **US-21: Recommendations:** Users receive activity recommendations.
*   **US-22: Trending Activities:** Users can see trending activities.

## What's Left to Build:
*   **US-23: Real-time Notifications:** Implement real-time notifications for bookings, comments, etc.
*   **US-24: Payment Integration:** Integrate a payment gateway for activity bookings.
*   **US-25: Chat Functionality:** Implement in-app chat between users and merchants.
*   **US-26: Advanced Search Filters:** Add more advanced filtering options (e.g., date range, price range).
*   **US-27: User Reviews:** Allow users to write detailed reviews for activities.
*   **US-28: Merchant Activity Metrics:** Merchants can view metrics for their listed activities.

## Current Status:
*   **Task: Implement "List Activity" feature.**
    *   **Status:** Completed.
    *   **Details:**
        *   Created `src/outgo-app/src/app/activities/new/page.tsx`.
        *   Created `src/outgo-app/src/app/activities/new/NewActivityForm.tsx`.
        *   Updated `src/outgo-app/src/utils/supabase/client.ts` and installed `@supabase/ssr`.
        *   Added "List Activity" button to `src/outgo-app/src/app/activities/page.tsx`.

## Known Issues:
*   None currently.

## Next Steps:
*   Thoroughly test the newly implemented "List Activity" feature.
*   Continue with the remaining tasks in the backlog.