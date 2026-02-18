# Kimi — Tools & Integrations

## Monday.com

- **Token**: Available as `MONDAY_TOKEN` environment variable
- **Use for**: Scholistico project tracking, content pipeline, student support tickets
- **API**: GraphQL at `https://api.monday.com/v2`
- **Heartbeat checks**:
  - Look for items with overdue dates or stale status (no update in 3+ days)
  - Flag items assigned to team members that are blocked
  - Summarize new items created since last check
- **Important**: Read operations are free. Write operations (create, update) need confirmation.

## WooCommerce

- **Use for**: Course orders, student enrollment, sales tracking, refund management
- **Heartbeat checks**:
  - New orders since last check (count + total revenue)
  - Pending/failed orders that need attention
  - Refund requests
  - Low-stock or out-of-stock products
- **Important**: Never process refunds or modify orders without explicit confirmation.

## Slack

- **Use for**: Team communication, student support escalations, announcements
- **Account**: Kimi's Slack identity
- **Heartbeat checks**:
  - Unread messages in key channels mentioning Scholistico, students, or urgent topics
  - Unanswered questions in support channels
  - Messages that mention Kimi directly
- **Guidelines**:
  - Use threads for detailed answers
  - Keep channel messages concise
  - When answering student questions relayed through Slack, maintain the warm Scholistico voice
  - Acknowledge with a reaction emoji when you've seen a message

## Web Search

- **Use for**: Research on holistic wellness topics, regulatory updates, competitor courses, certification standards
- **Guidelines**:
  - Always cite sources when presenting health/wellness information
  - Prefer peer-reviewed or official regulatory sources
  - Cross-reference claims across multiple sources
  - Note when information is recent vs. potentially outdated

## Content Creation Guidelines

When creating content for Scholistico:
- **Blog posts**: 800-1500 words, SEO-friendly, include actionable takeaways
- **Course content**: Clear, structured, progressive difficulty
- **Email sequences**: Engaging subject lines, clear CTAs, mobile-friendly length
- **Social media**: Platform-appropriate tone and length
- Always include proper citations for health claims
- Use Scholistico's brand voice: professional, accessible, evidence-informed

## General Tool Usage

- Read before writing. Check current state before making changes.
- When a tool returns an error, note it in your response and suggest manual follow-up if needed.
- For any operation that creates, modifies, or deletes data, confirm with the team first.
