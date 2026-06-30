# CLAUDE.md — Productivity Tracker

This file provides guidance to Claude Code when working in this directory.

---

## What This Is

A **Personal Accountability Dashboard** — a Progressive Web App (PWA) for tracking daily habits, health metrics, and challenge progress. Designed around a 75 Hard-style challenge but built to be extensible beyond it.

**Core concept:** A daily-reset tracking system where all metrics reset at midnight, historical data is stored, and the UI feels like a live dashboard — not a checklist.

---

## Tech Stack

- **Framework:** React (or Next.js) + TypeScript
- **Storage:** IndexedDB (local-first, offline-capable)
- **PWA:** Service worker, home screen installable, works offline
- **Optional backend:** Supabase or Firebase (for sync and push notifications)
- **Notifications:** Hybrid — PWA where possible, backend-scheduled for iOS limitations

---

## App Structure

### Split Dashboard Layout

**Left panel — Today Progress** (resets at midnight)
- Water intake (e.g. 400 / 4000ml)
- Steps (e.g. 2500 / 10,000)
- Workout completion (checkbox/status)
- Reading progress
- Calories / protein (scaffolded for later)

Each metric supports:
- Quick-add buttons (e.g. +250ml, +500 steps)
- Custom input field
- Instant UI update
- Warning state if progress is low relative to time of day

**Right panel — Daily Goals** (editable targets)
- Water goal (default 4000ml)
- Steps goal (default 10,000)
- Workout required (yes/no)
- Reading target
- Calories target

---

## Data Model

```
DailyLog {
  date: string (YYYY-MM-DD)
  metrics: {
    water: { value: number, goal: number }
    steps: { value: number, goal: number }
    workout: { completed: boolean }
    reading: { value: number, goal: number }
    calories: { value: number, goal: number }
  }
  streak: number
}

GoalsConfig {
  water: number
  steps: number
  workoutRequired: boolean
  reading: number
  calories: number
}
```

---

## Daily Reset Logic

- At midnight: all "today" values reset to 0
- A new `DailyLog` record is created for the new day
- Previous day data is preserved in IndexedDB
- Streak counter increments if all goals were met the previous day

---

## Notification Strategy

**PWA limitations on iOS:**
- Push notifications require iOS 16.4+ and the app installed to home screen
- Background service workers are limited — cannot guarantee delivery when app is closed

**Hybrid architecture:**
- In-app reminders via service worker when app is open
- Optional: backend cron job (Supabase Edge Functions or Node) to send scheduled push notifications
- Adaptive reminders: "you are behind target" alerts based on time-of-day progress vs. expected pace (not fixed hourly pings)

---

## Behaviour Logic

- **Water:** Expected pace = goal ÷ 16 waking hours. If actual < expected × 0.7 → warning state
- **Steps:** Same time-proportional check
- **Workout:** Flag as "not yet done" after noon if incomplete
- **Progressive urgency:** Low → medium → high warning states as day progresses and deficit grows

---

## PWA Requirements

- Installable to iPhone home screen (manifest.json + service worker)
- Full offline functionality via service worker cache
- IndexedDB for all data (no network required to log metrics)
- Optional backend sync when online

---

## Build Plan

**MVP:**
1. Project scaffold (React + TypeScript + Vite or Next.js)
2. IndexedDB setup (Dexie.js recommended)
3. Daily reset logic + data model
4. Left panel UI (Today Progress) with quick-add buttons
5. Right panel UI (Daily Goals, editable)
6. PWA manifest + service worker (offline)
7. Install-to-home-screen prompt

**Advanced:**
- Streak tracking + history view
- Time-based warning states
- Push notifications (backend or PWA)
- Supabase/Firebase sync
- Calories / protein tracking

---

## Project Folder Structure (planned)

```
Productivity Tracker/
  src/
    components/       — UI components (panels, metric cards, inputs)
    data/             — IndexedDB schema + helpers (Dexie)
    hooks/            — React hooks (useMetrics, useGoals, useDailyReset)
    utils/            — Reset logic, progress calculations
    types/            — TypeScript interfaces
  public/
    manifest.json
    service-worker.js
  index.html
  package.json
  tsconfig.json
  vite.config.ts (or next.config.ts)
  CLAUDE.md
```

---

## Key Constraints

- Must work offline on iPhone (service worker + IndexedDB)
- Must install to home screen as a PWA
- All data local-first; backend is optional/additive
- No generic advice — build for real, step by step
- Keep it practical and shippable as MVP before adding advanced features
