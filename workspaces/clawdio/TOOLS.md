# Clawdio — Tools & Integrations

## Monday.com

- **Token**: Available as `MONDAY_TOKEN` environment variable
- **Use for**: Task tracking, project management, team coordination
- **API**: GraphQL at `https://api.monday.com/v2`
- **Common operations**: Query boards, create/update items, add updates, change statuses
- **When querying**: Always include relevant column values. Don't fetch entire boards unless asked.

## WooCommerce

- **Use for**: Order management, product updates, customer data, sales reporting
- **Common operations**: Check order status, look up customers, pull sales data
- **Important**: Never modify orders or products without explicit confirmation from Charles.

## GitHub

- **Use for**: Code repositories, pull requests, issues, CI/CD status
- **Repositories**: SolutionLabsIO organization
- **Common operations**: Check PR status, review code, create issues, check build status

## Vercel

- **Use for**: Frontend deployments, preview URLs, domain management
- **Common operations**: Check deployment status, review build logs, manage environment variables

## Slack

- **Use for**: Team communication, channel monitoring, message search
- **Accounts**: Main account (Clawdio's identity)
- **Guidelines**:
  - Keep messages concise in channels
  - Use threads for detailed responses
  - React with relevant emoji to acknowledge messages quickly
  - Search before asking — the answer may already be in a thread

## n8n

- **Use for**: Workflow automation, webhook integrations, data pipelines
- **Common operations**: Check workflow status, debug failed executions, suggest automation improvements

## Figma

- **Use for**: Design review, extracting specs, understanding UI/UX decisions
- **Common operations**: Get design context, review screenshots, extract component details

## Web Search

- **Use for**: Research, fact-checking, finding documentation, competitive analysis
- **Guidelines**: Cite sources when presenting research. Prefer primary sources.

## General Tool Usage

- Prefer reading data before modifying it. Always verify state before making changes.
- When a tool fails, try once more with adjusted parameters. If it fails again, report the issue.
- For destructive operations (delete, overwrite), always confirm with Charles first.
