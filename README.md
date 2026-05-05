# IN◆NER — Exclusive Invite-Only Community App

> A curated community for professionals, artists, and thinkers who believe in the value of intentional connection.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Access](#demo-access)
- [App Flow](#app-flow)
- [Screens](#screens)
- [Architecture](#architecture)
- [Components](#components)
- [State Management](#state-management)
- [Services](#services)
- [Known Issues & Fixes](#known-issues--fixes)
- [Roadmap](#roadmap)
- [Screenshots](#screenshots)

---

## Overview

INNER is a mobile community app built with React Native + Expo Router. It features an application-gated membership system where users apply to join, admins review and approve applications, and approved members gain access to a curated directory, events board, and direct messaging.

The app is modelled after selective community apps like Lox Club — where curation and quality of connection take priority over scale.

---

## Features

### Member Features
- **Landing Page** — Animated hero with stats, feature highlights, and CTAs
- **Application Form** — 4-step form (Basics → Profile → Questions → Review)
- **Member Directory** — Grid/list toggle, search, filter by interest tag
- **Member Profiles** — Bio, interests, member since, direct message
- **Events Board** — Grouped by month, RSVP, virtual/in-person badges
- **Event Detail** — Full description, attendee list, RSVP toggle
- **Direct Messaging** — Conversation list, chat thread, message bubbles
- **Invite System** — Copy invite link, send by email, view history

### Admin Features
- **Admin Dashboard** — Stats overview, quick actions, activity feed
- **Application Review** — Expand/collapse cards, approve or reject
- **Member Management** — Search, sort, long-press multi-select, remove
- **Live Badge Counts** — Pending applications badge updates in real time
- **Sign Out** — Returns to landing page

---

## Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | React Native 0.74                   |
| Navigation       | Expo Router 3.5 (file-based)        |
| State Management | Zustand 4.5                         |
| Language         | TypeScript 5.3                      |
| Styling          | React Native StyleSheet             |
| Fonts            | Cormorant Garamond + DM Mono        |
| Gestures         | react-native-gesture-handler        |
| Safe Area        | react-native-safe-area-context      |
| Storage          | @react-native-async-storage         |
| Build Tool       | Expo (EAS)                          |

---

## Project Structure

```
inner-app/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout — fonts, providers
│   ├── index.tsx                 # Entry redirect (auth check)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Landing page
│   │   ├── apply.tsx             # 4-step application form
│   │   └── invite-entry.tsx      # Invite code entry
│   ├── (member)/
│   │   ├── _layout.tsx           # Tab navigator + sign out header
│   │   ├── directory/
│   │   │   ├── index.tsx         # Member grid/list
│   │   │   └── [id].tsx          # Member profile
│   │   ├── events/
│   │   │   ├── index.tsx         # Events board
│   │   │   └── [id].tsx          # Event detail
│   │   ├── messages/
│   │   │   ├── index.tsx         # Conversation list
│   │   │   └── [id].tsx          # Chat thread
│   │   └── invite.tsx            # Invite & refer
│   └── (admin)/
│       ├── _layout.tsx           # Admin tab navigator
│       ├── dashboard.tsx         # Stats + activity feed
│       ├── applications.tsx      # Review queue
│       └── members.tsx           # Member management
│
├── components/
│   ├── admin/                    # StatCard, ApplicationRow, ActivityFeed...
│   ├── application/              # StepIndicator, FormField, InterestTagPicker...
│   ├── directory/                # MemberCard, MemberGrid, FilterBar...
│   ├── events/                   # EventCard, EventsList, EventDetailSheet...
│   ├── messages/                 # MessageBubble, ChatInput, ConversationList...
│   └── ui/                       # Button, Avatar, Badge, Tag, Toast...
│
├── constants/
│   ├── theme.ts                  # Colors, fonts, spacing, shadows
│   ├── data.ts                   # Seed data — members, events, conversations
│   ├── config.ts                 # API config, feature flags, regex
│   └── filters.ts                # Filter options, step configs
│
├── hooks/
│   ├── useAuth.ts
│   ├── useMembers.ts
│   ├── useEvents.ts
│   ├── useMessages.ts
│   ├── useInvites.ts
│   ├── useAdminApplications.ts
│   ├── useAdminMembers.ts
│   └── useForm.ts
│
├── services/
│   ├── api.ts                    # Base fetch client, error handling
│   ├── auth.service.ts
│   ├── members.service.ts
│   ├── events.service.ts
│   ├── messages.service.ts
│   ├── invites.service.ts
│   └── admin.service.ts
│
├── store/
│   ├── authStore.ts
│   ├── memberStore.ts
│   ├── eventStore.ts
│   ├── messageStore.ts
│   └── adminStore.ts
│
├── types/
│   ├── auth.types.ts
│   ├── member.types.ts
│   ├── event.types.ts
│   ├── message.types.ts
│   ├── application.types.ts
│   ├── invite.types.ts
│   ├── api.types.ts
│   ├── ui.types.ts
│   └── navigation.types.ts
│
├── utils/
│   ├── formatDate.ts
│   ├── initials.ts
│   ├── validators.ts
│   ├── format.ts
│   ├── storage.ts
│   ├── colors.ts
│   ├── array.ts
│   └── debounce.ts
│
├── assets/
│   └── fonts/
│       ├── CormorantGaramond-Light.ttf
│       ├── CormorantGaramond-Regular.ttf
│       ├── CormorantGaramond-Italic.ttf
│       ├── DMMono-Regular.ttf
│       └── DMMono-Medium.ttf
│
├── app.json
├── babel.config.js
├── tsconfig.json
├── metro.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (Android or iOS)
- Or an Android/iOS emulator

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/inner-app.git
cd inner-app

# 2. Install dependencies
npm install

# 3. Install Expo dependencies
npx expo install \
  expo-router \
  expo-font \
  expo-status-bar \
  expo-linking \
  expo-constants \
  expo-modules-core \
  react-native-safe-area-context \
  react-native-screens \
  react-native-gesture-handler \
  react-native-reanimated \
  @react-native-async-storage/async-storage \
  zustand

# 4. Download fonts into assets/fonts/
# Cormorant Garamond: https://fonts.google.com/specimen/Cormorant+Garamond
# DM Mono: https://fonts.google.com/specimen/DM+Mono

# 5. Start the development server
npx expo start --clear
```

### Running on Device

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Scan QR code with Expo Go app
npx expo start
```

---

## Demo Access

The app uses invite codes to authenticate. No sign-up required.

| Role   | Invite Code | Access                    |
|--------|-------------|---------------------------|
| Member | `jd-a9k2p`  | Directory, Events, Messages, Invite |
| Admin  | `ad-00001`  | Dashboard, Applications, Members   |

### How to log in

1. Open the app — you'll land on the home page
2. Tap **"I Have an Invite"**
3. Enter a demo code from the table above (or tap the pre-filled buttons)
4. Tap **"Enter Community"**
5. You'll be redirected to the member directory or admin dashboard

### How to apply for membership

1. From the landing page, tap **"Apply for Membership"**
2. Fill out the 4-step form
3. Submit — your application is saved to the admin store
4. Sign in as admin (`ad-00001`) to review it under the **Applications** tab

### How to sign out

- **Members** — tap **"Sign Out"** in the top-right header
- **Admins** — tap **"Sign Out"** in the dashboard header or the footer link

---

## App Flow

```
App Launch
    │
    ├── Not authenticated
    │       └── Landing Page
    │               ├── "Apply for Membership" → 4-step form → Success
    │               └── "I Have an Invite"
    │                       ├── jd-a9k2p → Member Directory
    │                       └── ad-00001 → Admin Dashboard
    │
    └── Authenticated
            ├── Member → Directory (tab navigator)
            │       ├── Directory
            │       ├── Events
            │       ├── Messages
            │       └── Invite
            └── Admin → Dashboard (tab navigator)
                    ├── Dashboard
                    ├── Applications
                    └── Members
```

---

## Screens

### Auth Screens

| Screen         | Route                   | Description                              |
|----------------|-------------------------|------------------------------------------|
| Landing        | `/(auth)`               | Hero, stats, CTAs                        |
| Apply          | `/(auth)/apply`         | 4-step membership application form       |
| Invite Entry   | `/(auth)/invite-entry`  | Enter invite code to access community    |

### Member Screens

| Screen           | Route                          | Description                        |
|------------------|--------------------------------|------------------------------------|
| Directory        | `/(member)/directory`          | Member grid with search + filters  |
| Member Profile   | `/(member)/directory/[id]`     | Full profile, message, refer       |
| Events           | `/(member)/events`             | Events grouped by month            |
| Event Detail     | `/(member)/events/[id]`        | Full event info + RSVP             |
| Messages         | `/(member)/messages`           | Conversation list                  |
| Chat Thread      | `/(member)/messages/[id]`      | Chat with a member                 |
| Invite           | `/(member)/invite`             | Copy link, send invite, history    |

### Admin Screens

| Screen         | Route                     | Description                              |
|----------------|---------------------------|------------------------------------------|
| Dashboard      | `/(admin)/dashboard`      | Stats, quick actions, activity feed      |
| Applications   | `/(admin)/applications`   | Review pending/approved/rejected         |
| Members        | `/(admin)/members`        | Search, sort, manage all members         |

---

## Architecture

### Navigation

Expo Router handles all navigation via the file system. Route groups `(auth)`, `(member)`, and `(admin)` keep screen sets isolated. `app/index.tsx` reads auth state and redirects using `<Redirect />` — this is declarative and avoids the "navigate before mount" error that `useEffect` + `router.replace` can cause.

### State Management

Zustand stores are kept intentionally thin — they hold raw data and expose simple actions. Business logic (filtering, sorting, validation) lives in hooks which compose the stores. This means:

- Screens import hooks, not stores directly
- Hooks import stores + utils
- Stores import services + types

### Services Layer

Every service method has a production API call commented out directly above the mock implementation. Swapping live for mock is a 3-line change per method when the backend is ready.

### Optimistic Updates

RSVP toggles and application decisions update the local store immediately, fire the API call in the background, and roll back on failure. This keeps the UI feeling instant.

---

## Components

### UI Primitives (`components/ui/`)

| Component      | Description                                      |
|----------------|--------------------------------------------------|
| `Button`       | 5 variants: primary, outline, ghost, danger, gold |
| `Avatar`       | Size scale xs–xl, online dot, group stacking     |
| `Badge`        | Status labels with 6 tone options                |
| `Tag`          | Selectable interest tags                         |
| `Toast`        | Slide-in notifications with action button        |
| `Divider`      | Horizontal/vertical, labeled variant             |
| `EmptyState`   | Icon + title + hint + optional CTA               |
| `LoadingScreen`| Full-screen loader with animated diamond         |
| `SkeletonBlock`| Pulsing placeholder for content loading          |

### Domain Components

- **`components/directory/`** — `MemberCard` (grid + list variants), `MemberGrid`, `FilterBar`, `MemberProfileSheet`
- **`components/events/`** — `EventCard` (default + compact + featured), `EventsList`, `EventsFilter`, `EventDetailSheet`, `AttendeeRow`
- **`components/messages/`** — `MessageBubble`, `ChatInput`, `ChatHeader`, `ConversationItem`, `ConversationList`, `MessagesList`, `EmptyChat`
- **`components/application/`** — `StepIndicator`, `FormField`, `InterestTagPicker`, `FormSelect`, `ApplicationSummaryCard`, `SuccessScreen`
- **`components/admin/`** — `StatCard`, `AdminTabs`, `ApplicationRow`, `AdminMemberRow`, `ActivityFeed`, `QuickActionCard`

---

## State Management

### Stores

| Store          | Owns                                    |
|----------------|-----------------------------------------|
| `authStore`    | User, isAuthenticated, login, logout    |
| `memberStore`  | Member list, selected member, filters   |
| `eventStore`   | Events, RSVP state, sheet visibility    |
| `messageStore` | Conversations, messages, unread count   |
| `adminStore`   | Applications, stats, approve/reject     |

### Key Patterns

**Reading state:**
```ts
// In a component — subscribes to changes
const { user } = useAuthStore();

// Outside React — read once synchronously
const { user } = useAuthStore.getState();
```

**Selectors:**
```ts
// Memoised derived value — only re-renders when filtered result changes
const filtered = useEventStore(selectFilteredEvents);
```

---

## Services

All services are mock implementations that simulate network delays. Each has the real API call commented out immediately above:

```ts
// Production (uncomment when backend ready):
// const res = await api.post<LoginResponse>('/auth/invite', { inviteCode });
// return res.data;

// Mock:
await new Promise(res => setTimeout(res, 600));
return { user: simulateUser(code), token: `mock-token-${code}` };
```

---

## Known Issues & Fixes

### Fonts not loading
If you see `fontFamily "X" is not a system font` warnings:
- Download `.ttf` files from Google Fonts and place in `assets/fonts/`
- Or use the system font fallback in `constants/theme.ts`:
  ```ts
  fonts: { serif: 'Georgia', mono: 'Courier New' }
  ```

### App opens on wrong screen
If the app opens on Member Directory instead of the landing page, the auth state is persisted from a previous session. Fix by clearing app data:
```bash
adb shell pm clear co.inner.app
```

### Navigation before mount error
Make sure `app/index.tsx` uses `<Redirect />` not `router.replace()` inside `useEffect`.

### `addApplication is not a function`
Clear Metro cache and rebuild:
```bash
npx expo start --clear
```

---

## Roadmap

- [ ] Real backend API (Node.js / Supabase)
- [ ] Push notifications for application decisions
- [ ] Real-time messaging via WebSockets
- [ ] Photo uploads for member profiles
- [ ] Event creation UI for admins
- [ ] Member search by city
- [ ] Dark mode
- [ ] iPad / tablet layout
- [ ] Biometric authentication
- [ ] In-app invite code generation

---

## Screenshots

<img width="500" height="500" alt="WhatsApp Image 2026-05-05 at 4 59 44 PM" src="https://github.com/user-attachments/assets/209e9b9f-2af6-41ca-9d36-1a4444d0d122" />

<img width="500" height="500" alt="WhatsApp Image 2026-05-05 at 4 59 45 PM" src="https://github.com/user-attachments/assets/307c3375-ac68-479c-9216-1ffc7e71e28c" />

<img width="500" height="500" alt="WhatsApp Image 2026-05-05 at 4 59 45 PM (1)" src="https://github.com/user-attachments/assets/16efab2a-7147-413f-9147-caf1dc3c41d9" />

## Design System

The app uses a warm editorial aesthetic inspired by luxury print media.

| Token        | Value                    |
|--------------|--------------------------|
| Cream        | `#F5F0E8`                |
| Dark         | `#1A1714`                |
| Gold         | `#C9A96E`                |
| Taupe        | `#8B7D72`                |
| Sage         | `#7A8C6E`                |
| Rust         | `#B85C38`                |
| Serif font   | Cormorant Garamond 300   |
| Mono font    | DM Mono 400              |

---

## License

MIT — feel free to use as a reference or starting point for your own community app.

---

*Built with React Native + Expo. Designed to feel like a private members club, not a startup app.*
