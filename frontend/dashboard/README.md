# Pocket Pilot dashboard

Run `npm run dev` from this directory, then open http://localhost:9999. Shared
assets, and colors are generated and copied automatically before development and production builds.

## Layout structure

```text
app/
  layout.tsx                    # Shared document, fonts and metadata
  globals.css                   # Imports the generated shared palette
  (auth)/                       # Existing login/register layout
  (dashboard)/
    layout.tsx                  # Wraps dashboard pages in DashboardShell
    page.tsx                    # Empty home content area at /
    not-found.tsx               # Shared 404 content inside the shell
    [...notFound]/page.tsx      # Calls notFound() for unfinished routes
core/
  config/
    routes.ts                   # URL constants
    navigation.ts               # Sidebar groups, labels, icons and links
  components/layout/collapsable-sidebar/
    dashboard-shell.tsx         # Collapse state and mobile dialog behavior
    dashboard-sidebar.tsx       # Logo, grouped navigation and footer
    dashboard-header.tsx        # Page title and mobile menu button
    navigation-icon.tsx         # Small shared set of SVG navigation icons
    dashboard-shell.module.css  # Scoped layout styling
styles/
  generated-colors.css          # Output from the shared colors generator
```

The `(dashboard)` folder groups routes under one layout without adding a URL
segment. The sidebar stays mounted during navigation, so its collapsed state
survives page changes. It starts expanded; refreshing resets that state.

The layout follows the dashboard design concept: a teal sidebar, lime brand
mark and selection accent, plain line icons, and a muted workspace header.
Desktop navigation retains the Angular app's 280px expanded / 72px collapsed
widths. Below 768px, a menu button opens a modal drawer. It closes with Escape,
the close button, a backdrop click, navigation, or a resize to desktop. Links
remain keyboard accessible when collapsed, with their labels available as
native tooltips. The drawer cycles keyboard focus through its controls.

## Planned navigation

| Group | Label | URL |
| --- | --- | --- |
| Workspace | Overview | `/overview` |
| Workspace | Traffic & engagement | `/analytics/traffic` |
| Workspace | Users | `/users` |
| Workspace | Financial accounts | `/accounts` |
| Workspace | Transactions | `/transactions` |
| Workspace | Goals & bills | `/goals` |
| Workspace | Splitr | `/splitr` |
| Operations | Feedback | `/feedback` |
| Operations | Notifications | `/notifications` |
| Operations | System health | `/system/health` |

These destinations intentionally return 404 until their pages are created.
The previous demo Users route and its external sample-data request have been
removed; the existing reusable users feature files remain available for later.
No metrics, account information, or live system status are displayed.

To add a feature later, place its page under `(dashboard)` (for example,
`app/(dashboard)/users/page.tsx`) and its feature-specific components under
`features/users`. Next.js will match that page ahead of the catch-all 404 route.

## Shared branding

The logo comes from `public/images/branding/logo.png`, copied from
`../shared/assets`. Change shared colors in `../shared/resources/colors.ts`,
then run `npm run generate:colors` from the repository root. `app/globals.css`
imports the generated `styles/generated-colors.css`; do not edit generated
color values directly. Dashboard-specific surface shades are derived from
these shared tokens at the top of `dashboard-shell.module.css`. The sidebar
stays teal in both themes; the page background and header follow the system
light/dark preference. The dashboard uses Geist Sans, with Geist Mono reserved
for the route breadcrumb.

## Checks

- `npm run lint` checks the dashboard source.
- `npx next typegen && npx tsc --noEmit` checks route and TypeScript types.
- `npm run build` creates a production build. The existing `next/font/google`
  setup needs network access to download Geist fonts during a fresh build.
