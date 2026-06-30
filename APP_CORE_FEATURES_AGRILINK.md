# AgriLink — Core Features, End-to-End Flows, and Project Rules/Specifications

This document lists the **core features** of the AgriLink app and provides the **detailed flow** for each process, plus the **rules/specifications** that govern user roles, listing management, reservation handling, escalation logic, verification, and market event coordination.

> **Revised Title:** AgriLink: A Mobile-Based Agricultural Marketplace
> Image-based crop search remains a **supporting feature** — the primary focus is the cooperative marketplace and its operational processes.

> Source of truth for specs/flows in this repo:
> - `APP_CORE_FEATURES.md` (this file)
> - `database/schema.sql` (canonical data model + enums/statuses)
> - `TODO.md` (implementation gaps / checklist)

---

## 1) Navigation & Screen Grouping (How the app is organized)

### 1.1 Route Groups (expo-router)

Routes are defined via `app/` and `app/_layout.tsx` (stack + tabs). Core modules:

- **Auth:**
  - `app/auth/login.tsx`
  - `app/auth/register.tsx`
  - `app/auth/register-farmer.tsx` (cooperative membership step)
  - `app/auth/forgot-password.tsx`
  - `app/auth/otp.tsx`
  - `app/auth/reset-password.tsx`

- **Tabs (Farmer):**
  - `app/(tabs)/index.tsx` (Home / Dashboard)
  - `app/(tabs)/listings.tsx` (My Listings hub)
  - `app/(tabs)/orders.tsx` (Orders / Reservations)
  - `app/(tabs)/messages.tsx` (Chat hub)
  - `app/(tabs)/profile.tsx` (Profile hub)

- **Tabs (Buyer):**
  - `app/(tabs)/index.tsx` (Home / Browse)
  - `app/(tabs)/marketplace.tsx` (Browse Crops)
  - `app/(tabs)/reservations.tsx` (My Reservations)
  - `app/(tabs)/messages.tsx` (Chat hub)
  - `app/(tabs)/profile.tsx` (Profile hub)

- **Tabs (Coordinator):**
  - `app/(tabs)/index.tsx` (Coordinator Dashboard)
  - `app/(tabs)/listings.tsx` (All Listings Oversight)
  - `app/(tabs)/farmers.tsx` (Farmer Management)
  - `app/(tabs)/events.tsx` (Market Events)
  - `app/(tabs)/messages.tsx` (Chat Monitor)
  - `app/(tabs)/profile.tsx` (Profile hub)

- **Tabs (System Admin):**
  - `app/(tabs)/index.tsx` (Admin Dashboard)
  - `app/(tabs)/users.tsx` (User Account Management)
  - `app/(tabs)/reports.tsx` (Reports & Flags)
  - `app/(tabs)/logs.tsx` (System Logs)

- **Marketplace / Listing Detail Screens:**
  - `app/marketplace/index.tsx` (Browse all crops)
  - `app/marketplace/[id].tsx` (Crop listing detail)
  - `app/marketplace/search.tsx` (Text + image-based search)
  - `app/marketplace/image-search.tsx` (Image-based crop search)

- **Listings (Farmer):**
  - `app/listings/create.tsx`
  - `app/listings/[id].tsx`
  - `app/listings/edit/[id].tsx`

- **Orders / Reservations:**
  - `app/orders/index.tsx`
  - `app/orders/[id].tsx`
  - `app/orders/receipt/[id].tsx`

- **Events:**
  - `app/events/index.tsx`
  - `app/events/[id].tsx`
  - `app/events/create.tsx` (Coordinator only)

- **Messages:**
  - `app/messages/index.tsx`
  - `app/messages/[threadId].tsx`

- **Crop Info Module:**
  - `app/crop-info/index.tsx`
  - `app/crop-info/[id].tsx`

- **Map:**
  - `app/map/index.tsx`

- **Profile:**
  - `app/profile/edit.tsx`
  - `app/profile/history.tsx`
  - `app/profile/earnings.tsx` (Farmer only)
  - `app/profile/settings.tsx`
  - `app/profile/report.tsx`

---

## 2) Core Modules Overview

- **Authentication (Onboarding / Auth Module)**
- **Home / Dashboard** (role-specific)
- **Marketplace** (Browse, Search, Image Search)
- **Listings** (Farmer crop listing management)
- **Reservations & Orders**
- **Messages / Chat** (with escalation)
- **Market Events**
- **Crop Information Module**
- **Interactive Map**
- **Profile & Settings**
- **Admin Panel** (System Admin only)

---

## 3) User Types & Permissions

### 3.1 Farmer

- Can self-register using cooperative membership ID.
  - Registration is **pending coordinator approval** before account is activated.
- Can create and manage own crop listings.
  - Only **1 active listing per crop type** at a time.
  - Listing window: **up to 48 hours before the assigned market date**, accepted until **market start time on the day itself**.
- Can assign **schedule tags** (market day / special event / cooperative store) to listings.
- Can update crop availability and quantity.
  - **Cannot reduce confirmed reservation quantities below total committed reservations** — must cancel/renegotiate existing confirmed reservations first.
- Can archive/delete a crop listing.
  - **Cannot archive a listing with active or reserved orders.**
- Can communicate directly with buyers through in-app messaging.
- Can receive order/reservation notifications.
- Can view own listing statuses: `Active`, `Reserved`, `Sold Out`, `Vouched`.
- Can view earning summary (total sold, pending payments, completed transactions).
- Can update personal profile and contact information.
- Can opt in to display farm location (barangay-level only) on the interactive map during registration.

### 3.2 Buyer

- Can self-register with **OTP mobile number verification**.
  - Cannot access the platform without completing OTP verification.
- Can browse all active crop listings.
  - Archived/expired listings are hidden from browse view.
- Can filter/search crops by type, availability, harvest date, or price.
- Can search crops using **image-based crop search** (CLIP-based vector similarity — discovery tool only; results not guaranteed).
- Can **reserve** products (not add-to-cart / not direct purchase).
  - Cannot negotiate or modify price.
- Can send inquiries to farmers via in-app messaging.
- Can track reservation/order status.
- Can view nearby farm land locations through the interactive map (barangay-level only).
- Can report suspicious accounts.

### 3.3 Coordinator

- Account is **provisioned directly by the System Admin** — no self-registration.
- Can review and **approve or reject** farmer registration requests.
- Can create crop listings **on behalf of farmers**.
  - Cannot edit listings owned directly by farmers unless acting "on behalf."
  - Coordinator's involvement is recorded in system logs (visible to admin only); listing publicly displays the farmer's name.
- Can assign **schedule tags** to listings.
- Can view **all chat threads** (read-only monitoring at all times).
- Can **intervene and reply** in farmer-managed chat threads **only when escalation is triggered**:
  - Farmer has not responded within **6 hours** of a reservation inquiry.
  - Farmer has not responded within **1 hour** on market day itself.
- Can send **internal notifications** to farmers (not visible to buyers) at any time.
- Can create and manage **special market events** (pop-up markets, special event venues).
- Can manage farmer profile details.
- Can review and publish content for the **agricultural product information module** (AI-assisted draft content reviewed before publication).
- Cannot participate in buying or reservation as a coordinator account.
- Cannot modify listings not created by themselves or on behalf of a farmer.

### 3.4 System Admin

- Can manage **all user accounts** (CRUD: view, add, edit, suspend, deactivate).
- Can approve, suspend, or deactivate **flagged accounts** pending investigation.
- Can oversee all crop listings and system activity.
  - Cannot modify listings directly.
- Can manage agricultural product information entries.
- Can monitor reports, system logs, and audit trails.
- Responsible for maintaining system availability and performance.
- Cannot participate in buying/reservation.
- Cannot interfere in buyer-farmer conversations unless via defined system escalation rules.

---

## 4) Authentication Module

### 4.1 Registration — Buyer

**Route:** `/auth/register`

1. User selects **Register as Buyer**.
2. User fills in the registration form:
   - First Name *(required)*
   - Middle Name *(optional)*
   - Last Name *(required)*
   - Email *(required, unique, valid format)*
   - Username *(required, unique)*
   - Password *(required, 8–16 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character)*
   - Confirm Password *(must match Password)*
   - Contact Number *(required, 11-digit)*
   - Address *(required: street, barangay, city/municipality, zip code, region)*
   - Profile Image *(required)*
3. App validates all required fields.
   - Spaces-only inputs are invalid.
   - Email must be unique in the system.
   - Username must be unique in the system.
4. On submit: OTP is sent to the registered **mobile number**.
5. User inputs **6-digit OTP**.
6. OTP verified → registration complete.
7. Display **"Registration Successful"** message.
8. Redirect to **Login**.

### 4.2 Registration — Farmer

**Route:** `/auth/register` → `/auth/register-farmer`

1. User selects **Register as Farmer**.
2. User fills in base registration form (same fields as Buyer — see 4.1).
3. Additional step: **Cooperative Membership Verification**
   - Input **Cooperative Membership ID**.
   - Upload **supporting membership document** (photo/scan).
4. On submit: account is created with status **`pending_approval`**.
5. Display **"Registration submitted. Awaiting coordinator approval."** message.
6. Coordinator reviews and approves (see Section 8.2).
7. On approval: farmer receives notification → account status changes to **`active`**.
8. Farmer can now log in.

#### Rules:
- Farmers **cannot log in** until their account is approved by a coordinator.
- Only one account per Cooperative Membership ID is allowed.

### 4.3 Login

**Route:** `/auth/login`

1. User inputs:
   - Username or Email
   - Password
2. App validates credentials.
3. If credentials are valid:
   - Check account status:
     - `pending_approval` → show **"Your account is awaiting coordinator approval."**
     - `suspended` → show **"Your account has been suspended. Contact support."**
     - `active` → proceed
4. Role-based redirection:
   - **Farmer** → Farmer Dashboard
   - **Buyer** → Buyer Home / Browse
   - **Coordinator** → Coordinator Dashboard
   - **System Admin** → Admin Dashboard
5. If credentials are invalid:
   - Show error: **"Incorrect username/email or password."**
   - Field-level validation: required field messages if empty.

### 4.4 Forgot Password

**Route:** `/auth/forgot-password` → `/auth/otp` → `/auth/reset-password`

1. User enters registered email.
2. App sends **6-digit OTP** to email.
   - OTP is valid for **15 minutes**.
   - Allow **Resend OTP** if not received.
3. User inputs OTP code.
4. OTP verified.
5. User sets a new password (same password rules as registration).
6. Password reset complete.
7. Redirect to **Login**.

---

## 5) Home / Dashboard Module

### 5.1 Farmer Dashboard

- **Greeting** with farmer's name.
- **Quick Stats Cards:**
  - Total Active Listings
  - Total Reserved Orders
  - Total Completed Transactions
  - Total Earnings (summary)
- **My Listings Preview** — top 3 active listings with status badges.
- **Order Notifications Badge** — pending orders requiring action.
- **Upcoming Market Events** — next scheduled market date with View Event CTA.
- **Quick Actions:**
  - Add Crop Listing
  - View All Listings
  - View Messages

### 5.2 Buyer Home

- **Greeting** with buyer's name.
- **Search Bar** — text search + image search icon shortcut.
- **Browse by Category** — quick crop type filter chips.
- **Upcoming Market Events** — latest event card with **View Event** button.
- **Featured Listings** — active listings sorted by recency.
- **Nearby Farms** — map preview shortcut showing barangay-level farm indicators.
- **Quick Actions:**
  - Browse All Crops
  - Image Search
  - View Map

### 5.3 Coordinator Dashboard

- **Greeting** with coordinator's name.
- **Pending Farmer Approvals** — count badge + quick action.
- **Listings Oversight Summary:**
  - Total active listings
  - Listings requiring attention
- **Escalated Chats** — active escalation threads requiring coordinator response.
- **Upcoming Market Events** — next event with manage button.
- **Recent System Activity** summary.

### 5.4 System Admin Dashboard

- **Overview Stats:**
  - Total registered users (by role)
  - Total active listings
  - Total completed transactions
  - Pending reports / flagged accounts
- **Recent System Logs** preview.
- **Quick Actions:**
  - Manage Users
  - View Reports
  - View Logs

---

## 6) Marketplace Module (Buyer-facing)

### 6.1 Browse Crops

**Route:** `/marketplace`

1. Buyer opens Browse Crops.
2. System displays all **active crop listings**.
   - Archived, expired, and sold-out listings are **hidden by default**.
   - Vouched listings are shown with a **Vouch badge**.
3. Buyer can:
   - Filter by: crop type, availability, price range, harvest date, market schedule.
   - Sort by: latest, price (low to high / high to low), closest market date.
   - Toggle between **grid** and **list** view.
4. Each listing card shows:
   - Crop name
   - Farmer name
   - Price per unit
   - Available quantity
   - Harvest date
   - Schedule tag (Market Day / Cooperative Store / Special Event)
   - Vouch badge (if coordinator-vouched)

### 6.2 Crop Listing Detail

**Route:** `/marketplace/[id]`

1. Buyer taps a listing card.
2. Detail screen shows:
   - Crop name, description, quality grade
   - Price per unit and available quantity
   - Harvest date
   - Farmer name and barangay (if opted in)
   - Schedule tag
   - Vouch badge (if applicable)
   - Farmer contact button (in-app message or phone call)
3. Buyer can:
   - **Reserve Crop** → opens reservation form (see Section 7.1)
   - **Contact Farmer** → opens in-app messaging thread
   - **View on Map** → opens map with farm barangay indicator

### 6.3 Image-Based Crop Search *(Supporting Feature)*

**Route:** `/marketplace/image-search`

> **Purpose:** Supplementary product discovery tool. Results are based on visual similarity and are not guaranteed to be accurate identifications.

1. Buyer taps **Image Search** icon (from home or browse screen).
2. Options:
   - **Upload from gallery**
   - **Capture with camera**
3. System processes image using **CLIP-based vector similarity matching**.
4. System returns active listings with visually similar characteristics, sorted by **cosine similarity score**.
5. Buyer can tap any result card to view the full listing detail.

#### Rules:
- Results are returned as a **discovery aid only**.
- Accuracy depends on image quality, lighting, and volume of active listings.
- No results guarantee accurate crop identification.
- Feature is accessible without pre-conditions (no eligibility gate).

### 6.4 Text Search

**Route:** `/marketplace/search`

1. Buyer types crop name or keyword.
2. System returns matching active listings in real time.
3. Same filter/sort options as Browse Crops apply.

---

## 7) Reservations & Orders Module

### 7.1 Making a Reservation (Buyer)

**Route:** Triggered from `/marketplace/[id]`

1. Buyer taps **Reserve Crop** on listing detail screen.
2. Reservation form opens:
   - Quantity *(required — cannot exceed available quantity)*
   - Preferred pickup date/time *(optional — subject to farmer confirmation)*
   - Notes to farmer *(optional)*
3. Buyer reviews and submits.
4. System checks:
   - Listing is still active.
   - Requested quantity does not exceed available quantity.
5. Reservation is created with status **`pending`**.
6. Farmer receives **reservation notification**.
7. Buyer sees status: **"Reservation submitted. Awaiting farmer confirmation."**

#### Reservation Status Flow:
```
pending → confirmed → completed
                   ↘ cancelled (by buyer or farmer)
         rejected (by farmer)
```

#### Rules:
- Buyer **cannot negotiate price** at reservation.
- Buyer can **cancel a pending reservation** before farmer confirms.
- Once confirmed, cancellation requires in-app messaging coordination.
- Farmer cannot reduce listing quantity below total confirmed reservation quantity.

### 7.2 Farmer Responds to Reservation

1. Farmer receives notification of new reservation.
2. Farmer opens reservation details:
   - Buyer name
   - Requested quantity
   - Preferred pickup date/time
   - Notes
3. Farmer can:
   - **Confirm** → reservation status changes to `confirmed`, buyer notified.
   - **Reject** → provide reason, status changes to `rejected`, buyer notified.
   - **Message Buyer** → open chat thread to negotiate pickup details.

#### Escalation Rule:
- If farmer does **not respond within 6 hours** of a reservation inquiry → coordinator is alerted and gains **reply access** to the buyer-farmer chat thread.
- If farmer does **not respond within 1 hour on market day** → same escalation triggered.
- Coordinator can send **internal notifications** to farmers (not visible to buyers) at any time.

### 7.3 Order Status Tracking (Buyer)

**Route:** `/orders/[id]`

- Buyer can view real-time reservation/order status:
  - `Pending` — submitted, awaiting farmer response
  - `Confirmed` — farmer accepted
  - `Cancelled` — cancelled by buyer or farmer
  - `Rejected` — farmer rejected with reason
  - `Completed` — pickup confirmed, transaction closed

### 7.4 Pickup Coordination

- Pickup schedule and logistics are coordinated **via in-app messaging** between buyer and farmer.
- The system provides a **pickup schedule field** on confirmed reservation detail (filled in by farmer or coordinator).
- AgriLink does **not provide delivery services** — buyer is responsible for pickup or independent delivery arrangement.

### 7.5 Order Receipt

**Route:** `/orders/receipt/[id]`

- Available after reservation is marked `completed`.
- Shows:
  - Crop name, quantity, price, total
  - Farmer name and contact
  - Pickup date (if recorded)
  - Transaction reference number
- Receipt can be shared (always available).
- Print/download enabled for **verified/completed** transactions.

---

## 8) Crop Listing Management Module (Farmer)

### 8.1 Create Crop Listing

**Route:** `/listings/create`

1. Farmer taps **Add Crop Listing**.
2. Fills in listing form:
   - Crop name *(required)*
   - Description *(optional)*
   - Quality grade *(required: A / B / C or cooperative-defined grades)*
   - Quantity available *(required)*
   - Unit of measure *(required: kg / bundle / piece / etc.)*
   - Price per unit *(required)*
   - Harvest date *(required)*
   - Crop image(s) *(required, at least 1)*
3. Assigns **schedule tag** *(required)*:
   - `Market Day` — linked to a specific upcoming market event date
   - `Cooperative Store` — available at the permanent cooperative store
   - `Special Event` — linked to a coordinator-created special event
4. Reviews and submits.
5. System validates:
   - Only **1 active listing per crop type** per farmer.
   - Listing window: **up to 48 hours before the assigned market date** (or before market start time on market day).
6. Listing created with status **`active`**.
7. Display **"Listing created successfully."**

#### Rules:
- Price is **not editable** once at least one confirmed reservation exists.
- Quantity can be updated unless it would drop below total confirmed reservation quantity.
- System prevents duplicate active listing for the same crop type per farmer.
- Coordinator-created listings on behalf of farmers:
  - Display the **farmer's name** publicly.
  - Coordinator's involvement logged in system (admin-visible only).

### 8.2 View Own Listings

**Route:** `/listings`

- Farmer sees all their listings with status badges:
  - `Active` — visible to buyers, accepting reservations
  - `Reserved` — has at least one confirmed reservation
  - `Sold Out` — quantity depleted
  - `Vouched` — coordinator has vouched for legitimacy/quality
  - `Archived` — removed from public view
  - `Pending` — awaiting coordinator review (if coordinator-created on behalf)

### 8.3 Edit Crop Listing

**Route:** `/listings/edit/[id]`

1. Farmer selects listing to edit.
2. Editable fields:
   - Description
   - Quality grade
   - Quantity *(only if no confirmed reservations would be violated)*
   - Price *(only if no confirmed reservations exist)*
   - Crop image(s)
   - Schedule tag
3. Farmer provides **reason for edit** (logged in system).
4. Saves changes → **"Listing updated successfully."**

#### Rules:
- Price is **locked** once a confirmed reservation exists.
- Quantity **cannot be reduced below total confirmed reservation quantity**.
- Edit action is logged in system audit trail.

### 8.4 Archive / Delete Listing

1. Farmer selects listing.
2. Taps **Archive Listing**.
3. System checks:
   - Listing must have status `Sold Out` to archive.
   - If active reservations exist → **"Cannot archive listing with active or reserved orders."**
4. If conditions met → listing archived (status: `Archived`), hidden from browse view.
5. Display **"Listing archived successfully."**

#### Rules:
- Archived listings are not deleted from the database — viewable in farmer's listing history.
- Listings cannot be re-activated once archived (future enhancement scope).

### 8.5 Coordinator Vouching

1. Coordinator reviews a farmer's active listing.
2. Coordinator taps **Vouch Listing**.
3. Vouch badge is applied to the listing (visible to buyers on browse and detail screens).
4. Vouch action is logged.

#### Purpose:
- Increases buyer trust and listing legitimacy.
- Coordinator cannot modify the listing content when vouching.

---

## 9) Coordinator Module

### 9.1 Coordinator Dashboard

See Section 5.3.

### 9.2 Farmer Registration Approval

**Route:** Coordinator Dashboard → Pending Approvals

1. New farmer registration appears in coordinator's **Pending Approvals** queue.
2. Coordinator reviews:
   - Submitted registration details
   - Cooperative Membership ID
   - Supporting document/photo
3. Coordinator can:
   - **Approve** → farmer account activated (`active`), farmer notified.
   - **Reject** → provide reason, farmer notified, account not activated.
4. Approved farmers can now log in.

### 9.3 Create Listing on Behalf of Farmer

**Route:** `/listings/create` (Coordinator view)

1. Coordinator selects **Add Listing on Behalf of Farmer**.
2. Selects the target farmer from the member list.
3. Fills in listing details (same fields as farmer — see Section 8.1).
4. Assigns schedule tag.
5. Submits.
6. Listing displays farmer's name publicly; coordinator involvement logged (admin-visible only).

### 9.4 Market Events Management

**Route:** `/events`

#### Create Market Event:
1. Coordinator taps **Create Market Event**.
2. Fills in event details:
   - Event name *(required)*
   - Event type: `Regular Market Day` / `Special Event` / `Pop-Up Market`
   - Location / venue *(required)*
   - Date and time *(required)*
   - Description / notes *(optional)*
   - Map pin (Mapbox) *(required)*
3. Submits → event created and visible to all users on events list and interactive map.

#### Edit / Cancel Event:
1. Coordinator selects existing event.
2. Can edit details or mark as **Cancelled**.
3. If cancelled: all farmers with listings tagged to this event are notified.

### 9.5 Chat Monitoring & Escalation

**Route:** `/messages` (Coordinator view)

- Coordinator has **read-only access** to all active buyer-farmer chat threads at all times.
- Coordinator **cannot reply** in any thread unless escalation is triggered.

#### Escalation Trigger:
- Farmer has not responded within **6 hours** of a reservation inquiry, OR
- Farmer has not responded within **1 hour** on market day.

#### Escalation Flow:
1. System detects unresponsive farmer (trigger condition met).
2. Coordinator receives **escalation alert** notification.
3. Coordinator gains **reply access** to the specific chat thread.
4. Coordinator can message the buyer, coordinate the transaction, and log resolution.
5. Coordinator can send **internal notification** to farmer (not visible to buyer) to prompt response.
6. Once farmer responds, coordinator can step back from active reply (thread returns to standard farmer-managed state).

#### Rules:
- Coordinator **cannot proactively reply** in farmer-initiated threads before escalation is triggered.
- All coordinator interventions are logged in the system.

### 9.6 Manage Farmer Profiles

1. Coordinator navigates to **Farmer Management**.
2. Can view and edit farmer profile details (name, contact, membership status).
3. Can update farmer membership status.
4. All edits are logged in system audit trail.

### 9.7 Agricultural Product Information Module

1. Coordinator accesses **Crop Info Management**.
2. Creates or edits a crop information entry:
   - Crop name
   - Description
   - Common uses
   - Harvest season
   - Nutritional value
   - Tags (for browsing/filtering)
3. AI-assisted draft content is generated for review.
4. Coordinator reviews and approves content before publication.
5. Published entries are visible to all users in the **Crop Info** module.

#### Rules:
- Accuracy of published information depends on coordinator's review diligence.
- System does not independently validate crop information content.

---

## 10) Messages / Chat Module

### 10.1 Starting a Chat Thread

- A chat thread is created when:
  1. Buyer taps **Contact Farmer** on a listing detail screen, OR
  2. Buyer submits a reservation (system auto-creates thread for that reservation), OR
  3. Coordinator initiates an internal notification to a farmer.

### 10.2 Farmer-Buyer Chat

**Route:** `/messages/[threadId]`

1. Either party can send text messages.
2. Farmer can also share pickup schedule details in chat.
3. Buyer can send inquiry messages about the listing.
4. **In-app messaging is the default communication channel.**
   - Phone contact is an optional secondary channel (contact number shown on listing detail if farmer opts in).

### 10.3 Message Retention

- All in-app messages are retained for **90 days** from the date of conversation.
- Messages older than 90 days are **automatically purged** and cannot be recovered.
- Purpose: supports dispute resolution and transaction accountability within the retention window.

### 10.4 Coordinator Intervention in Chat

See Section 9.5 for escalation rules.

---

## 11) Market Events Module

### 11.1 View All Events (All Users)

**Route:** `/events`

- All users can view upcoming market events.
- Each event card shows:
  - Event name
  - Event type (Regular / Special / Pop-Up)
  - Date and time
  - Location / venue
  - Map pin shortcut
- Users can tap **Get Directions** (Mapbox navigation).
- Buyers and farmers can tap **View Listings for this Event** to see crops tagged to this market date.

### 11.2 Event Detail

**Route:** `/events/[id]`

- Full event details displayed.
- Map view of event venue.
- List of active listings tagged to this event (if any).
- **Get Directions** via Mapbox.

---

## 12) Crop Information Module (All Users)

**Route:** `/crop-info`

1. Users browse a curated list of crop articles.
2. Articles organized by tags:
   - `basics`
   - `uses`
   - `harvest`
   - `nutrition`
3. Article detail shows full curated content.
4. Accessible to all users without requiring an active transaction.

#### Content source:
- Coordinator-reviewed, AI-assisted draft entries (see Section 9.7).
- System does not auto-publish AI drafts — manual coordinator approval required.

---

## 13) Interactive Map Module

**Route:** `/map`

Displays the following layers (toggleable):

| Layer | Visibility | Details |
|---|---|---|
| Cooperative Store | Always shown | Permanent location + operating hours |
| Regular Market Locations | Always shown | Location + scheduled dates |
| Special Event Venues | When active | Created by coordinator |
| Farmer Farm Areas | Opt-in only | Barangay-level only (no exact GPS) |

#### Rules:
- Exact farm addresses/coordinates are **never collected or displayed**.
- Farm area visibility requires **farmer opt-in during registration**.
- Mapbox is used for map rendering and **Get Directions** navigation.

---

## 14) Profile Module

### 14.1 View Profile

- Displays registered information based on user role.
- Shows: profile image, name, contact number, address, account type.
- Farmers: also shows cooperative membership status and farm barangay (if opted in).

### 14.2 Edit Profile

**Route:** `/profile/edit`

1. User taps **Edit Profile**.
2. Editable fields:
   - Profile image
   - First name, middle name, last name
   - Contact number
   - Address
3. Save changes → **"Profile updated successfully."**

#### Rules:
- Email and username are **not editable** after registration (contact support for changes).
- Cooperative Membership ID is **not editable** by the farmer — requires coordinator/admin action.

### 14.3 Transaction / Order History

**Route:** `/profile/history`

- Shows all reservations and orders (all statuses).
- Tap a record → opens order detail / receipt.
- Print/download receipt: enabled for `completed` transactions only.
- Sharing is always available.

### 14.4 Earnings Summary (Farmer Only)

**Route:** `/profile/earnings`

- Total completed transactions
- Total earnings (sum of completed reservation values)
- Pending payments (confirmed reservations not yet completed)
- Simple chart (optional): earnings over time

### 14.5 Settings → Reset Password

**Route:** `/profile/settings` → `/auth/forgot-password`

1. User taps **Reset Password**.
2. Inputs registered email.
3. OTP sent to email.
4. Inputs OTP.
5. Sets new password.
6. Password reset complete.
7. App **logs user out automatically**.
8. User logs back in with new password.

### 14.6 Report a User

**Route:** `/profile/report`

1. User taps **Report User** (accessible from listing detail, chat thread, or profile settings).
2. Selects the account to report.
3. Selects reason:
   - Suspicious activity
   - Fraudulent listing
   - Inappropriate content
   - Other
4. Adds optional description.
5. Submits report → **"Report submitted. Our team will review this."**
6. Report is sent to System Admin for review.
7. Admin can suspend or deactivate flagged account pending investigation.

### 14.7 Logout

1. User taps **Logout**.
2. Confirmation dialog: **"Are you sure you want to log out?"**
   - **Confirm** → user is logged out, redirected to Login.
   - **Cancel** → dialog closes, no action.

---

## 15) System Admin Module

### 15.1 Admin Dashboard

See Section 5.4.

### 15.2 User Account Management (CRUD)

**Route:** `/users`

1. Admin views all registered user accounts (filterable by role, status).
2. Admin can:
   - **View** user details
   - **Edit** user roles or account status
   - **Suspend** account (status: `suspended`) — user cannot log in
   - **Deactivate** account (status: `deactivated`) — permanent
   - **Reactivate** suspended account
   - **Provision** new Coordinator account (no self-registration for coordinators)
3. Admin **cannot modify sensitive personal data** (passwords, payment info).
4. All admin actions are logged.

### 15.3 View All Crop Listings

- Admin can view all listings across all farmers (all statuses).
- Admin **cannot modify listings directly**.
- Admin can flag listings for coordinator review.

### 15.4 Reports & Flags

**Route:** `/reports`

1. Admin views all submitted user reports.
2. Each report shows:
   - Reporter name
   - Reported account
   - Reason
   - Date submitted
3. Admin can:
   - **Investigate** — review account activity and logs
   - **Dismiss** — mark report as resolved with no action
   - **Suspend** reported account
   - **Deactivate** reported account

### 15.5 System Logs

**Route:** `/logs`

- Real-time activity log viewer.
- Filterable by: user, action type, date range.
- Includes:
  - Login/logout events
  - Listing creates, edits, archives
  - Reservation status changes
  - Chat escalation triggers and resolutions
  - Account approvals, suspensions, deactivations
  - Coordinator listing actions on behalf of farmers
  - Report submissions and resolutions

### 15.6 Maintain System Availability

- Admin monitors system status.
- Performs maintenance as needed.
- No direct user interaction during maintenance windows.
- Maintenance windows should be coordinated to avoid scheduled market days.

---

## 16) Summary of Key Rules & Business Logic

### Listing Rules
- Only **1 active listing per crop type** per farmer at any time.
- Listing window: **up to 48 hours before market date**, accepted until market start time on market day.
- Price is **locked** once a confirmed reservation exists.
- Quantity **cannot drop below total confirmed reservation quantity**.
- Listings cannot be archived if active reservations exist.

### Reservation Rules
- Buyers **reserve** — they do not directly purchase or add to cart.
- Price is **non-negotiable** at reservation stage.
- Coordination (pickup, payment) happens **outside the platform** or via in-app messaging.
- AgriLink does **not process payments or provide delivery**.

### Escalation Rules
- Coordinator escalation is triggered when farmer is unresponsive:
  - **6 hours** after a reservation inquiry (general)
  - **1 hour** on market day
- Coordinator gains reply access **only upon trigger** — not proactively.
- Coordinator has **read-only** access to all threads at all times.

### Verification Rules
- Farmers: **Cooperative Membership ID + coordinator approval** (no self-activation).
- Buyers: **OTP mobile verification** (sufficient for buyer trust tier).
- Coordinators: **provisioned by System Admin** (no self-registration).

### Message Retention
- All messages retained for **90 days** then auto-purged.

### Map Rules
- Farm locations: **barangay-level only**, opt-in during registration.
- No exact GPS coordinates collected or displayed.

### Image Search Rules
- CLIP-based vector similarity — **discovery tool only**.
- Results not guaranteed; depend on image quality and active listing volume.

### Posting / Access Rules
- Anyone with an active account can browse listings.
- Farmers must be **approved** before creating listings.
- Coordinator-created listings always publicly display the **farmer's name**.

---

## 17) Enum / Status Reference

### Listing Status
| Status | Description |
|---|---|
| `active` | Visible to buyers, accepting reservations |
| `reserved` | Has at least one confirmed reservation |
| `sold_out` | Quantity depleted |
| `vouched` | Coordinator-vouched (overlaps with active/reserved) |
| `archived` | Removed from public browse; farmer-visible in history |
| `pending` | Coordinator-created listing awaiting farmer acknowledgment |

### Reservation/Order Status
| Status | Description |
|---|---|
| `pending` | Submitted by buyer, awaiting farmer response |
| `confirmed` | Farmer accepted the reservation |
| `cancelled` | Cancelled by buyer or farmer |
| `rejected` | Farmer declined with reason |
| `completed` | Pickup confirmed, transaction closed |

### User Account Status
| Status | Description |
|---|---|
| `pending_approval` | Farmer registered, awaiting coordinator approval |
| `active` | Account is active and operational |
| `suspended` | Temporarily restricted by admin (can be reactivated) |
| `deactivated` | Permanently deactivated by admin |

### Market Event Type
| Type | Description |
|---|---|
| `regular_market_day` | Scheduled recurring community market |
| `special_event` | One-time special event created by coordinator |
| `pop_up_market` | Short-notice pop-up market activity |
| `cooperative_store` | Permanent cooperative store (always active) |

### Schedule Tag (Listing)
| Tag | Description |
|---|---|
| `market_day` | Linked to a regular market event date |
| `cooperative_store` | Available at the permanent cooperative store |
| `special_event` | Linked to a coordinator-created special event |

---

## 18) Out of Scope (Current Phase)

The following are **explicitly out of scope** for the current development phase:

- Online payment processing of any kind.
- Delivery or logistics services.
- Multi-cooperative deployment (single-cooperative only in this phase).
- Processed food products, livestock, and non-agricultural items.
- Exact farm GPS coordinates (barangay-level only).
- Guaranteed crop identification via image search.
- Message recovery after 90-day purge.
- Full buyer identity verification beyond OTP.
- Coordinator proactive reply before escalation trigger.
- Listing re-activation after archiving.
