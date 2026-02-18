# ClawBot — Architecture & Operations

## Infrastructure

### Railway (Production)
- **Service**: Clawdbot (Docker, auto-deploy from GitHub)
- **Repo**: SolutionLabsIO/clawdbot-railway-template
- **Volume**: /data (persistent — config, sessions, workspaces)
- **Public URL**: clawdbot-production-d203.up.railway.app
- **Setup UI**: /setup (Basic Auth with SETUP_PASSWORD)
- **Gateway**: OpenClaw gateway on port 18789 (loopback, proxied through wrapper on 8080)

### Key Paths (on container)
- Config: /data/.openclaw/openclaw.json
- Clawdio workspace: /data/workspace
- Kimi workspace: /data/.openclaw/workspace-kimi
- Session files: /data/.openclaw/agents/

### Environment Variables
- SETUP_PASSWORD — Setup UI auth
- OPENCLAW_GATEWAY_PASSWORD — Gateway auth
- MOONSHOT_API_KEY — Kimi K2.5 model access
- ALERT_SLACK_USER_ID — Slack DM target for monitoring alerts
- OPENCLAW_STATE_DIR — /data/.openclaw
- OPENCLAW_WORKSPACE_DIR — /data/workspace

## Agents

### Clawdio (default)
- **Model**: anthropic/claude-opus-4-6
- **Role**: Charles' full-stack assistant
- **Channels**: Slack (main account), Telegram
- **Heartbeat**: Monitors GitHub, Vercel, Railway, Monday.com

### Kimi
- **Model**: anthropic/claude-sonnet-4-6
- **Role**: Scholistico domain expert
- **Channels**: Slack (kimi account)
- **Heartbeat**: Monitors Monday.com, WooCommerce, Slack support

## Operations Runbook

### Deploy changes
1. Edit files in /Users/charleslapointe/ClawBot
2. git commit && git push origin main
3. Railway auto-deploys from GitHub
4. Monitor: railway logs

### Update live config
```bash
# Fetch
curl -s -H "Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ==" \
  "https://clawdbot-production-d203.up.railway.app/setup/api/config/raw"

# Push (modify content field)
curl -s -H "Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ==" \
  -X POST -H "Content-Type: application/json" \
  -d @config.json \
  "https://clawdbot-production-d203.up.railway.app/setup/api/config/raw"
```

### Restart gateway
```bash
curl -s -H "Authorization: Basic YWRtaW46U2Nob2xpc3RpY28hIQ==" \
  -X POST -H "Content-Type: application/json" \
  -d '{"cmd":"gateway.restart"}' \
  "https://clawdbot-production-d203.up.railway.app/setup/api/console/run"
```

### Force redeploy
```bash
railway redeploy --yes
```

## Monitoring

- Health check: /setup/healthz (probes gateway)
- Gateway monitor: checks every 2min, Slack DM after 4min downtime
- Session cleanup: every 6h, removes files >72h old
- Railway metrics: CPU, RAM, network, volume in Railway dashboard

## Known Issues

- OpenClaw forward-compat may not resolve all new model IDs — check status output for fallback
- Slack name changes can take hours to propagate in client cache
- Gateway config changes that fail validation will crash the gateway — always verify config before pushing
