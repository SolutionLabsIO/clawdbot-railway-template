# ClawBot — Agent Team Control Center

This repo is the **deploy & config control plane** for Charles Lapointe's AI agent team running on Railway via OpenClaw.

## Agents

| Agent | ID | Model | Role |
|-------|----|-------|------|
| **Clawdio** | `clawdio` | `anthropic/claude-opus-4-6` | Charles' personal assistant — coding, research, strategy, general tasks |
| **Kimi** | `kimi` | `anthropic/sonnet-4.6` | Scholistico domain expert — courses, content, student support, holistic wellness |

## Architecture

- **Source**: OpenClaw built from source via Docker (not npm)
- **Fork**: `SolutionLabsIO/clawdbot-railway-template` (forked from `vignesh07/clawdbot-railway-template`)
- **Railway project**: `0302c38d-7531-4d6c-85d7-9a5a1dff993e`
- **Deployment URL**: `https://clawdbot-production-d203.up.railway.app`
- **Setup UI**: `https://clawdbot-production-d203.up.railway.app/setup` (Basic Auth, password in `SETUP_PASSWORD` env var)
- **OpenClaw UI**: `https://clawdbot-production-d203.up.railway.app/openclaw` (gateway password in `OPENCLAW_GATEWAY_PASSWORD`)
- **Config file** (in container): `/data/.openclaw/openclaw.json`
- **Persistent volume**: `/data` (Railway volume `clawdbot-volume`)

## Key Paths (Container)

| Path | Purpose |
|------|---------|
| `/data/.openclaw/openclaw.json` | Main config |
| `/data/workspace` | Clawdio's workspace (default agent) |
| `/data/.openclaw/workspace-kimi` | Kimi's workspace |
| `/openclaw/src/agents/model-selection.ts` | Model alias registry (patched at build) |

## Channels

- **Slack**: 2 accounts — `main` (→ Clawdio) and `kimi` (→ Kimi)
- **Telegram**: @ScholisticoBot (→ Clawdio)

## Integrations

- Monday.com (`MONDAY_TOKEN` in config)
- WooCommerce (planned)
- Web search (Brave API key configured)
- ElevenLabs TTS (configured)
- n8n, Vercel, GitHub, Figma (planned)

## Common Operations

### Check deployment status
```bash
AUTH="Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ=="
curl -s -H "$AUTH" https://clawdbot-production-d203.up.railway.app/setup/api/status | python3 -m json.tool
```

### Check agent health
```bash
AUTH="Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ=="
curl -s -H "$AUTH" -X POST -H 'Content-Type: application/json' \
  -d '{"cmd":"openclaw.health"}' \
  https://clawdbot-production-d203.up.railway.app/setup/api/console/run
```

### View logs
```bash
AUTH="Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ=="
curl -s -H "$AUTH" -X POST -H 'Content-Type: application/json' \
  -d '{"cmd":"openclaw.logs.tail","arg":"100"}' \
  https://clawdbot-production-d203.up.railway.app/setup/api/console/run
```

### Read current config
```bash
AUTH="Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ=="
curl -s -H "$AUTH" https://clawdbot-production-d203.up.railway.app/setup/api/config/raw
```

### Push config update
```bash
AUTH="Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ=="
PAYLOAD=$(python3 -c "import json; print(json.dumps({'content': open('path/to/config.json').read()}))")
curl -s -H "$AUTH" -X POST -H 'Content-Type: application/json' \
  -d "$PAYLOAD" \
  https://clawdbot-production-d203.up.railway.app/setup/api/config/raw
```

### Restart gateway
```bash
AUTH="Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ=="
curl -s -H "$AUTH" -X POST -H 'Content-Type: application/json' \
  -d '{"cmd":"gateway.restart"}' \
  https://clawdbot-production-d203.up.railway.app/setup/api/console/run
```

### Railway CLI
```bash
railway status
railway variables
railway service logs Clawdbot --tail 100
railway service redeploy Clawdbot
```

### Deploy (push to GitHub triggers Railway auto-deploy)
```bash
git push origin main
```

## Source Patches

All source edits are **lost on redeploy**. Patches go through the Dockerfile:

- **Sonnet 4.6 alias**: `sed` adds `"sonnet-4.6": "claude-sonnet-4-6"` to `model-selection.ts`
- Future patches follow the same pattern: `sed` before `pnpm build`

## Environment Variables (Railway)

| Variable | Purpose |
|----------|---------|
| `SETUP_PASSWORD` | Password for `/setup` Basic Auth |
| `OPENCLAW_GATEWAY_PASSWORD` | Gateway/Control UI password |
| `MOONSHOT_API_KEY` | Moonshot AI (Kimi K2.5) API key |
| `OPENCLAW_STATE_DIR` | `/data/.openclaw` |
| `OPENCLAW_WORKSPACE_DIR` | `/data/workspace` |

## Claude Code Preferences

- Use **Sonnet 4.6** (`sonnet`) for all subagent/Task tool searches — never Haiku
- This terminal is the control center for the agent team

## Agent Identity System

OpenClaw builds system prompts from workspace files, not config fields. Key files per workspace:
- `AGENTS.md` — Role, instructions, behavioral guidelines
- `SOUL.md` — Philosophy, personality, tone
- `IDENTITY.md` — How the agent presents itself

These are seeded by the entrypoint script (`scripts/seed-workspaces.sh`) on container boot.
