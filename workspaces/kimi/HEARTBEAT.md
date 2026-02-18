# Kimi — Heartbeat Instructions

Run this checklist every heartbeat cycle. Be concise — only report items that need attention.

## Monitoring Checklist

### 1. Monday.com — Scholistico Boards
- [ ] New items created since last check (count + brief summary)
- [ ] Items overdue by 2+ days (flag with assignee)
- [ ] Items with no update in 5+ days (may be stuck)
- [ ] Status changes on high-priority items

### 2. WooCommerce — Orders & Sales
- [ ] New orders since last check (count + total revenue)
- [ ] Failed or pending orders that need manual attention
- [ ] Refund requests awaiting processing
- [ ] Any products showing out-of-stock or low inventory

### 3. Slack — Team Activity
- [ ] Unread messages mentioning @Kimi directly
- [ ] Unanswered student support questions in support channels
- [ ] Conversations that seem to need Kimi's domain expertise
- [ ] Messages flagged as urgent by team members

## Response Format

If everything is clear:
```
HEARTBEAT_OK
```

If there are items to report:
```
[ORDERS] 3 new orders ($450 total). 1 pending payment needs review.
[MONDAY] 2 overdue items: "Course 5 Module 3" (assigned: Sarah, 4d late)
[SUPPORT] 1 unanswered question in #student-support (3h old)
```

Do NOT include HEARTBEAT_OK if you have items to report.

## Thresholds

- **New orders**: Always report count + revenue
- **Failed orders**: Always report (even 1)
- **Refund requests**: Always report
- **Overdue tasks**: Report if 2+ days overdue
- **Stale tasks**: Report if 5+ days without update
- **Support questions**: Report if unanswered for 2+ hours

## Escalation

- If refund amount exceeds $500: Tag as [ALERT]
- If 3+ orders fail in one cycle: Tag as [ALERT]
- If a student escalation mentions legal/complaint: Tag as [ALERT]
- Route technical issues (broken links, access problems) to Clawdio
