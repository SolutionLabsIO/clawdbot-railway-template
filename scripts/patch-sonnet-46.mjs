#!/usr/bin/env node
/**
 * Patch /openclaw/src/agents/model-forward-compat.ts to register claude-sonnet-4-6.
 *
 * Adds a forward-compat resolver that clones claude-sonnet-4-5 capabilities
 * for claude-sonnet-4-6, mirroring how opus-4-6 is handled.
 *
 * Run BEFORE pnpm build, AFTER pnpm install.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "/openclaw/src/agents/model-forward-compat.ts";

let src = readFileSync(FILE, "utf8");

// Guard: don't double-patch
if (src.includes("ANTHROPIC_SONNET_46_MODEL_ID")) {
  console.log("[patch-sonnet-46] Already patched, skipping.");
  process.exit(0);
}

// 1. Add constants after the Opus 4.6 template constants
const opusTemplateAnchor = /const ANTHROPIC_OPUS_TEMPLATE_MODEL_IDS\s*=.*?;\s*\n/s;
const opusTemplateMatch = src.match(opusTemplateAnchor);
if (!opusTemplateMatch) {
  console.error("[patch-sonnet-46] Could not find ANTHROPIC_OPUS_TEMPLATE_MODEL_IDS anchor.");
  process.exit(1);
}

const sonnetConstants = `
const ANTHROPIC_SONNET_46_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_SONNET_46_DOT_MODEL_ID = "claude-sonnet-4.6";
const ANTHROPIC_SONNET_TEMPLATE_MODEL_IDS = ["claude-sonnet-4-5", "claude-sonnet-4.5"] as const;
`;

src = src.replace(
  opusTemplateAnchor,
  opusTemplateMatch[0] + sonnetConstants
);

// 2. Add the resolver function before resolveForwardCompatModel
const dispatcherAnchor = /^export function resolveForwardCompatModel\(/m;
if (!dispatcherAnchor.test(src)) {
  console.error("[patch-sonnet-46] Could not find resolveForwardCompatModel anchor.");
  process.exit(1);
}

const sonnetResolver = `
function resolveAnthropicSonnet46ForwardCompatModel(
  provider: string,
  modelId: string,
  modelRegistry: ModelRegistry,
): Model<Api> | undefined {
  const normalizedProvider = normalizeProviderId(provider);
  if (normalizedProvider !== "anthropic") {
    return undefined;
  }

  const trimmedModelId = modelId.trim();
  const lower = trimmedModelId.toLowerCase();
  const isSonnet46 =
    lower === ANTHROPIC_SONNET_46_MODEL_ID ||
    lower === ANTHROPIC_SONNET_46_DOT_MODEL_ID ||
    lower.startsWith(\`\${ANTHROPIC_SONNET_46_MODEL_ID}-\`) ||
    lower.startsWith(\`\${ANTHROPIC_SONNET_46_DOT_MODEL_ID}-\`);
  if (!isSonnet46) {
    return undefined;
  }

  const templateIds: string[] = [];
  if (lower.startsWith(ANTHROPIC_SONNET_46_MODEL_ID)) {
    templateIds.push(lower.replace(ANTHROPIC_SONNET_46_MODEL_ID, "claude-sonnet-4-5"));
  }
  if (lower.startsWith(ANTHROPIC_SONNET_46_DOT_MODEL_ID)) {
    templateIds.push(lower.replace(ANTHROPIC_SONNET_46_DOT_MODEL_ID, "claude-sonnet-4.5"));
  }
  templateIds.push(...ANTHROPIC_SONNET_TEMPLATE_MODEL_IDS);

  return cloneFirstTemplateModel({
    normalizedProvider,
    trimmedModelId,
    templateIds,
    modelRegistry,
  });
}

`;

src = src.replace(
  dispatcherAnchor,
  sonnetResolver + "export function resolveForwardCompatModel("
);

// 3. Wire it into the dispatcher chain — add after the opus resolver line
const opusDispatchLine =
  /resolveAnthropicOpus46ForwardCompatModel\(provider,\s*modelId,\s*modelRegistry\)\s*\?\?/;
const opusDispatchMatch = src.match(opusDispatchLine);
if (!opusDispatchMatch) {
  console.error("[patch-sonnet-46] Could not find opus dispatcher line.");
  process.exit(1);
}

src = src.replace(
  opusDispatchLine,
  opusDispatchMatch[0] +
    "\n    resolveAnthropicSonnet46ForwardCompatModel(provider, modelId, modelRegistry) ??"
);

writeFileSync(FILE, src, "utf8");
console.log("[patch-sonnet-46] Successfully patched model-forward-compat.ts for claude-sonnet-4-6");
