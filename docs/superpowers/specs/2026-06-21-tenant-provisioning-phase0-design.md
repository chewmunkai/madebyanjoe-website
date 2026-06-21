# Tenant Provisioning — Phase 0 (Blueprint + Onboard Skill + Registry)

- **Date:** 2026-06-21
- **Status:** draft (design), pending review
- **Initiative:** the multi-client **EPS store-builder product** (Tier 3 productization)
- **Builds on:** the EPS Ecom Service (Medusa + no-code builder + Theme Editor) + the
  `import-design` pipeline. System note: `40 Systems/EPS Ecom Service (Store Builder)`.

## 1. Goal & shape

Turn the single-store Anjoe stack into a **repeatable, per-tenant deployable** so a new
client store can be stood up — by Sheng asking Claude to run the onboard, **not** an
unattended self-serve orchestrator. Each tenant is an **isolated managed-cloud stack**.

**Decided architecture (from the brainstorm):**
- **Instance-per-tenant**, each on **managed cloud** (chosen for security: no host to
  patch, microVM isolation, managed TLS/secrets — vs N self-managed VPSs to harden).
- **Medusa backend → Fly.io** (Machines; scale-to-zero for idle stores) ·
  **Storefront → Cloudflare Pages** (static, near-free, custom domains) ·
  **DB → Supabase** · **Redis → Upstash** · **Storage → Cloudflare R2**.
- Provisioning is an **assisted runbook** (`/onboard-tenant` skill) Claude executes,
  plus a **tenant registry** (the cockpit). Self-serve signup + Stripe billing are a
  later phase, deliberately deferred.

**Phase 0 delivers three things:** (1) the tenant **blueprint**, (2) the **`/onboard-tenant`
skill**, (3) the **tenant registry** — and proves them by onboarding one real second store.

## 2. Non-goals (Phase 0)
- No unattended self-serve signup, no Stripe billing, no automated rollback engine.
- No Console *UI* (the registry is a data file/table + the skill; UI is a later phase).
- No design-registry *UI* (designs come via the existing `import-design` pipeline).
- Not changing Anjoe's live stack on talos (Anjoe stays where it is; the blueprint is the
  *template* future tenants are cut from — Anjoe can migrate to it later, separately).

## 3. The tenant blueprint (config-driven deployable)

Today's stack hardcodes Anjoe specifics. The blueprint makes every per-tenant value an
**injected secret/env**, so the same artifacts deploy any tenant:

| Concern | Injected as | Source |
|---|---|---|
| DB | `DATABASE_URL` | the tenant's Supabase connection string |
| Redis | `REDIS_URL` | the tenant's Upstash URL |
| Secrets | `JWT_SECRET`, `COOKIE_SECRET` | generated per tenant (unique) |
| CORS | `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` | the tenant's domain(s) |
| Storefront → API | `VITE_MEDUSA_URL`, `VITE_MEDUSA_PUBLISHABLE_KEY` | the tenant's Fly URL + its publishable key |
| Active design | `ACTIVE_DESIGN=<key>` (build-time) | the tenant's chosen design |
| Admin | unique strong password | generated, stored in the platform secret store |
| Storage | R2 bucket/prefix | per-tenant prefix |

- **Backend (Fly):** the existing Medusa image (Dockerfile unchanged — `npm run start`
  only, migrations a separate step per the documented gotcha). A `fly.toml` template +
  `fly secrets` for all of the above. Scale-to-zero (`auto_stop_machines`) so idle stores
  cost ~cents.
- **Storefront (CF Pages):** **per-tenant build that includes ONLY the tenant's design**
  (no cross-client design code in any bundle — isolation + smaller bundles). Achieved via
  a build-time `ACTIVE_DESIGN` that selects the one design's manifest+module to register.
  Built with the tenant's `VITE_MEDUSA_URL`/key + `VITE_BASE=/`.
- **Seed:** migrations (via `docker/fly run` one-shot, not baked into CMD) + a **catalog
  template** (or the client's real catalog import) + the chosen design's **published
  layout** seeded into `page_builder` so the store renders immediately.

## 4. The `/onboard-tenant` skill (the runbook Claude executes)

`/onboard-tenant <name> <domain> <design-key> [plan]` → runs, in order, idempotently:
1. **Pre-flight:** validate inputs; confirm the design exists (registry); confirm Sheng's
   go (it spends money — a tenant = real $/mo).
2. **DB:** create the tenant's Supabase database (project-per-tenant *or* db-per-tenant —
   see §7) + capture the connection string.
3. **Redis/storage:** create the Upstash DB + R2 prefix.
4. **Backend:** create the Fly app, set all secrets (§3), deploy the Medusa image, run
   migrations as a one-shot, seed catalog + the design's published layout, create the
   **admin user with a unique strong password** (stored in the secret store, never echoed).
5. **Storefront:** create the CF Pages project, build with `ACTIVE_DESIGN` + the tenant's
   API URL/key, attach the domain, verify TLS.
6. **Wire:** CORS to the domain; health-check both halves (backend `/health` 200,
   storefront route 200, a published layout renders).
7. **Register:** append the tenant to the registry (§5).
8. **Backup:** install the per-tenant backup (the `ecom-backup.sh` pattern, pointed at the
   tenant's Supabase) on a schedule.
9. **Report:** the live URLs + the admin login handoff + the monthly cost line.

Security baked into every run: unique secrets per tenant; admin password unique + strong
(**the `Dev!Anjoe2026` default must never ship to a client**); no public Postgres/Redis
(managed + restricted); HTTPS + HSTS + the existing `middlewares.ts` headers; secrets only
in platform stores, never committed.

## 5. The tenant registry (the cockpit)

One record per tenant — the source of truth for "who exists, where, on what plan." Phase 0:
a simple structured store (a JSON/SQLite file in a private control repo, or a Supabase
`tenants` table). Shape:

```
{ id, name, domain, status: provisioning|live|suspended,
  fly_app, supabase_ref, upstash_ref, r2_prefix,
  design_key, plan, publishable_key,
  admin_email, created_at, monthly_cost_est }
```

(Secrets are NOT stored here — only references/handles; actual secrets live in the platform
secret stores.) This becomes the data layer the future Console UI + billing read from.

## 6. Cost model (grounds pricing)
- **Idle tenant** (Fly scaled-to-zero + shared/cheap Supabase + Upstash free + Pages free)
  ≈ a few $/mo. **Active** ≈ $7–15/mo all-in. → plans should start **~$39–49/mo**.
- The onboard skill records `monthly_cost_est` per tenant so margin is always visible.

## 7. Open decisions (settle on review)
1. **Supabase isolation:** project-per-tenant (clean isolation, ~$25/mo past 2 free) vs
   one project + **database-per-tenant** (cheaper, slight shared-blast-radius). *Lean:
   db-per-tenant for standard plans; project-per-tenant for premium.*
2. **Domain strategy:** `<tenant>.<eps-domain>` subdomains (instant, we own DNS) vs custom
   client domains (CNAME, more setup). *Lean: subdomain first, custom domain as an upgrade.*
3. **Registry home:** a private `eps-store-control` repo (JSON/SQLite) vs a Supabase
   control DB. *Lean: a private control repo for Phase 0; promote to a DB when the Console UI lands.*
4. **Anjoe:** leave on talos, or migrate it onto the blueprint as tenant #1? *Lean: leave
   it; cut a NEW tenant to prove the blueprint, migrate Anjoe later if desired.*

## 8. Verification (how we prove Phase 0)
Run `/onboard-tenant` for one real (or staging) store end-to-end and confirm: backend
`/health` 200, storefront route 200, the seeded design renders, admin login works with the
generated password, the Theme Editor edits + publishes, the backup runs once, and the
registry has the record. No step requires touching another tenant (isolation).

## 9. Sequence after Phase 0
Phase 1 Console UI (read the registry; suspend/resume/delete) → Phase 2 design-registry UI
→ Phase 3 self-serve signup + Stripe billing (fires the same onboard path). Each earns the
next; the onboard skill is the spine they all call.

## 10. Risks
- **Per-tenant cost** is real and recurring — pricing must clear it (tracked in the registry).
- **Provisioning is multi-provider** (Supabase + Fly + CF + Upstash + R2) — partial-failure
  handling matters even in an assisted runbook; the skill must be idempotent + leave a clean
  state (or a clear "half-provisioned, resume here" marker).
- **Secrets sprawl** across providers — discipline: platform secret stores only, references
  in the registry, never secrets in git.
- **Medusa cold-start** on scale-to-zero adds first-request latency — acceptable for low-
  traffic stores; premium plans can keep a warm machine.
