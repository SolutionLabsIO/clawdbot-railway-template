# Clawdio — Long-Term Memory

## Owner

- **Name**: Charles Lapointe
- **Organization**: SolutionLabsIO
- **Role**: Founder / technical lead
- **Communication style**: Direct, values efficiency, prefers short answers with action items
- **Slack User ID**: UQZL3HGQP

## Team

- **Clawdio** (me): Charles' full-stack assistant. Model: Claude Opus 4.6. Channels: Slack (main), Telegram.
- **Kimi**: Scholistico domain expert. Model: Claude Sonnet 4.6. Channels: Slack (kimi account). Handles courses, students, content, WooCommerce, Monday.com for Scholistico.

## Infrastructure

### Railway Deployment
- **Service**: Clawdbot (Docker, auto-deploy from GitHub on push to main)
- **Repo**: SolutionLabsIO/clawdbot-railway-template
- **Volume**: /data (persistent — config, sessions, workspaces, backups)
- **Public URL**: clawdbot-production-d203.up.railway.app
- **Setup UI**: /setup (Basic Auth with SETUP_PASSWORD)
- **Gateway**: OpenClaw on port 18789 (loopback bind, proxied through wrapper on 8080)

### Key Paths (container)
- Config: /data/.openclaw/openclaw.json
- Clawdio workspace: /data/workspace
- Kimi workspace: /data/.openclaw/workspace-kimi
- Session files: /data/.openclaw/agents/
- Backups: /data/backups/

### Monitoring
- Health check: /setup/healthz (probes actual gateway)
- Gateway monitor: checks every 2 min, Slack DM alert after 4 min downtime
- Session cleanup: every 6h, removes files >72h old
- Daily backup: every 24h, keeps 7 copies
- Cost endpoint: /setup/api/costs

## Architecture Decisions

- **Gateway bind = loopback**: LAN mode caused WebSocket 1006 abnormal closures. Loopback is stable.
- **Auth mode = password**: Token mode crashed the gateway. Password mode with "scholistico2026" is stable.
- **Compaction maxHistoryShare = 0.3**: Reduced from 0.5 to save context window space.
- **Session retention = 72 hours**: 24h was too aggressive, 72h gives enough history.
- **Subagent model = Sonnet 4.6**: Cheaper than Opus for delegated tasks. Main agents use their own models.
- **Slack groupPolicy = allowlist**: Both accounts restricted to specific channels only.

## Slack Channel Assignments

### Clawdio (main account) — 4 channels
- C05KG0XH4Q1 — dev
- C06RHPLRTV2 — design
- CQK17UZNE — general
- C0AFH6PP3TN — scholistico-ai

### Kimi (kimi account) — 13 channels
- C05MEJU50SX, C04NY7PQP3N, C049DD0GLKZ, C06BRQR0S23, C04D81ZGPN2, C04NF7Q24K1, C03S6JBHZDG, C07V4DKMJN9, C07N7R10R1Q, C07LMAW7PJA, C05NFG60UP7, C079TQPKM39, C09Q3RXSY1X (failed-payments)

## Known Issues

- Slack display name changes can take hours to propagate in client cache
- OpenClaw config validation is strict — unrecognized keys crash the gateway
- `!!` in SETUP_PASSWORD causes bash escaping issues with curl `-u` flag — use pre-encoded base64 header instead
- Some Slack channels (private/Slack Connect) don't appear in conversations.list — get IDs manually from channel details

## Operations Playbook

### Deploy changes
1. Edit files locally in /Users/charleslapointe/ClawBot
2. git commit && git push origin main
3. Railway auto-deploys (watch for 502 during container swap)

### Update live config
- GET /setup/api/config/raw — fetch current config
- POST /setup/api/config/raw — push new config (auto-restarts gateway)
- Auth header: `Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ==`

### Restart gateway
- POST /setup/api/console/run with `{"cmd":"gateway.restart"}`
- Gateway auto-restarts on unexpected exit (2s delay)

### Force redeploy
- `railway redeploy --yes` or push empty commit
