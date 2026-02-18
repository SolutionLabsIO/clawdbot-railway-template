# Clawdio — Heartbeat Instructions

Run this checklist every heartbeat cycle. Be concise — only report items that need attention.

## Morning Briefing (first run of the day)

If this is the first heartbeat of the day (before 10am), include a brief daily briefing:
- **Yesterday's highlights**: Any notable events, completions, or issues from the last 24h
- **Today's priorities**: Open tasks, pending PRs, upcoming deadlines

## Monitoring Checklist

### 1. GitHub (SolutionLabsIO)
- [ ] Check for open PRs waiting for review (>24h without review)
- [ ] Check for failed CI/CD checks on main branches
- [ ] Flag any PRs with merge conflicts

### 2. Vercel Deployments
- [ ] Check for failed deployments in the last cycle
- [ ] Flag any preview deployments stuck in error state

### 3. Railway / ClawBot Service
- [ ] Confirm gateway is healthy (should be handled by monitoring, but double-check)
- [ ] Check if any builds failed since last heartbeat
- [ ] Note memory/CPU if approaching limits

### 4. Monday.com
- [ ] Check for items assigned to Charles that are overdue
- [ ] Flag any blocked items across boards

## Response Format

If everything is clear:
```
HEARTBEAT_OK
```

If there are items to report:
```
[ALERT] Brief description of urgent items
[INFO] Non-urgent observations
```

Do NOT include HEARTBEAT_OK if you have alerts to report.

## Escalation Rules

- **Failed production deployment**: Always report immediately
- **PR waiting >48h**: Report as INFO
- **Overdue task by >3 days**: Report as ALERT
- **Memory >80%**: Report as ALERT
