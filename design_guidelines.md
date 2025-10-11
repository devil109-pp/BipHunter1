# Design Guidelines: Cryptocurrency Wallet Checker

## Design Approach
**System Selected:** Material Design with crypto-dashboard adaptations
**Justification:** This is a utility-focused, information-dense application requiring clarity, real-time updates, and professional reliability. Material Design provides excellent patterns for data displays, status indicators, and action buttons while maintaining accessibility.

## Core Design Elements

### A. Color Palette

**Dark Mode Primary (Default):**
- Background: 220 20% 12% (deep slate)
- Surface: 220 18% 16% (elevated panels)
- Primary Action: 142 76% 45% (vibrant green - "start/success")
- Danger/Stop: 0 84% 60% (bright red)
- Warning: 45 93% 58% (amber for pending states)
- Text Primary: 0 0% 98%
- Text Secondary: 220 10% 70%

**Accent Colors:**
- Bitcoin: 25 95% 53% (orange)
- Ethereum: 221 83% 53% (blue)
- USDT: 142 71% 45% (green)
- Success Highlight: 142 76% 45% with 10% opacity background

### B. Typography
**Font Stack:** 'Inter', 'Segoe UI', system-ui, sans-serif via Google Fonts
- Headings: 600-700 weight, tight tracking (-0.02em)
- Body: 400-500 weight, normal tracking
- Monospace (addresses/hashes): 'JetBrains Mono', monospace
- Key metrics/counters: 600 weight, tabular numbers

**Sizes:**
- Large headings: text-2xl to text-3xl
- Section headers: text-lg font-semibold
- Body/operations: text-sm to text-base
- Wallet addresses: text-xs monospace
- Metrics: text-4xl font-bold

### C. Layout System
**Spacing Primitives:** Tailwind units of 3, 4, 6, 8, 12 (e.g., p-4, gap-6, mt-8)

**Grid Structure:**
- Container: max-w-7xl mx-auto with px-4 padding
- Two-column layout for main content area:
  - Left: Control panel (Start/Stop buttons, stats) ~1/3 width
  - Right: Operations feed and found wallets ~2/3 width
- Mobile: Stack vertically with control panel at top

### D. Component Library

**Control Panel:**
- Large circular start/stop buttons with icon and label
- Real-time counter display in large bold numbers with labels
- Status indicator: Pulsing green dot when running, gray when stopped
- Card background with subtle border and shadow

**Operations Feed:**
- Scrollable list with fixed height (h-96)
- Each operation card shows:
  - Generated word sequence (truncated, monospace)
  - Wallet address (truncated with copy button)
  - Balance check result with colored badge
  - Timestamp
- Auto-scroll to latest with smooth transition
- Alternating subtle background colors for readability

**Found Wallets Section:**
- Prominent card with success border (green glow)
- Empty state: Subtle illustration with "No wallets found yet" message
- Filled state: Expandable cards showing:
  - Full wallet address with copy functionality
  - Balance broken down by coin type (BTC, ETH, USDT)
  - Colored coin icons/badges
  - Discovery timestamp
  - Quick action buttons (copy, export)

**Buttons:**
- Start: Large, rounded-full, green gradient with hover lift
- Stop: Large, rounded-full, red with hover darken
- Secondary actions: Outline style with backdrop blur when on images
- Icon buttons for copy/export: Ghost style with tooltip

**Status Indicators:**
- Operation count: Large metric card with icon
- Success rate: Progress bar or circular indicator
- Speed indicator: Real-time operations per second

**Data Display:**
- Balance badges: Rounded pills with coin icons
- Timestamps: Relative time (e.g., "2s ago") in muted text
- Wallet addresses: Monospace with gradient fade and ellipsis

### E. Animations & Interactions
- Start button: Scale and glow pulse on active state
- New operations: Slide-in from top with fade
- Found wallet: Celebratory subtle shake + border glow pulse
- Copy feedback: Checkmark animation with tooltip
- Loading states: Skeleton screens for API calls
- Scroll behavior: Smooth auto-scroll in operations feed
- Counter animations: Number rolling effect for statistics

## Key UX Patterns

**Real-Time Feedback:**
- Visual pulse on start button when active
- Live counter updates with smooth transitions
- Immediate visual feedback for found wallets (border glow, notification)

**Information Hierarchy:**
- Most important: Found wallets (prominent, top right)
- Secondary: Current operations feed (scrollable middle)
- Tertiary: Aggregate statistics (compact, left panel)

**Error States:**
- API errors: Toast notifications with retry option
- Invalid responses: Clear error messages in operations feed
- Connection issues: Status banner at top

**Data Density:**
- Operations feed: Compact but scannable
- Found wallets: Spacious with breathing room
- Balance displays: Clear numerical values with coin icons

## Visual Enhancements

**No Large Hero Image** - This is a utility dashboard, focus on functional interface

**Micro-interactions:**
- Button hover states with subtle lift
- Card hover: Slight shadow increase
- Copy success: Brief green highlight flash
- Active generation: Pulsing border on operations feed

**Visual Cues:**
- Color-coded coin badges for quick identification
- Status dots (green=running, red=stopped, amber=pending)
- Gradient backgrounds on found wallet cards for emphasis
- Monospace fonts for all crypto addresses and word sequences