# CHU PRECISION HEALTH - Implementation Plan (Phase 1 MVP)

Based on the [Complete Build Package], this document outlines the roadmap to building the MVP patient engagement platform.

## 1. Core Objectives
- **Mobile-First Engagement**: Guided lifestyle medicine tracking.
- **Automation (The "Secret Sauce")**: Automated flagging of non-compliant or high-risk patients.
- **Staff Efficiency**: Minimize manual follow-up; staff only see flagged patients.

## 2. Information Architecture
### Patient App
- **Dashboard (Home)**: Tile-based navigation showing Status + Last Activity.
- **Weekly Check-ins**: Focused, rapid entry forms (<60s).
- **Progress Views**: Visual trendlines vs. goals.
- **Education Center**: PDF/Video resources.

### Staff/Admin Portal
- **Patient Management**: Flag-based priority list.
- **Intervention Tools**: Resource assignment, module locking, simple messaging.

## 3. Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS (Premium Glassmorphism Design)
- **Database**: Prisma with PostgreSQL (HIPAA-conscious schema)
- **State Management**: React Server Actions & Optimistic UI

## 4. Feature Roadmap (Phase 1)
### Sprint 1: Foundation & Smart Dashboard
- [x] PWA Setup & Mobile Optimization.
- [x] Premium Visual Shell (Navbar, Bottom Nav, Layout).
- [ ] **Dashboard v2**: Add "On Track/Needs Attention" status and "Last Activity" timestamps to tiles.
- [ ] **Mock Data Shell**: Local storage or mock API for patient status.

### Sprint 2: The Weekly Check-in (Guided Workflows)
- [ ] **Nutrition Module**: 3-8 binary/toggle inputs for weekly compliance.
- [ ] **Physical Activity Module**: Step/Minutes tracking.
- [ ] **Check-in Success logic**: Update "Last Activity" on completion.

### Sprint 3: Automation & Flagging
- [ ] **Flagging Engine**: Logic for "2 days no check-in" and "Risky response".
- [ ] **Status Calculation**: "On Track" vs "Needs Attention" based on check-in consistency.

### Sprint 4: Staff Dashboard (MVP)
- [ ] **Patient List**: Filtered by "Flagged" status.
- [ ] **Patient Profile (Staff View)**: Trend charts and response history.

## 5. Critical Rules to Follow
- **Binary/Toggles Only**: For check-ins to ensure speed.
- **No Manual Review**: Staff only check flagged users.
- **Guided Workflow**: Tap -> Form -> Success -> Back to Dashboard.
