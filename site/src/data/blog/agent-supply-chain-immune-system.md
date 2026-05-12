---
author: Björn Roberg, Claude Opus 4.6
pubDatetime: 2026-04-15
title: "Scanners produce reports. Insurance needs witnesses."
slug: agent-attestation-needs-an-expiry
featured: false
draft: false
tags:
  - ecosystem-analysis
  - opinion
  - security
  - agents
  - mcp
  - supply-chain
description: "The AI-supply-chain cohort is already crowded: Invariant, Snyk Agent Scan, JFrog, Klaimee, a dozen more. They all ship the same artifact, a point-in-time report. That is not what underwriters can price against. The primitive insurance needs is a falsifiable attestation with a TTL that re-verifies on drift. Nobody ships that yet."
kt_mode: knowledge-transforming
---

I started writing this as a wide-open-gap essay. Then I actually looked at the field, and the field is not wide open. Twelve months ago it was. Today the cohort is crowded and most of the obvious wedges are taken:

- **Scanners**: Invariant [mcp-scan](https://invariantlabs.ai/blog/introducing-mcp-scan) (the foundation of Snyk's enterprise product), Cisco mcp-scanner, Enkrypt AI MCP Scan, [Proximity](https://www.helpnetsecurity.com/2025/10/29/proximity-open-source-mcp-security-scanner/), MCP Guardian, [Credence](https://credence.securingthesingularity.com/).
- **Sonatype-shape incumbents**: [Snyk Agent Scan](https://github.com/snyk/agent-scan), [JFrog MCP Registry](https://jfrog.com/ai-catalog/mcp-registry/) with attestation and provenance validation, MintMCP (SOC 2 Type II), Docker in the game.
- **Tool-poisoning / prompt-injection-surface scoring**: named as a category, defended, and commercialized by Invariant, Snyk, [Microsoft DevBlog](https://developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp), SlowMist.
- **Composition / toxic-flow detection**: Snyk Agent Scan and Invariant both explicitly detect cross-tool composition risks. The "threat model lives in the graph" insight is not new; it is shipping.
- **Insurance**: [Klaimee](https://www.ycombinator.com/companies/klaimee) is a YC-backed "insurance for the agentic world" play. CyberArk, QBE, and the cyber-reinsurance press are publishing on agent-privilege underwriting. AIBOM is the emerging standard acronym.

So if you're in this space and thinking "here's a wide-open wedge," stop. It isn't. The field went from zero to ~10 funded entrants in a year, and the Sonatype-shape $50-150M acquisition play is arguably already priced in.

What's still missing is narrower and sharper, and it's what this essay is actually about.

## The artifact every scanner ships is the wrong artifact

Look at what the cohort produces. Every one of them emits a point-in-time report. A scan completed on Tuesday. A provenance bundle signed at publish time. A SOC 2 attestation from last quarter. All useful. None of them are what an underwriter can actually price against.

An underwriter pricing risk on an agent stack needs an artifact with three properties the current crop doesn't have:

1. **It expires.** Drift is continuous. An attestation that claims to still be true six months after the upstream API shifted is a lie, and underwriters price lies as fraud.
2. **It re-verifies against the live target, not against a committed artifact.** Commit-pinned attestations (Credence is the closest shipping example) tell you what was true of the code at publish time. They tell you nothing about whether the live MCP server still behaves the way the recording said it did.
3. **It's falsifiable.** The bundle must be something the live system can *fail* today, not something the publisher asserted yesterday.

The primitive I keep not seeing anyone ship: `Record → Replay → Expire`.

- **Record** a session against the live MCP server or tool primitive: inputs, outputs, side-effect evidence, timestamps. The recording is behavior-derived, not schema-asserted.
- **Replay** that recording as a conformance test against the live target, on demand. Signed verdict: pass, fail, drifted.
- **Expire.** The bundle carries a TTL. Past expiry, it's stale and refuses to be trusted. Re-witness or lose the attestation.

That is the only attestation shape that means anything in a drift-native world. Everything higher up the stack (composition-graph attestation, insurance-grade SBOMs, risk pricing) is downstream of having this primitive in the commons. Scanners are the wrong layer. They answer "is this code safe to publish?" The question that matters is "is this deployment still behaving the way the evidence said it did?"

If someone ships this as boring open-source infrastructure (permissive license, standard bundle format, locally runnable), they make every other product in this space more valuable and capture no value themselves. That's the right move for this layer. Stage 1 is infrastructure, not business.

## The liability question is the actual open question

Assume the witness primitive exists. Now the interesting fork.

Smart-contract audit firms refuse liability. Their contracts are explicit: "we attested this code; we are not liable if it gets exploited." Crypto buyers tolerate that because crypto is the wild west and there's no insurance market to push back. Regulated buyers (the ones with the money) won't tolerate it. They need someone with a balance sheet on the hook, because that's how compliance works.

Which means there are two genuinely different businesses hiding inside the same product surface:

**(a) The substrate carries the insurance.** You don't just attest workflows, you underwrite them. You become a *managed general agent* for cyber-insurance carriers, pricing risk on agent stacks the way auto insurers price risk on drivers. Insurance is structurally a moat (regulatory capital requirements, actuarial corpus that compounds with claims data, distribution relationships that take years to build). Klaimee is the only named attempt I've found, and it's very early. Nobody has done this for code at scale. The first who does owns a category.

**(b) Stay in the audit lane.** Limit scope to attestation that auditors will accept. Let the buyer's existing cyber-insurance policy carry the risk. Smaller business, faster to build, closer to the OpenZeppelin shape. Acquirable. This is where the current cohort sits today, mostly by default rather than by choice.

I genuinely do not know which of these resolves better. I think it is the most important strategic question in the space, and nobody in the cohort has picked a side on the record. Path (b) is buildable and acquirable in three years. Path (a) is much bigger, much harder, and probably requires an insurance-industry partner from day one. They are not the same company.

## The kill-shot: maybe pre-publish verification is the wrong category entirely

This is the angle almost no one in the field is arguing against themselves about, and it is the one worth taking most seriously.

The whole "attest before you ship" frame inherits from code-signing. Code-signing lost, or at least got eclipsed, in every category that mattered:

- WebAssembly sandboxing eclipsed code-signing for browser plugins.
- seccomp/BPF eclipsed signature-matching for runtime defense.
- Cloud security is least-privilege IAM plus audit logs plus cyber liability insurance, not signed binaries.

The parallel claim for agent stacks: pre-publish verification of LLM-composed workflows could lose entirely to *runtime sandboxing + capability tokens + cyber insurance*. Isolate at execution. Constrain capabilities at invocation. Price the residual risk. Don't try to prove safety before the run; prove containment during the run and insure the tail.

If that is the right category, then the whole scanner cohort is building the antivirus industry of agent security, and the companies that win are the ones building the IAM + audit-log + insurance triad for agents instead. The witness primitive still matters there (insurance still needs evidence), but the pre-publish attestation layer evaporates.

The cheapest risk to retire in this space is whether the entire shape is wrong, and it is about a week of research. Every founder reading this who is building pre-publish verification should spend that week before raising the next round.

## What I'm doing about this

Not building it. Same reason as before: I have an active portfolio of things I'm actually shipping, and none of them benefit from me starting an agent-attestation company. This essay exists so the idea gets timestamped and the people who *should* build it can find each other faster.

What would be useful, specifically:

- If you're shipping an MCP scanner and haven't thought about TTL-bound witnesses, think about it. Point-in-time reports are a local maximum.
- If you're at Klaimee or an adjacent underwriter, the missing input for your pricing model is a falsifiable attestation that re-verifies on drift. Current AIBOMs don't give you that.
- If you have a strong view on the path-(a)-vs-path-(b) liability question, I want to know more than I want to know anything else in this space.
- If you've spent a week on the kill-shot (runtime-sandbox + capability + insurance) and have a reason pre-publish verification survives anyway, I want that analysis.

If pre-publish verification does survive, the 30-year shape of the institution is something like Underwriters Laboratories: the entity whose stamp procurement officers and auditors recognize, whose recognition has compounded across decades of deployments and case law. That is the big prize. It is probably not available to anyone building the scanner cohort today, because UL took a hundred years and that wasn't a mistake.

If pre-publish verification doesn't survive, the 30-year shape is whoever writes the cyber-insurance policies. That's a different company, a different founder, and a different game.

Either way, the next two years resolve which game is being played. Build accordingly.
