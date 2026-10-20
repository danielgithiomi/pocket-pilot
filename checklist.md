# Pocket Pilot Implementation Checklist

Last reviewed against the repository: **15 October 2026**.

This is the working product roadmap for Pocket Pilot: one personal-finance platform with an Angular customer web
application, an Expo/React Native customer mobile application, a Next.js administration dashboard, and a shared NestJS
API. It tracks the foundations already present and the work required to make the product dependable enough to release.

The aim is to help people understand their money: record accounts and transactions, manage bills and savings goals,
split shared expenses with Splitr, and eventually simplify data entry through voice input and receipt scanning. The
administration dashboard operates Pocket Pilot; it is not a second version of the customer's finance dashboard.

## Contents

1. [How to use this checklist](#1-how-to-use-this-checklist)
2. [Current implementation snapshot](#2-current-implementation-snapshot)
3. [Recommended implementation order](#3-recommended-implementation-order)
4. [Application-wide and shared foundations](#4-application-wide-and-shared-foundations)
5. [Backend and data platform - NestJS](#5-backend-and-data-platform---nestjs)
6. [Customer web application - Angular](#6-customer-web-application---angular)
7. [Customer mobile application - Expo and React Native](#7-customer-mobile-application---expo-and-react-native)
8. [Administration dashboard - Next.js](#8-administration-dashboard---nextjs)
9. [Quality, accessibility, and documentation](#9-quality-accessibility-and-documentation)
10. [Hosting, deployment, and operations](#10-hosting-deployment-and-operations)
11. [Longer-term product development](#11-longer-term-product-development)
12. [How the applications and features connect](#12-how-the-applications-and-features-connect)

## 1. How to Use This Checklist

### Status and priority

- [x] in an **existing foundation** list means a narrowly described implementation was found in source. It does not mean
  the whole module is finished, tested in production, or deployed.
- [ ] means work remains. **Partial** means related code exists but the stated acceptance criteria are not met.
  **Planned** means a missing piece of the core product. **Proposed** means an additional recommendation to review
  before committing to it.
- **P0 - Release blocker:** security, financial correctness, or data-loss risks to address before a public release.
- **P1 - Next:** recommended near-term work and first usable releases.
- **P2 - Later:** product depth after the basic workflow is reliable.
- **P3 - Explore:** optional expansion, not a launch prerequisite or delivery promise.

Each unfinished item has a stable ID, status, priority, rough effort, and a description of completion. Use IDs in issues
and implementation discussions. Do not renumber existing IDs when adding items. Proposed scope is not silently approved
just because it appears here.

### Estimates

Estimates are **remaining focused developer-days for one developer**, assuming roughly six productive hours per day.
They include implementation, focused tests, and normal integration for the named scope. They are ranges, not deadlines.
Discovery, learning a new platform, interruptions, provider approval, and app-store review can extend calendar time.

Backend items cover data/API rules; web, mobile, and dashboard items cover client integration unless stated otherwise.
Milestones group those same items: do not add milestone estimates on top of item estimates. Feature tests are included
per item; the quality section covers broader infrastructure and cross-feature regression suites. There is no credible
whole-project completion date yet.

### Definition of done for new work

1. Data changes and migrations preserve existing user data.
2. The API validates input, authenticates the caller, and checks permissions and resource ownership.
3. Relevant clients handle loading, empty, success, failure, retry, and interrupted requests safely.
4. The workflow and important failure cases have focused automated tests and a manual acceptance check.
5. Shared contracts and documentation are current; applicable checks and production builds pass.
6. The feature works in its target environment, without fake data or success messages for work that never happened.

For cross-platform features, track backend, web, and mobile separately. A working Angular screen does not make its
mobile counterpart complete. Only check an unfinished item after its own scope meets these criteria.

### Scope and evidence limits

This review inspected source, routes, schema, scripts, and tests. It did **not** run the apps, test live endpoints,
inspect deployment, apply migrations, or prove production readiness. A migration file in Git does not prove it has been
applied to a database. Existing foundation checks record source evidence, not fresh runtime certification.

## 2. Current Implementation Snapshot

| Area                 | Present in the repository                                                                                                                                             | Missing or incomplete                                                                                                                                             |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Shared               | npm workspaces/Turborepo; shared types, enums, constants, colours, and asset-copying scripts.                                                                         | Complete build dependencies, generated-file checks, contract testing, and coordinated releases.                                                                   |
| Identity             | First/last names, generated usernames, independently unique email/username, Argon2 passwords, cookie JWT login/logout/current-user flows, onboarding and lock fields. | Dashboard roles, safe owner provisioning, session refresh/revocation, recovery/verification, and complete ownership enforcement.                                  |
| NestJS               | Accounts, transactions/transfers, categories, goals, bills, Splitr, feedback/comments/votes, notifications, SSE, and exchange rates.                                  | Pagination, admin analytics, several full domain lifecycles, stronger money handling, and regression coverage.                                                    |
| Angular customer web | Routed product screens, API resources/mutations, finance-summary UI, account/transaction forms, Splitr, profile/settings, feedback, and notifications.                | Incomplete actions, safer resource/error handling, paging, trustworthy summaries, and end-to-end verification.                                                    |
| Expo mobile          | Router scaffold, shared palette/assets, NativeWind setup, system appearance hooks, starter screens, and early text/button atoms.                                      | Actual auth/onboarding, finance screens, native API/session handling, release setup, and device tests.                                                            |
| Next.js admin        | Folder structure, shell, collapsible/responsive navigation, shared assets/colours, auth placeholders, and dashboard-specific not-found handling.                      | Real login/access protection, product pages, admin APIs, metrics, charts, workflows, and tests. Navigation labels are not implemented pages.                      |
| Notifications        | Persisted rows, summaries, read/archive actions, compact/full item UI, and SSE update events.                                                                         | Real event producers, bill/goal/security alert rules, archive retrieval, and actual domain actions. Reads currently insert starter notifications when none exist. |
| Infrastructure       | Local PostgreSQL/Redis Compose services, migrations, environment configuration, Swagger, and workspace scripts.                                                       | Full production deployment, explicit persistent storage, private networking, backups/restores, CI, and monitoring.                                                |

Corrections to the original checklist: the mobile palette and asset-copying script already exist; the dashboard shell
already exists; username uniqueness and generation code now exist. The unfinished dashboard bullet, "Change the", did
not describe a feature and has been replaced with concrete tasks below.

### Immediate gaps found during this review

| Finding                                                                                                                                                                                                | Why it matters                                                                                                                                       | Tracking                  |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| User-management methods have no visible authentication guards; no global `APP_GUARD` was found in inspected provider configuration. Some global financial lists only require login.                    | Swagger decorators are not access control. Customer/staff permissions must be enforced by the API.                                                   | SEC-001, SEC-003          |
| Startup registers a fixed account using source-embedded credentials; the schema has no persisted admin-access model.                                                                                   | A specially named account is not a secure administrator. Replace provisioning and rotate/disable any account already created with those credentials. | SEC-002                   |
| Transaction deletion checks the supplied account's owner, then deletes by transaction ID without scoping that ID to the account or reversing balances. Transfer ownership checks also need completion. | The wrong record could be targeted and balances can diverge from history.                                                                            | SEC-001, FIN-002, FIN-003 |
| Most money fields use `Float`; complete historical cross-currency conversion details are not recorded.                                                                                                 | Rounding and changing rates must not change old transactions' meaning.                                                                               | FIN-001, FIN-004          |
| `TransactionsStore` currently stores month selection and handles negative-balance SSE, not paginated transaction data.                                                                                 | Paging needs a store/resource contract, not just page buttons.                                                                                       | API-001, WEB-003          |
| Notification reads seed sample financial/security alerts; command actions acknowledge/navigate without implementing the named financial effect.                                                        | Users must not receive invented warnings or a false "bill paid" result.                                                                              | NOT-001, NOT-002          |
| The support form uses a timeout and success toast without sending a real request.                                                                                                                      | A customer may believe support received a message when it did not.                                                                                   | API-006, WEB-009          |
| Some Angular resource reads are unguarded; some mutation services convert failures to `EMPTY`.                                                                                                         | Failed requests can cause render errors, lost error signals, stuck controls, or `firstValueFrom` empty-sequence errors.                              | WEB-002                   |
| Compose has no explicit persistent volumes or application containers; Postgres username configuration/health checks need alignment.                                                                    | Local infrastructure is not a complete recoverable production setup.                                                                                 | OPS-002                   |

These are source-review findings, not claims that a live exploit or production outage was reproduced. Evidence pointers
appear at the end.

## 3. Recommended Implementation Order

These are suggested milestones, not scheduled commitments. Review the next milestone before starting rather than
treating the whole backlog as one release.

| Order | Milestone                           | Main work                                                                         | Exit condition                                                                                                             |
|-------|-------------------------------------|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| 1     | Secure and stabilise the core       | SEC-001 to SEC-005; FIN-001 to FIN-004; WEB-002; initial QA-001/QA-002.           | No default-credential admin setup; customer data isolated; financial mutations preserve balances; failures handled safely. |
| 2     | Make transaction data scalable      | API-001, API-002, WEB-003, WEB-004.                                               | Server-filtered paging works; summary totals describe the whole period rather than one page.                               |
| 3     | Usable read-only admin dashboard    | SEC-003/SEC-004; OBS-001/OBS-002; DASH-001 to DASH-004; DASH-012.                 | Authorised owner sees real counts and a paged user list; ordinary customers cannot access admin data.                      |
| 4     | First mobile vertical slice         | MOB-001 to MOB-008; QA-004.                                                       | User logs in/onboards, creates an account/transaction, and sees the same result on web and mobile.                         |
| 5     | Complete everyday finance workflows | FIN-005 to FIN-010; NOT-001/NOT-002; WEB-005 to WEB-009; matching mobile screens. | Bills, goals, Splitr, notifications, and support perform real tested actions.                                              |
| 6     | Hosted beta                         | OPS-001 to OPS-008; QA-005/QA-006; MOB-015 if distributing mobile.                | HTTPS apps reachable; data survives redeployment; backups restore; smoke tests/monitoring work.                            |
| 7     | Expand after real usage             | OBS-003 to OBS-006; remaining admin operations; selected P2/P3 scope.             | Further work follows actual customer feedback and operational needs.                                                       |

Infrastructure planning and mobile UI foundations can start earlier, but must not bypass security/data gates. The first
dashboard does not need every chart; the first mobile release does not need full Angular feature parity.

## 4. Application-Wide and Shared Foundations

### Existing foundations

- [x] **APP-001 - First and last names:** fields exist in schema, registration, and Angular signup. Preserves the
  original completed application-wide item.
- [x] **APP-002 - Shared contracts:** types, enums, constants, and formatting utilities exist in `frontend/shared`.
- [x] **APP-003 - Central colours:** `frontend/shared/resources/colors.ts` supplies generated styles for all three
  clients and native colour values.
- [x] **APP-004 - Asset copying:** `sync-assets.cjs` copies shared assets into web/dashboard public folders and mobile
  assets. Completes the original asset-script tasks at source level.
- [x] **APP-005 - Username foundation:** independent schema uniqueness, a generation helper, and registration
  integration exist. Conflict recovery/UI consistency remain below.

### Remaining work

- [ ] **APP-006 - Define release scope and audience** | Planned | P1 | **1-2 days**. Write acceptance journeys for
  customer web, mobile beta, and the first admin dashboard. Identify exclusions: banking, real payments, AI, and
  advanced analytics should not accidentally become launch blockers. Done when each release has a small explicit
  acceptance list.
- [ ] **APP-007 - Dependable shared generation/builds** | Partial | P1 | **2-3 days**. Ensure colours/assets generate
  from clean checkouts and individual workspace builds, including standalone dashboard builds. Declare shared
  colour/type inputs and framework-specific outputs in Turborepo: generic `src/**` inputs miss Next.js `app`, `core`,
  and `features`. Detect generated-style drift, duplicate outputs, and stale shared changes in CI.
- [ ] **APP-008 - Shared domain contracts** | Partial | P1 | **2-4 days**. Standardise IDs, date-only/timestamp fields,
  money/currency transport, pagination, API errors, and event payloads. Keep NestJS/Prisma internals and secrets out of
  clients. Share serialisable types and contract tests, not Angular services or incompatible UI components.
- [ ] **APP-009 - Cross-device preferences** | Partial | P2 | **3-5 days**. Define precedence for `SYSTEM`/`LIGHT`/
  `DARK`, currency, and locale; hydrate cached choices before render, sync after login, clear private state on logout.
  Native system appearance exists; saved Pocket Pilot preferences are not yet integrated into mobile.
- [ ] **APP-010 - Language, dates, and money formatting** | Proposed | P2 | **3-5 days**. Distinguish currency
  formatting from conversion; define user timezone, locale, calendar boundaries, and translation keys. Use `username`
  for handles without renaming legitimate account/squad names or personal display names.
- [ ] **APP-011 - Cross-platform design rules** | Partial | P2 | **2-4 days**. Document colours, spacing, typography,
  field states, and icon conventions. Use native controls for native interaction and browser controls for web. Verify
  light/dark contrast and long-label handling across clients.

## 5. Backend and Data Platform - NestJS

### 5.1 Identity, authorisation, and security

Existing foundations:

- [x] **SEC-B01 - Authentication:** registration/login, Argon2 hashing, access/refresh cookie issuance, current-user
  lookup, logout, and a cookie authentication guard exist.
- [x] **SEC-B02 - Identity fields:** onboarding, failed-login counters, lock state, and last-login timestamps exist;
  these are not dashboard authorisation or complete session tracking.
- [x] **SEC-B03 - API infrastructure:** validation pipe, response/error infrastructure, and Swagger setup exist.

Remaining work:

- [ ] **SEC-001 - Enforce authentication and ownership everywhere** | Partial | P0 | **4-7 days**. Classify
  public/customer/staff endpoints. Protect user read/update/delete/profile/password routes; scope account history,
  transaction reads/deletes, transfers, goals, bills, and Splitr to the acting user. Verify transaction IDs belong to
  the supplied account and both transfer accounts belong to the caller. Restrict global lists. Done when anonymous
  requests fail and user A cannot access or change user B's data, with negative tests for affected routes.
- [ ] **SEC-002 - Replace the startup "superuser"** | Partial | P0 | **2-4 days**. Remove credential-bearing
  registration from ordinary startup. Add an explicit one-time idempotent bootstrap using securely supplied credentials
  and a persisted owner grant. Never commit passwords or confuse a database administrator with an application owner.
  Rotate/revoke any existing fixed-credential account. Rerunning bootstrap must not reset credentials or silently create
  extra owners.
- [ ] **SEC-003 - Roles and permission policies** | Planned | P0 | **4-6 days**. Decide between a role on `User` and a
  separate dashboard-access grant; a separate grant is preferable when customers/staff share identity. Define initial
  `OWNER`, `ADMIN`, `VIEWER`, grant/revoke state, and last-owner protection. Enforce NestJS policies, deny by default,
  and reject privilege fields in public registration. Hiding links is not authorisation.
- [ ] **SEC-004 - Complete session lifecycle** | Partial | P0 | **4-7 days**. Implement refresh, refresh-token
  rotation/reuse handling, expiry, revocation, logout, and disabled-account checks. Define browser-cookie/native
  authentication contracts. Review JWT timestamps, configuration-driven lifetimes, and password-change invalidation.
  Expired/revoked sessions must not keep using APIs/streams; concurrent refreshes must behave predictably.
- [ ] **SEC-005 - Harden browser/API boundaries** | Partial | P0 | **3-5 days**. Allow exact web/dashboard origins,
  configure production cookies, add CSRF defence for cookie-authenticated writes, throttle auth/recovery/bootstrap, and
  redact secrets from logs. Review headers, validation bounds, and DTO exposure. CORS, cookies, authentication, and
  permissions solve different problems.
- [ ] **SEC-006 - Username conflicts and profile rules** | Partial | P1 | **2-3 days**. Preserve readable generated
  usernames but let users resolve taken names explicitly. Check the actual candidate, map database uniqueness races to
  controlled conflicts, and define case/Unicode/reserved-name rules. Decide whether usernames are immutable. Finish
  identity cleanup without altering first/last names or other domain names.
- [ ] **SEC-007 - Password recovery and email verification** | Planned | P1 | **5-8 days**. Add expiring single-use
  tokens, real mail delivery, resend limits, enumeration-safe responses, and web/mobile recovery links. Verify changed
  email addresses; failed delivery must not produce a misleading completion state.
- [ ] **SEC-008 - Staff invitations and MFA** | Planned | P1 | **5-8 days**. Replace open staff signup with invitations,
  expiry/revocation, acceptance, and strong privileged authentication. Add MFA enrolment/recovery and recent-auth
  confirmation for sensitive actions. Permission to accept an invitation is not permission to invite others.
- [ ] **SEC-009 - Privacy-aware audit trail** | Planned | P1 | **3-5 days**. Record actor, operation, target ID, time,
  outcome, and safe change summary for access grants, user actions, moderation, and broadcasts. Do not log
  passwords/tokens or full financial payloads. Define access and retention.
- [ ] **SEC-010 - Export and account deletion lifecycle** | Partial | P1 | **4-7 days**. Add authenticated export,
  deletion confirmation/reauthentication, cascade/shared-content rules, media cleanup, retention exceptions, and session
  revocation. A delete endpoint alone is not a complete customer workflow. Clear private client caches and test deleted
  data cannot reappear.

### 5.2 Financial correctness and missing lifecycles

Existing foundations:

- [x] **FIN-B01 - Account operations:** account types, create/read/update/delete paths, balances, and visibility
  toggling exist.
- [x] **FIN-B02 - Transaction creation:** income/expense creation updates balances inside a database transaction;
  transfer creation updates both accounts inside a database transaction.
- [x] **FIN-B03 - Domain modules:** categories, goal/bill create/list/delete, Splitr squads/events, split strategies,
  payer records, and settlement-state endpoints exist.
- [x] **FIN-B04 - Exchange rates:** snapshots, conversion code, caching, and scheduled refresh code exist. Historical
  accounting and report rules remain incomplete.

Remaining work:

- [ ] **FIN-001 - Exact money representation** | Partial | P0 | **5-8 days**. Choose decimal storage or integer minor
  units for balances, transactions, goals, bills, and Splitr values. Define currency precision/rounding, migrate floats
  without silently changing totals, and update API/client contracts. Test fractions, permitted negative/credit balances,
  and Splitr rounding remainders.
- [ ] **FIN-002 - Correct transaction reversal/deletion** | Partial | P0 | **3-5 days**. Verify ownership of the actual
  transaction; reverse its original income/expense effect or both sides of a transfer atomically. Decide whether to
  retain reversal records instead of physical deletion. Invalidate all affected caches after commit. Failure must leave
  records/balances unchanged; replay must not reverse twice.
- [ ] **FIN-003 - Safe transfers and concurrent writes** | Partial | P0 | **4-6 days**. Validate both account owners,
  distinct IDs, currencies, positive bounded amounts, and path/body consistency. Await commit before cache
  invalidation/events. Add idempotency for uncertain retries and an explicit concurrency/negative-balance policy. Test
  simultaneous writes and cross-user target IDs.
- [ ] **FIN-004 - Historical currency conversion** | Partial | P0 | **3-5 days**. Persist source amount/currency, target
  amount/currency, applied rate, and conversion time for each cross-currency transfer. Reversals/reports must use
  recorded conversion, not today's rate. Define stale-rate/provider-outage behaviour without changing old records.
- [ ] **FIN-005 - Account opening, reconciliation, and closure** | Proposed | P1 | **4-6 days**. Represent opening
  balances and intentional corrections; reconcile history against balances. Add archived/closed state and timestamps
  instead of relying on cascade deletion. Prevent entries into closed accounts and define reopening/history retention.
  This supplies meaningful active/closed account metrics.
- [ ] **FIN-006 - Safe transaction editing** | Planned | P1 | **4-6 days**. Support date, description, category, amount,
  and eligible account edits. Reverse the old effect and apply the new one atomically, with stale-edit conflict
  handling. Keep transfers linked rather than allowing independently editable halves.
- [ ] **FIN-007 - Complete goal management** | Partial | P1 | **5-8 days**. Add editing, pause/resume/complete rules,
  contribution/withdrawal history, progress calculation, and optional transaction/account links. Explain whether
  contributions earmark money or move it. Keep status/current amount consistent without double-counting savings.
- [ ] **FIN-008 - Complete bill management** | Partial | P1 | **5-8 days**. Add edits, recurrence rules, individual
  occurrences, paid/unpaid/overdue state, payment history, and optional transaction links. Handle short months,
  timezones, skipped occurrences, and duplicate payments. "Mark paid" records a domain action; it does not execute a
  bank payment.
- [ ] **FIN-009 - Categories and budgets** | Partial; budget expansion proposed | P2 | **5-8 days**. Preserve default
  categories/monthly spending limits; add safe rename/archive behaviour and decide whether stable category IDs should
  replace string references. Proposed extension: category/period budgets and warning thresholds. Define historical
  categorisation and budget currency rules.
- [ ] **FIN-010 - Complete Splitr lifecycle and arithmetic** | Partial | P1 | **5-8 days**. Validate items, totals, and
  payers on the server; handle rounding, edits/deletion, debtor/creditor breakdowns, and settlement timestamps/history.
  Decide whether settlement just records agreement or creates a personal transaction. Reject invalid payloads even if
  the client accepts them and refresh affected caches.
- [ ] **FIN-011 - Explicit member collaboration** | Proposed | P2 | **5-10 days**. Current squad/event members are
  string lists, not a full membership system. Choose simple named participants or linked users with
  invitations/roles/shared visibility. Define consent and settlement permissions before exposing another person's
  expenses.
- [ ] **FIN-012 - Recurring income/expenses** | Proposed | P2 | **5-8 days**. Define schedules, pause/end rules, due
  processing, confirmation versus automatic posting, and one transaction per occurrence. Reuse bill scheduling without
  creating a duplicate transaction for the same bill payment.
- [ ] **FIN-013 - Financial date/validation policy** | Planned | P1 | **2-4 days**. Define date-only entries versus
  timestamps, future/backdated rules, amount limits, valid currencies, and account currency changes. Apply rules through
  API validation, not only frontend fields.

### 5.3 API scalability, support, and media

- [ ] **API-001 - Transaction pagination and server filters** | Planned | P1 | **3-5 days**. Start with user/account
  transactions: bounded page size, deterministic order with ID tie-breaker, date/type/category/account/search filters,
  and authorised queries. Page/page-size plus filtered totals is a reasonable starting point for numbered web/admin
  tables; evaluate cursors for long mobile feeds. Counts must describe the full filtered result, not `data.length`.
- [ ] **API-002 - Customer finance summaries** | Planned | P1 | **3-5 days**. Aggregate income/expenses/cash flow,
  spending-limit usage, and category trends for a period/timezone. Exclude transfers from income/expense totals;
  separate currencies or explicitly convert them. Return scope/conversion metadata. Never calculate a monthly total from
  one transaction page.
- [ ] **API-003 - Consistent pagination elsewhere** | Planned | P2 | **3-5 days**. Bound feature/comment,
  notification/history, Splitr, and admin queries. Replace the fixed five-feature limit with deliberate paging. Preserve
  filters/sort and prefer counts/current-user vote state over returning every voter when full voter lists are
  unnecessary.
- [ ] **API-004 - Cache/query consistency** | Partial | P1 | **3-5 days**. Scope keys by user/filter/page/currency,
  invalidate after successful writes, and test private-cache isolation. Add indexes for actual query patterns, bounded
  aggregations, and query-count checks. Avoid per-row media/signing work on summary lists that do not need images.
- [ ] **API-005 - API contracts and compatibility** | Partial | P1 | **2-4 days**. Align response envelopes, Angular
  normalisation, dashboard/native clients, error codes, and mutation results. Publish pagination/admin DTOs/shared
  types. Test serialisation so fields such as `username` are not dropped by DTO exposure rules; document changes
  affecting older mobile binaries.
- [ ] **API-006 - Real support intake** | Planned | P1 | **3-5 days**. Store
  requester/message/category/status/timestamps, return a reference ID, and deliver mail or expose a protected staff
  queue. Add limits, abuse controls, and retry safety. Decide whether attachments belong in the initial version.
- [ ] **API-007 - Profile-media lifecycle** | Partial | P1 | **3-5 days**. Validate type/size and ownership, associate
  original/thumbnail keys safely, handle expired URLs/missing objects, and clean replaced/orphaned uploads. Existing
  presigned S3 support is the starting point, not a reason to change providers.
- [ ] **API-008 - Financial export/import** | Proposed | P2 | **5-8 days**. Start with authorised period/currency CSV
  export. Imports need preview, column mapping, validation, duplicate detection, and errors before commit. Imported
  entries must follow the same balance/idempotency rules as manual transactions.

### 5.4 Notifications, real-time updates, and feedback

Existing foundations:

- [x] **NOT-B01 - Inbox persistence/actions:** notification types/statuses, list/summary, read/archive/mark-all-read,
  and action-dispatch scaffolding exist.
- [x] **NOT-B02 - SSE:** authenticated per-user streams, heartbeat/cleanup, notification updates, and negative-balance
  events exist. Streams are in-memory within one API process.
- [x] **FDB-B01 - Feature feedback:** requests, categories/statuses, comments, and an upvote toggle exist. Schema
  enforces one vote per user/feature and has no downvote variant.

Remaining work:

- [ ] **NOT-001 - Real notification producers instead of samples** | Partial | P1 | **4-7 days**. Remove automatic
  sample alerts from normal reads; retain explicit development fixtures only. Generate alerts from actual bill
  occurrences, goal milestones, budget thresholds, and verified security events. Deduplicate by event/occurrence and
  test retries. Empty accounts must not receive invented rent or sign-in warnings.
- [ ] **NOT-002 - Real notification actions** | Partial | P1 | **3-5 days**. Delegate actions to the owning
  bill/goal/account module with ownership checks. Report success only after completion or explicitly return a
  navigation-only result. Handle missing/expired resources, repeat clicks, and partial failures; refresh domain state as
  well as the inbox.
- [ ] **NOT-003 - History and notification preferences** | Partial | P2 | **3-5 days**. Add server filtering/paging,
  archive/history retrieval, expiry, and per-category/channel choices. Distinguish essential security notices from
  optional reminders; sync read/archive state across devices.
- [ ] **NOT-004 - Reliable foreground updates** | Partial | P1 | **3-5 days**. Scope streams to the authenticated
  session, close on logout/user change, refetch after missed events, and avoid duplicate connections/toasts. Publish
  financial alerts after commit, based on transaction type and actual post-change balance. Test disconnect/reconnect and
  expired-session paths.
- [ ] **NOT-005 - Reliable jobs and background delivery** | Proposed | P2 | **5-8 days**. Add durable
  reminders/mail/push work with bounded retries and observable failures. Use an outbox or equivalent guarantee where a
  committed event must create an alert. Add shared pub/sub when multiple API instances require it; the current stream
  map is not cross-instance delivery.
- [ ] **FDB-001 - Harden the single upvote toggle** | Partial | P1 | **2-3 days**. Preserve one button: add an upvote or
  remove it, never downvote. Handle concurrent clicks, uniqueness conflicts, optimistic rollback, and counter
  reconciliation. Consider idempotent desired-state requests rather than replaying toggles after uncertain network
  failures.
- [ ] **FDB-002 - Complete comments/moderation** | Partial | P2 | **3-5 days**. Add paging, limits, pending/failed
  states, author edit/delete rules, and staff moderation reasons. Reconcile optimistic comments with canonical server
  responses without duplicates or disappearance during refetch.
- [ ] **FDB-003 - Staff-owned roadmap transitions** | Partial | P1 | **2-3 days**. Put `PLANNED`, `IN_PROGRESS`,
  `SHIPPED`, and other product status transitions behind staff policies. The current service checks author ownership
  instead. Authors may manage appropriate content but must not unilaterally declare product releases shipped.

### 5.5 Dashboard analytics and observability

Platform metrics are not a customer's personal finance totals. Observability describes application behaviour; analytics
describes agreed product activity.

- [ ] **OBS-001 - Metrics dictionary** | Planned | P1 | **1-2 days**. Define registered/onboarded/active users,
  active/closed financial accounts, qualifying activity, report timezone, staff/test exclusions, and period comparisons.
  Separate recent login, active during a period, and online now; `lastLoginAt` cannot answer all three.
- [ ] **OBS-002 - Initial admin aggregates** | Planned | P1 | **3-5 days**. Add protected totals, registrations over
  time, current onboarding completion, and transaction counts by type/currency/period. Query aggregates in PostgreSQL
  instead of downloading everyone's records into Next.js. Return period, filters, freshness, and missing-data
  indicators. Customer transaction volume is not Pocket Pilot revenue.
- [ ] **OBS-003 - Privacy-conscious activity collection** | Planned | P2 | **4-7 days**. Collect agreed events such as
  onboarding completion, successful transaction creation, and selected feature usage with event ID/time/platform and
  minimal identity. Deduplicate, define retention/consent, and exclude credentials/raw financial payloads. Do not
  fabricate pre-instrumentation history.
- [ ] **OBS-004 - Engagement, retention, and traffic reporting** | Planned | P2 | **4-7 days**. Derive
  daily/weekly/monthly active users, cohorts, onboarding funnels, sessions, and platform adoption from defined events.
  Exclude bots/internal traffic and surface incomplete collection. Historical closure needs lifecycle records; traffic
  needs request/page instrumentation.
- [ ] **OBS-005 - Operational telemetry** | Planned | P1 | **3-5 days**. Add minimal liveness/readiness plus protected
  diagnostics; collect request/error rate, latency percentiles, database/cache health, exchange-rate freshness, and job
  failures. Correlate/redact logs. Public health must not reveal secrets or internal infrastructure details.
- [ ] **OBS-006 - Metric performance/privacy controls** | Planned | P2 | **2-4 days**. Bound date ranges, cache
  expensive aggregates, authorise exports, and add rollups only when cost warrants them. Aggregate access does not grant
  access to individual financial records; enforce role-specific drill-downs and minimum necessary detail.

## 6. Customer Web Application - Angular

### Existing foundations

- [x] **WEB-B01 - Signup names:** Angular registration includes first/last name, preserving the original completed web
  item.
- [x] **WEB-B02 - Product routes/screens:** auth/onboarding, finance home, accounts/details, transactions, goals/bills,
  Splitr/details, settings/categories, profile, support, feedback, privacy, and inbox exist.
- [x] **WEB-B03 - Data-access layers:** resources, mutations, services, interceptors, and transaction/notification
  stores exist.
- [x] **WEB-B04 - Theme/media/UI:** generated colours, system/light/dark service, image/thumbnail handling, and reusable
  atoms exist.
- [x] **WEB-B05 - Compact notifications:** item templates have compact dropdown and full-detail branches; preserve the
  reduced dropdown content.
- [x] **WEB-B06 - Text-area count:** `showCharacterCount` defaults to false; configurable `maxCharacterCount` defaults
  to 100. Add regression tests when changing form infrastructure.

### Remaining work

- [ ] **WEB-001 - Username/display-name cleanup** | Partial | P1 | **1-2 days**. Review profile, shell, support,
  comments, and feedback against the identity contract. Use handles where intended, names where appropriate, and handle
  older cached users/conflicts. Completes the original cleanup intent without blindly replacing every `name` property.
- [ ] **WEB-002 - Safe resources and mutation outcomes** | Partial | P0 | **3-5 days**. Guard resource reads; optional
  chaining after a throwing `.value()` is insufficient. Preserve API errors rather than swallowing all failures with
  `EMPTY`; catch `firstValueFrom` rejection and clear pending flags on every path. Cover
  empty/401/403/validation/500/timeout/refetch failures without false success or private stale data.
- [ ] **WEB-003 - Transaction paging and store contract** | Partial | P1 | **3-5 days**. Extend `TransactionsStore` to
  coordinate page/size/filters/sort/pending/errors and reloads. Choose one owner for server data; do not duplicate
  arrays across stores/resources/components. Add controls/URL state, reset paging on filter changes, reject stale
  responses, and handle last-row deletion. Depends on API-001.
- [ ] **WEB-004 - Correct finance summary scope** | Partial | P1 | **3-5 days**. Use API-002 for selected month/year
  totals, categories, spending limits, and comparisons. Match labels to period, exclude transfers appropriately, and
  avoid blindly summing currencies. Distinguish real zero/no-data from failed summary requests.
- [ ] **WEB-005 - Account/transaction details** | Partial | P1 | **3-5 days**. Integrate edits/reversals, historical
  transfer conversion, account reconciliation/closure, date/search filters, and paged history. Confirm destructive
  actions and refresh affected balances after commit. Backend changes remain separately tracked.
- [ ] **WEB-006 - Goals, bills, and calendar actions** | Partial | P1 | **4-6 days**. Connect
  detail/edit/contribution/payment workflows to FIN-007/FIN-008. Replace calendar placeholder click/form handlers with
  selected-day activity and useful actions. Handle nullable dates, keyboard selection, empty days, and month boundaries.
- [ ] **WEB-007 - Complete Splitr interactions** | Partial | P1 | **3-5 days**. Integrate verified balances, edits,
  settlement history, rounding explanations, and loading/failure states. Add printable/shareable summaries if approved.
  Refresh lists/details and distinguish settlement recording from real payment processing.
- [ ] **WEB-008 - Complete notification journeys** | Partial | P1 | **2-4 days**. Keep dropdown rows short; make
  view-all and resource links useful; add archive/history/filter states and cross-tab badge consistency. Connect real
  domain actions and handle missing resources. Test overlay focus/keyboard behaviour.
- [ ] **WEB-009 - Replace simulated support** | Partial | P1 | **1-2 days**. Call API-006, show the actual reference,
  preserve failed drafts, and prevent duplicate sends. Do not clear the form or claim delivery when no request
  succeeded.
- [ ] **WEB-010 - Feedback/comment interaction** | Partial | P1 | **2-4 days**. Make voting consistent in list/details,
  block duplicate submits, reconcile optimistic IDs/counts, preserve failed drafts, and add paged filters. The current
  details vote button sends users back to the list. Staff roadmap controls belong in admin.
- [ ] **WEB-011 - Identity/privacy screens** | Partial | P1 | **3-5 days**. Integrate recovery, email verification,
  session management, export, and deletion once APIs exist. Keep profile/preferences/auth state in sync; prevent stale
  edits overwriting newer data.
- [ ] **WEB-012 - Media/performance/responsive finish** | Partial | P2 | **3-5 days**. Verify thumbnail dimensions,
  fallback/expiry, preconnect for relevant priority images, route loading, and production bundle budgets. Test tables,
  menus, forms, modals, and calendar at narrow widths/large text.
- [ ] **WEB-013 - Reports and budget UI** | Proposed | P2 | **4-7 days**. Add period trends, comparisons, approved
  category budgets, and export. Show currency/period context and let users inspect underlying filtered transactions.

## 7. Customer Mobile Application - Expo and React Native

### Existing foundations

- [x] **MOB-B01 - Expo scaffold:** Router layout, home/explore starter routes, app configuration, and development
  scripts exist.
- [x] **MOB-B02 - Shared colours/assets:** native palette, generated CSS, aliases, and asset-sync hooks exist. Original
  unchecked palette/script items are therefore not new work.
- [x] **MOB-B03 - NativeWind configured:** Metro/CSS integration and early controls exist. Manifest currently uses
  **NativeWind 5 preview**, not stable v4; this records state, not an upgrade/downgrade recommendation.
- [x] **MOB-B04 - System appearance:** appearance hooks, navigation theme provider, and automatic user-interface style
  exist; saved account preferences are separate work.
- [x] **MOB-B05 - Early atoms:** native text/button primitives exist, but are not a complete production form library.

### Remaining work

- [ ] **MOB-001 - Real navigation instead of starter screens** | Partial | P1 | **2-4 days**. Define
  guest/onboarding/authenticated groups, main tabs, detail stacks, protected deep links, and not-found states. Retain
  useful app-specific scaffold work. Build the first vertical slice rather than every screen simultaneously.
- [ ] **MOB-002 - Validate native UI foundations** | Partial | P1 | **4-6 days**. Finish buttons/text/inputs/amount
  fields/selects/date pickers/sheets/errors/skeletons/toasts with accessible states and touch targets. Verify shared
  colours on iOS/Android and system switches. Evaluate the installed preview styling stack on actual builds; do not
  change it solely because a previous discussion mentioned v4.
- [ ] **MOB-003 - Native API/environment layer** | Planned | P1 | **2-4 days**. Add typed responses/errors and
  dev/staging/production API settings. Handle device networking, timeouts, cancellation, connectivity failures, and safe
  read retries. Public Expo config must contain no secrets; reuse contracts, not browser-specific services.
- [ ] **MOB-004 - Native authentication and secure sessions** | Planned | P1 | **4-7 days**. Build
  register/login/logout, current-user hydration, refresh/revocation, and recovery links using SEC-004. Explicitly choose
  supported native cookie handling or a token flow; browser cookies do not automatically solve native persistence. Use
  OS-backed secure storage, not ordinary preferences, for sensitive credentials and clear them on logout.
- [ ] **MOB-005 - Onboarding and saved preferences** | Planned | P1 | **2-4 days**. Collect currency/language/spending
  limit/theme, submit to the shared API, recover interrupted setup, and avoid rendering the wrong route group while
  hydrating. Respect `SYSTEM` versus explicit appearance.
- [ ] **MOB-006 - Finance home** | Planned | P1 | **3-5 days**. Render real account totals, selected-period
  income/expenses/cash flow, recent activity, and upcoming bills. Use server summaries with currency context,
  pull-to-refresh, skeletons, retry, and useful first-use states.
- [ ] **MOB-007 - Accounts/details** | Planned | P1 | **3-5 days**. Add list/create/edit, balance visibility, and paged
  account history. Integrate closure/reconciliation once available. Confirm destructive actions and refresh balances
  consistently.
- [ ] **MOB-008 - Transactions/history/transfers** | Planned | P1 | **5-8 days**. Add amount/category/account/date
  entry, paged lists/filters/details, and safe transfer/reversal flows. Support decimal keyboards, keyboard avoidance,
  and interrupted submits. Never automatically retry a financial write without an idempotency contract.
- [ ] **MOB-009 - Goals, bills, and reminders** | Planned | P2 | **4-7 days**. Connect contributions, progress, bill
  occurrences, and payment recording to the complete backend lifecycle. Deep-link reminders to real resources and
  refresh after actions.
- [ ] **MOB-010 - Mobile Splitr** | Planned | P2 | **5-8 days**. Add squads, multi-step event entry, item/quantity
  splits, payers, balances, settlement, and details. Reuse server arithmetic rather than making mobile a second
  calculation authority.
- [ ] **MOB-011 - Profile/settings/media** | Planned | P2 | **3-5 days**. Edit supported profile fields,
  select/crop/upload original/thumbnail, change password, and sync preferences. Request camera/photo permission only
  when needed; handle denial, failed uploads, expired URLs, and orphaned media.
- [ ] **MOB-012 - Inbox and deep links** | Planned | P2 | **3-5 days**. Add read/archive/badge state and real resource
  navigation. Use a native-compatible foreground event client and refetch on resume; browser `EventSource` cannot be
  assumed available unchanged.
- [ ] **MOB-013 - Push delivery** | Proposed | P2 | **4-7 days**. Add permission prompts, per-device token
  registration/revocation, backend delivery, preferences, and tap handling. Handle signed-out/deleted-resource
  destinations; avoid financial details on lock screens by default. Push is distinct from the durable inbox.
- [ ] **MOB-014 - Offline/lifecycle behaviour** | Proposed | P2 | **4-7 days**. Start with cached reads, stale labels,
  offline failures, draft recovery, retention, and foreground refresh. Offline financial write queues require a separate
  decision, conflict handling, secure storage, and idempotency; they are not automatic scope.
- [ ] **MOB-015 - Standalone beta/store readiness** | Partial | P1 | **4-7 days**. Configure real app IDs/project
  association, signing, build profiles/environments, permission descriptions, icons/splash, privacy disclosures, and
  versions. Test standalone iOS/Android builds and distribute a limited beta. Existing placeholders are not a published
  app; fees/review waits are outside this estimate.
- [ ] **MOB-016 - Native device/accessibility acceptance** | Planned | P1 | **3-5 days**. Check VoiceOver/TalkBack,
  dynamic text, contrast, safe areas, gestures, keyboard, slow networks, and background transitions. Run the vertical
  slice on both target platforms, not just Expo web or one simulator.

## 8. Administration Dashboard - Next.js

### Existing foundations

- [x] **DASH-B01 - Project/folder structure:** the workspace and feature/core/app separation exist, preserving the
  original completed setup item.
- [x] **DASH-B02 - Dashboard shell:** header, collapsible sidebar, navigation configuration, and responsive shell code
  exist.
- [x] **DASH-B03 - Assets/styles:** asset copying is wired and global CSS imports generated shared colours.
- [x] **DASH-B04 - Route scaffold:** root/auth placeholders and dashboard-specific not-found handling exist. The sidebar
  explicitly describes its destinations as planned pages.

### Remaining work

- [ ] **DASH-001 - Real login and restricted access** | Partial | P1 | **3-5 days**. Replace auth placeholders with
  login, invitation acceptance, session hydration/expiry/logout. Protect server-rendered data/API calls as well as
  navigation. Distinguish unauthenticated 401 from forbidden 403. Replace/repurpose open register; staff must not
  self-assign access. Depends on SEC-002 to SEC-004 and the agreed invitation/MFA scope.
- [ ] **DASH-002 - Data layer and reusable controls** | Partial | P1 | **3-5 days**. Add typed server/client API
  boundaries, explicit cookie forwarding where needed, safe private caching, filters/date ranges, tables/paging,
  loading/empty/error states, and confirmations. Replace sample user models/interactions with real DTOs. Read installed
  Next.js guidance before implementation as required by the workspace's `AGENTS.md`.
- [ ] **DASH-003 - Real overview metrics** | Planned | P1 | **3-5 days**. Build `/overview` with registered/onboarded
  users, accounts/transactions, growth, and alerts from OBS-002/OBS-005. Label period, timezone, currency, and
  freshness; only compare against trustworthy historical data. Make `/` redirect to/render the agreed overview rather
  than placeholder content.
- [ ] **DASH-004 - User management** | Planned | P1 | **4-6 days**. Build paged/searchable `/users` and
  permission-scoped details with onboarding/lock/access state. Add deliberate audited unlock/disable support actions
  only with defined backend contracts. Mask unnecessary personal data, never expose password hashes, and do not use
  account deletion as generic troubleshooting.
- [ ] **DASH-005 - Traffic and engagement** | Planned | P2 | **4-6 days**. Build `/analytics/traffic` for active users,
  onboarding funnel, sessions/platform split, and retention after OBS-003/OBS-004. Distinguish sign-ins from activity
  and requests from people. Show "not collected yet" rather than invented zeros or historical charts.
- [ ] **DASH-006 - Financial account oversight** | Planned | P2 | **3-5 days**. Build `/accounts` with aggregate
  types/currencies/lifecycle state from FIN-005. Add limited authorised/audited support drill-downs. An admin dashboard
  does not automatically justify access to every customer's balance.
- [ ] **DASH-007 - Transaction oversight** | Planned | P2 | **3-5 days**. Build `/transactions` with policy-scoped
  filters, currency-separated counts/volume, safe exports, and diagnostics. Do not permit arbitrary balance editing or
  bypass reversal rules. Audit sensitive detail access and omit personal descriptions from default charts.
- [ ] **DASH-008 - Goals, bills, and Splitr operations** | Planned | P2 | **4-6 days**. Build `/goals` and `/splitr`
  with adoption/status aggregates, real overdue occurrences, failed jobs, unsettled counts, and safe details. Define a
  bills view under "Goals & bills". Metrics depend on real domain states, not guessed date labels.
- [ ] **DASH-009 - Feedback and release roadmap** | Planned | P1 | **3-5 days**. Build `/feedback` for requests/bugs,
  votes/comments, staff transitions, and moderation reasons. Preserve customer upvote-only behaviour. Add staff
  replies/optional duplicate linking without silently changing votes. Depends on FDB-002/FDB-003 and audit logging.
- [ ] **DASH-010 - Notification/announcement operations** | Planned | P2 | **4-6 days**. Build `/notifications` for
  templates, preview, audience selection, scheduling, and delivery/failure status. Require permissions and confirmation
  for broadcasts. Campaign sending needs an idempotent contract; displaying a customer's inbox is not a campaign system.
- [ ] **DASH-011 - Support inbox** | Planned | P2 | **3-5 days**. Add route/navigation, real queue/details/history,
  assignment, status, and replies. Avoid exposing unrelated finance data. Show actual reply-delivery outcomes and
  preserve history. Depends on API-006.
- [ ] **DASH-012 - System health** | Planned | P1 | **2-4 days**. Build `/system/health` for API/database/Redis
  readiness, rate freshness, job failures, error rate, and latency. Show last-check/stale/unknown states; do not expose
  secrets, unrestricted logs, or infrastructure write controls.
- [ ] **DASH-013 - Staff access and audit UI** | Planned | P1 | **3-5 days**. Add invitations, role changes/revocation,
  MFA state, and a filtered role-scoped audit trail. Protect the last owner and require recent authentication for
  sensitive changes. API policies remain authoritative.
- [ ] **DASH-014 - Production dashboard finish** | Partial | P1 | **3-5 days**. Verify destinations, 403/404/errors,
  session expiry, URL filters, responsive layout, accessible tables, and real loading. Keep unfinished destinations
  intentionally unavailable. Add build/smoke checks with staff/customer/anonymous identities.

## 9. Quality, Accessibility, and Documentation

Current tests are mainly application/component smoke scaffolds, not broad financial/security coverage. Do not run
integration tests against real user data: importing the full app can invoke startup hooks and external dependencies.

- [ ] **QA-001 - Isolated repeatable tests** | Partial | P0 | **2-4 days**. Provide disposable databases,
  migrations/fixtures, clock/timezone control, and mocked media/rates/mail. Disable bootstrap/scheduled jobs/external
  calls. Close apps, connections, and streams during cleanup.
- [ ] **QA-002 - Money/permission regression suite** | Planned | P0 | **4-7 days**. Cover create/edit/reverse/transfer
  invariants, cross-user denial, same-account transfers, rounding, duplicate requests, uniqueness races, rollback,
  goal/bill/Splitr ownership, and DTO exposure. Add targeted tests with fixes rather than waiting for the whole suite.
- [ ] **QA-003 - Web/admin workflow coverage** | Partial | P1 | **4-6 days**. Cover auth/onboarding,
  accounts/transactions, paging/filter changes, optimistic reconciliation, inbox, and customer/staff boundaries. Include
  resource rendering on 500/timeout failures, not only successful page creation.
- [ ] **QA-004 - Mobile and cross-client parity tests** | Planned | P1 | **4-6 days**. Test the native vertical slice
  against an isolated API, then expand finance lifecycle coverage. Verify web changes appear on mobile and vice versa
  after refresh, logout clears data, and expired sessions/deep links work on devices.
- [ ] **QA-005 - CI and actual build coverage** | Planned | P1 | **3-5 days**. Add clean install, generation, real
  per-workspace type checks, non-mutating lint/format checks, tests, disposable-database migrations, and production
  builds. Root type checking currently prints a skip message; mobile lacks a release build task; outputs differ by
  framework. Surface skipped checks rather than claiming a green all-app build.
- [ ] **QA-006 - Accessibility/performance/release checks** | Planned | P1 | **3-5 days**. Verify keyboard/focus, screen
  readers, contrast, dynamic text, responsive layout, images, long lists, and slow networks. Set a small load/query
  baseline. TypeScript checks, production builds, and runtime acceptance are separate results.
- [ ] **QA-007 - Repository/onboarding documentation** | Partial | P1 | **2-3 days**. Refresh README architecture,
  paths, ports, commands, mobile/admin setup, and tests. Current README still describes earlier structure/mobile plans
  and a database port differing from Compose. Add environment examples and migration/deployment runbooks without real
  secrets.
- [ ] **QA-008 - Privacy documents versus actual behaviour** | Partial | P1 | **2-4 days**. Review collection, support
  delivery, telemetry, retention, export/deletion, and future AI disclosures. Separate planned from shipped capabilities
  and obtain appropriate launch-region review. This checklist is not a declaration of legal compliance.

## 10. Hosting, Deployment, and Operations

Compose currently provides local database/cache infrastructure. No VPS, domain, production environment, or app-store
publication is assumed to exist.

- [ ] **OPS-001 - Environments and topology** | Planned | P1 | **1-2 days**. Define local/staging/production, domains,
  region, capacity/budget, and secret ownership. One initial VPS can host Angular static output, Next.js, NestJS,
  PostgreSQL, Redis, and a proxy; document its single-point-of-failure risk and later separation path.
- [ ] **OPS-002 - Persistent/private data services** | Partial | P0 | **2-4 days**. Add explicit PostgreSQL storage,
  appropriate Redis persistence if used beyond expendable caching, pinned images, correct Postgres user variables/health
  checks, and safe credentials. Remove production public database/cache exposure. Test container replacement without
  data loss; anonymous/container storage is not a recovery plan.
- [ ] **OPS-003 - Production application artefacts** | Planned | P1 | **3-5 days**. Add reproducible API/admin builds or
  images, Angular static output, and shared generation. Separate public build settings from runtime secrets. Use
  production entry points, not `ng serve`, `next dev`, Nest watch mode, or Expo development servers. Keep uploads
  outside release directories.
- [ ] **OPS-004 - SSH, DNS, HTTPS, and routing** | Planned | P1 | **2-4 days**. Provision key-based access, restricted
  deploy user, updates, and firewall. Configure DNS/proxy routing for web/admin/API and optional public assets. Keep
  repository/secrets/database files outside public roots. Verify certificate renewal, SPA routes, and API paths.
- [ ] **OPS-005 - Production config and safe migrations** | Partial | P0 | **2-4 days**. Validate env values, origins,
  cookies/CSRF, native API addresses, and provider credentials. Separate production migrations from dev/reset commands,
  back up risky changes, rehearse compatibility, and avoid concurrent migration races. Never reset production to deploy
  a schema change.
- [ ] **OPS-006 - Backup and restoration** | Planned | P0 | **3-5 days**. Automate encrypted database/media backups
  outside the server with retention/access limits and failure alerts. Restore into isolation and verify totals/media.
  Define acceptable data loss and recovery time: a configured schedule is not proof of recovery.
- [ ] **OPS-007 - Release and rollback automation** | Planned | P1 | **3-5 days**. Deploy tested versioned artefacts,
  safe migrations, health checks, and public-app smoke tests. Document rollback limits for irreversible schema changes.
  Keep previous artefacts/releases and protect production deployment behind staging/approval.
- [ ] **OPS-008 - Monitoring and incident basics** | Planned | P1 | **2-4 days**. Monitor uptime, errors, latency,
  disk/memory, backup freshness, certificates, jobs, and costs. Redact private finance/auth data and define actionable
  alerts and recovery steps. Catch runaway uploads/retries before they exhaust capacity.
- [ ] **OPS-009 - Public assets versus private uploads** | Partial | P2 | **1-3 days**. If hosting shared images, expose
  only intended public branding/default assets with stable URLs. Keep private uploads authorised through existing
  storage, define size/cache rules, and back up non-reproducible files. This is not an automatic S3 migration.
- [ ] **OPS-010 - Mobile release operations** | Planned | P2 | **2-4 days**. After MOB-015, automate beta/store release
  checks, API compatibility, credential rotation, notes, crash reporting, and update rollback rules. Native binaries run
  on devices; hosting the API is not mobile distribution.

## 11. Longer-Term Product Development

The privacy policy describes voice logging and receipt scanning as future possibilities. They are not implemented simply
because documented. Start after normal transactions are secure/correct; other proposals below require explicit scope
decisions.

- [ ] **FUT-001 - Voice-assisted transaction drafts** | Planned direction; scope to confirm | P3 | **8-15 days for a
  bounded prototype**. Capture approved speech, transcribe, extract amount/type/date/account/category/currency, and
  return an editable draft. Show ambiguity and require confirmation through the normal mutation. Add
  permission/cancel/error states, cost limits, and audio retention/deletion. Estimate production multilingual scope
  after evaluation.
- [ ] **FUT-002 - Receipt scanning and extraction** | Planned direction; scope to confirm | P3 | **10-20 days for a
  bounded prototype**. Privately upload receipts, extract merchant/date/items/tax/tip/total/currency, validate
  arithmetic, and show review/correction. Handle duplicates, unreadable images, uncertain fields, and optional Splitr
  import. Never silently commit an OCR/AI guess to balances.
- [ ] **FUT-003 - AI privacy/safety/evaluation** | Planned dependency of FUT-001/FUT-002 | P3 | **4-7 days**. Define
  consent, allowed data, provider retention/training settings, deletion, retry/time/cost controls, and representative
  accuracy tests. Treat uploaded text as untrusted, validate structured output, and prevent generated content granting
  access or executing arbitrary actions. Data-entry assistance is not financial advice.
- [ ] **FUT-004 - Categorisation and recurring suggestions** | Proposed | P3 | **5-10 days**. Suggest
  categories/recurrences with confidence and user correction. Keep suggestions reversible/separate from approved entries
  and measure whether they save effort before automating them.
- [ ] **FUT-005 - Banking or real payment integration** | Proposed; separate discovery | P3 | **5-10 discovery days;
  delivery not yet estimable**. Confirm countries, provider support, consent, contracts/costs, reconciliation, and
  security/regulatory obligations. Current internal transfers/payment recording are not a banking/payment service.
- [ ] **FUT-006 - Paid plans/subscriptions** | Proposed; not assumed scope | P3 | **2-4 discovery days; delivery to
  estimate separately**. Only if monetisation is chosen, define plans, entitlements, billing/refunds, and store
  implications. Customer transaction totals are not application revenue; revenue charts need genuine billing records.

## 12. How the Applications and Features Connect

### 12.1 One domain platform, three clients

```text
Angular customer web ----\
                         +--> NestJS /api/v1 --> PostgreSQL (durable domain data)
Expo customer mobile ---/          |          --> Redis (cache / selected infrastructure)
                                   |          --> Media provider / optional public assets
Next.js staff dashboard ---------->|
       staff-only queries/actions  +--> Events/jobs --> inbox, email, foreground SSE, optional push

frontend/shared --> serialisable contracts, constants, colours, and asset sources
```

All clients go through authenticated, authorised NestJS contracts for domain data. Clients must not hold database
credentials or bypass business rules. Next.js server rendering can call NestJS server-to-server, but still
forwards/validates the acting staff identity. A server-side environment does not remove permission checks.

PostgreSQL is the durable source of financial records. Redis cache loss must not lose money records. SSE/push deliver
updates rather than replace persisted state; clients refetch after missed events. Native, Angular, and React web UI
remain platform-specific even when types/colours are shared. The diagram includes planned jobs/email/push; it is the
target connection map, not a claim all these paths exist today.

### 12.2 Feature dependency map

| Capability            | Backend/data prerequisite                                                     | Customer client work                                     | Admin connection                                                        |
|-----------------------|-------------------------------------------------------------------------------|----------------------------------------------------------|-------------------------------------------------------------------------|
| Staff administration  | SEC-002/003/004/008/009: owner, grants, sessions, invitations, audit.         | Public registration cannot create staff access.          | DASH-001/013 consume grants; every sensitive API still checks policies. |
| Paged history         | API-001/005: ownership, stable bounded queries, filters, metadata.            | WEB-003 store/resource and MOB-008 paging.               | DASH-007 uses a staff-scoped query, not an unrestricted customer route. |
| Accurate finance home | FIN-001 to FIN-004; API-002: exact money, recorded rates, scoped aggregates.  | WEB-004/MOB-006 summaries independent of pages.          | DASH-003/007 aggregate without unnecessary personal finance exposure.   |
| Bills/reminders       | FIN-008; NOT-001/002: occurrences, payment records, real deduplicated alerts. | WEB-006/MOB-009 recording plus inbox/deep links.         | DASH-008/010 show actual job/delivery outcomes.                         |
| Goal progress         | FIN-007 contribution/status rules; NOT-001 milestones.                        | WEB-006/MOB-009 contributions/progress.                  | DASH-008 adoption/status with limited drill-down.                       |
| Splitr settlement     | FIN-010/011: arithmetic, membership choice, permissions/history.              | WEB-007/MOB-010 server-validated breakdowns.             | DASH-008 oversight, not arbitrary edits.                                |
| Feedback roadmap      | FDB-001 to FDB-003: votes/comments and staff transitions.                     | WEB-010 and later mobile feedback.                       | DASH-009 moderation/release status.                                     |
| Actual support        | API-006 intake/delivery; SEC-009 staff actions.                               | WEB-009 and later mobile support preserve failed drafts. | DASH-011 triages/replies to the same records.                           |
| Engagement charts     | OBS-001/003/004 definitions and minimal activity events.                      | Instrument agreed events with privacy rules.             | DASH-005 reports only collected periods.                                |
| Voice/receipt entry   | FUT-003 evaluation/privacy, FUT-001/002 drafts, normal mutation.              | Record/upload, correct, confirm, pending/error states.   | Aggregate reliability/cost, not default raw receipt/audio access.       |

### 12.3 Proposed dashboard API surface

These are **design examples, not existing routes or final contracts**. Retain `/api/v1`, protect the admin namespace
with staff policies, add DTOs/shared types, and test negative access before connecting screens.

| Proposed endpoint                                | Purpose                         | Prerequisite                                                                                             |
|--------------------------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------|
| `GET /api/v1/admin/analytics/overview`           | Scoped totals/comparisons.      | OBS-001/002 and appropriate indexes/queries.                                                             |
| `GET /api/v1/admin/analytics/registrations`      | Registration/onboarding series. | Creation fields support registrations; add completion timestamps/events for accurate historical funnels. |
| `GET /api/v1/admin/analytics/engagement`         | Active users and retention.     | Deduplicated qualifying events, not `lastLoginAt` alone.                                                 |
| `GET /api/v1/admin/analytics/traffic`            | Platform/session/route report.  | Page/request instrumentation, privacy rules, bot/internal exclusion.                                     |
| `GET /api/v1/admin/users`                        | Paged minimal user list.        | Staff policy, safe DTO, bounded filters, filtered total.                                                 |
| `GET /api/v1/admin/accounts`                     | Account oversight.              | Masking/audit, paging, lifecycle fields for closure metrics.                                             |
| `GET /api/v1/admin/transactions`                 | Staff-scoped diagnostics.       | Specific financial permissions, paging/export policy, audit.                                             |
| `PATCH /api/v1/admin/features/:featureId/status` | Audited staff roadmap change.   | FDB-003, distinct from author content edits.                                                             |
| `GET /api/v1/admin/support`                      | Intake/triage queue.            | API-006, staff access, paging.                                                                           |
| `POST /api/v1/admin/notifications/campaigns`     | Controlled announcements.       | Audience model, jobs, idempotency, validation, permission.                                               |
| `GET /api/v1/admin/system/health`                | Protected operational summary.  | OBS-005; separate minimal public liveness.                                                               |
| `GET /api/v1/admin/audit-logs`                   | Filtered staff action history.  | SEC-009, redaction, retention, access checks.                                                            |

### 12.4 Metrics available from current data versus new collection

| Metric                                           | Current source support                                                                | Do not assume                                                                                       |
|--------------------------------------------------|---------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Registered users / registrations by date         | IDs and creation dates, excluding deleted rows unless history is separately retained. | Current rows cannot reconstruct deleted users.                                                      |
| Current onboarding completion                    | `isOnboarded` supports a current count.                                               | Historical completion timing needs a specific timestamp/event; generic `updatedAt` is insufficient. |
| Current accounts/transactions/goals/bills/Splitr | Models support scoped counts/aggregates, with correct currency/date rules.            | Models do not automatically provide protected analytics endpoints.                                  |
| Recent login                                     | `lastLoginAt`, once its semantics are verified.                                       | Not daily product activity, session history, or online presence.                                    |
| Active/closed financial accounts                 | Accounts exist; no explicit closure state/history yet.                                | Zero balance or inactivity does not mean closed.                                                    |
| Online users                                     | In-process SSE connection bookkeeping exists.                                         | Not durable, cross-instance, or all-platform presence; clients without SSE are absent.              |
| Retention/funnels/platform adoption              | New collection can support future reporting.                                          | Cannot invent history from before instrumentation.                                                  |
| Latency/failures/traffic                         | Needs collected request metrics/logs and agreed definitions.                          | A chart or successful health check is not instrumentation.                                          |
| Pocket Pilot revenue                             | No billing/subscription model found in schema.                                        | Customer income/transfers/volume are not platform revenue.                                          |

### 12.5 Example: one feature end to end

For "show active users on the admin overview", the work is not just a Next.js card:

1. Agree what active means: for example, one qualifying successful product action during the report period, excluding
   staff/test activity.
2. Implement minimal collection, retention, platform metadata, and tests; do not store full financial payloads just to
   count actions.
3. Add a protected NestJS aggregation endpoint with period/timezone filters, permissions, limits, and missing-data
   semantics.
4. Define its shared response type and dashboard data access; deliberately choose server rendering, refresh, and private
   caching.
5. Render period, number/chart, comparison, and freshness with loading/error/no-data/"not collected yet" states.
6. Test access, duplicates, date boundaries, and query cost. Deploy collection before expecting meaningful charts.

For transaction paging, build API metadata/filters first, connect the Angular store/resource and native list next, and
keep totals on separate aggregate endpoints. A finished client screen is only one part of a shared feature.

### 12.6 Evidence and maintenance

Key inspected files, with paths relative to the repository root:

| Subject                            | Source pointers                                                                                                                                                                         |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Product and future AI              | `README.md`; `docs/PRIVACY_POLICY.md`, especially "AI, Voice Input, and Receipt Scanning".                                                                                              |
| Domain/role/session/closure models | `server/prisma/schema.prisma`; committed name/uniqueness and other migrations.                                                                                                          |
| Auth and user routes               | `server/src/modules/identity/controllers/user.controller.ts`; identity services; `server/src/common/guards/cookies-auth.guard.ts`; `server/src/app.constants.ts`; `server/src/main.ts`. |
| Fixed startup account              | `server/src/modules/startup/services/dashboard.service.ts`; startup module. Do not copy the credential into planning documents.                                                         |
| Financial correctness              | `server/src/modules/wallet/services/transaction.service.ts`; `services/transfer.service.ts`; `repositories/transaction.respository.ts`; wallet/goals/bills controllers.                 |
| Samples/actions/events             | `server/src/modules/notifications/services/notifications.service.ts`; notifications repository; `server/src/modules/sse/services/sse.service.ts`.                                       |
| Vote/status rules                  | `server/src/modules/features/repositories/features.repository.ts`; feature service; Angular feature-details component.                                                                  |
| Web state/placeholders             | `frontend/web/src/app/api/stores/transactions.store.ts`; notifications store; transactions service; main dashboard/support components.                                                  |
| Compact inbox/counter              | `frontend/web/src/app/components/structural/main/notification-item/notification-item.html`; text-area atom.                                                                             |
| Shared design/assets               | `frontend/shared/resources/colors.ts`; shared generation/copy scripts; Angular theme service.                                                                                           |
| Native scope                       | `frontend/mobile/package.json`; `src/app`; `src/constants/theme.ts`; `src/global.css`; `app.config.js`.                                                                                 |
| Admin scaffold                     | `frontend/dashboard/app`; `core/config/routes.ts`; `core/config/navigation.ts`; `features/users/components/users-list.tsx`; package scripts.                                            |
| Operations/quality                 | `server/docker-compose.yml`; `turbo.json`; workspace manifests; server e2e scaffold and Angular app/login smoke tests.                                                                  |

After implementation, update the relevant checkbox/status and add a short completion note or issue/commit link. Revise
estimates after the first small delivery, record scope changes, and keep proposals separate from agreed release
requirements.
