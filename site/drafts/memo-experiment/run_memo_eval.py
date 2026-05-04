#!/usr/bin/env python3
"""
MeMo minimal-reconstruction validation (Disposition Q4).

Tests whether a ~50-word "name your reasoning strategy" prefix matches
the full ~300-word MeMo prefix on StrategyQA yes/no questions.

Conditions:
  A — baseline (direct query, no prefix)
  B — minimal reconstruction (~50 words)
  C — full MeMo prefix (~300 words, from the paper)

Uses `claude -p --model <model>` for LLM calls (same pattern as
pa/threads/0001-run-experiment.lua).

Usage:
  python run_memo_eval.py
  python run_memo_eval.py --model sonnet --runs 3
  python run_memo_eval.py --dry-run
"""

import argparse
import json
import subprocess
import time
import re
from pathlib import Path
from datetime import datetime, timezone

# --- StrategyQA questions (public dev set, multi-hop yes/no) ---

QUESTIONS = [
    {"q": "Could a llama birth twice during War in Vietnam (1955-1975)?", "gold": "yes"},
    {"q": "Would a pear sink in water?", "gold": "no"},
    {"q": "Is it common to see frost during some college commencements?", "gold": "yes"},
    {"q": "Could the members of The Police perform as a quartet?", "gold": "no"},
    {"q": "Can a mass of crickets be heard from space?", "gold": "no"},
    {"q": "Were there WWII battles in the Mediterranean?", "gold": "yes"},
    {"q": "Is the Atlantic Ocean big enough to fit all of Russia?", "gold": "yes"},
    {"q": "Does the human dsygote have more chromosomes than a cat?", "gold": "yes"},
    {"q": "Would a vegetarian enjoy a traditional Reuben sandwich?", "gold": "no"},
    {"q": "Did the 40th president of the United States serve two terms?", "gold": "yes"},
    {"q": "Are more people today related to Genghis Khan than Julius Caesar?", "gold": "yes"},
    {"q": "Could Plato have known about the Americas?", "gold": "no"},
    {"q": "Is a Boeing 747 wider than a basketball court is long?", "gold": "no"},
    {"q": "Can a mass of humanity theoretically fit inside the Grand Canyon?", "gold": "yes"},
    {"q": "Would a dog respond to a silent dog whistle?", "gold": "yes"},
    {"q": "Was Mother Teresa alive when the Berlin Wall fell?", "gold": "yes"},
    {"q": "Could an average person eat a mass of cotton candy matching their body weight?", "gold": "yes"},
    {"q": "Would a moose fit inside a Mini Cooper?", "gold": "no"},
    {"q": "Did the Roman Empire exist at the same time as the Han Dynasty?", "gold": "yes"},
    {"q": "Is the Great Wall of China longer than the distance from New York to Los Angeles?", "gold": "yes"},
]

# --- Condition prefixes ---

CONDITION_BASELINE = ""  # no prefix, just the question

CONDITION_MINIMAL = (
    "Before answering, name the type of reasoning this problem requires "
    "and why. Then solve step by step.\n\n"
    "Example format:\n"
    "Reasoning type: [type] — [brief why]\n"
    "Steps: ...\n"
    "Answer: yes/no\n\n"
)

CONDITION_FULL_MEMO = (
    "When solving problems, you should leverage mental models from various "
    "disciplines to approach questions from multiple angles. A mental model "
    "is a cognitive framework from a specific field — like first principles "
    "thinking, probabilistic reasoning, or cause-and-effect analysis — that "
    "helps structure your thinking. Don't rely on a single model; use the "
    "one most appropriate to the problem, or combine several. Think of these "
    "as a latticework of models that integrate knowledge into theory rather "
    "than isolated facts.\n\n"
    "Here are examples of identifying applicable mental models:\n\n"
    "Problem: At a dance, every 2 minutes a green light turns on, and every "
    "7 minutes a red light turns on. How many times do both lights turn on "
    "in the first hour?\n"
    "Mental Model(s): Step-by-Step Thinking, Reflection — this requires "
    "finding a common pattern (LCM) and counting occurrences systematically.\n\n"
    "Problem: If a charge of 2C is placed 0.5m from a charge of 3C, what is "
    "the electrostatic force?\n"
    "Mental Model(s): First Principles Thinking, Mathematical Reasoning — "
    "apply Coulomb's law directly from its formula.\n\n"
    "Problem: Would a monoamine oxidase inhibitor affect someone who just ate "
    "a candy bar?\n"
    "Mental Model(s): Chemical Knowledge, Cause and Effect — trace the "
    "biochemical pathway from tyramine/phenylethylamine through MAO.\n\n"
    "For each question, first identify applicable mental model(s), then reason "
    "within that framework, then give your answer.\n\n"
)

CONDITIONS = [
    {"key": "baseline", "label": "A — Baseline (no prefix)", "prefix": CONDITION_BASELINE},
    {"key": "minimal", "label": "B — Minimal reconstruction (~50w)", "prefix": CONDITION_MINIMAL},
    {"key": "full_memo", "label": "C — Full MeMo prefix (~300w)", "prefix": CONDITION_FULL_MEMO},
]


def run_claude(prompt: str, model: str) -> tuple[str, float]:
    """Call claude -p, return (stdout, elapsed_seconds)."""
    t0 = time.time()
    r = subprocess.run(
        ["claude", "-p", "--model", model, "--no-session-persistence"],
        input=prompt,
        capture_output=True,
        text=True,
        timeout=120,
    )
    elapsed = time.time() - t0
    if r.returncode != 0:
        raise RuntimeError(f"claude exited {r.returncode}: {r.stderr[:200]}")
    return r.stdout.strip(), elapsed


def extract_answer(response: str) -> str | None:
    """Extract yes/no from LLM response. Returns 'yes', 'no', or None."""
    text = response.lower()
    # Check last line first (most models put final answer there)
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if lines:
        last = lines[-1]
        if re.search(r"\b(yes)\b", last):
            return "yes"
        if re.search(r"\b(no)\b", last):
            return "no"
    # Check for "Answer: yes/no" pattern anywhere
    m = re.search(r"answer[:\s]*(yes|no)\b", text)
    if m:
        return m.group(1)
    # Fallback: first yes/no in the whole response
    m = re.search(r"\b(yes|no)\b", text)
    if m:
        return m.group(1)
    return None


def build_prompt(prefix: str, question: str) -> str:
    """Combine condition prefix with question."""
    suffix = f"Question: {question}\nAnswer yes or no, with brief reasoning."
    if prefix:
        return prefix + suffix
    return suffix


def main():
    parser = argparse.ArgumentParser(description="MeMo minimal-reconstruction eval")
    parser.add_argument("--model", default="haiku", help="Claude model alias")
    parser.add_argument("--runs", type=int, default=1, help="Repeat N times (for variance)")
    parser.add_argument("--dry-run", action="store_true", help="Print prompts, don't run")
    parser.add_argument("--condition", default="all", help="Run one condition or 'all'")
    parser.add_argument("--questions", type=int, default=0, help="Limit to N questions (0=all)")
    args = parser.parse_args()

    questions = QUESTIONS[:args.questions] if args.questions > 0 else QUESTIONS
    conds = CONDITIONS
    if args.condition != "all":
        conds = [c for c in CONDITIONS if c["key"] == args.condition]
        if not conds:
            print(f"Unknown condition: {args.condition}")
            print(f"Available: {', '.join(c['key'] for c in CONDITIONS)}, all")
            return

    out_dir = Path(__file__).parent / "results" / f"strategyqa-{args.model}"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"=== MeMo Eval: StrategyQA ===")
    print(f"Model: {args.model} | Questions: {len(questions)} | "
          f"Conditions: {len(conds)} | Runs: {args.runs}")
    print(f"Total calls: {len(questions) * len(conds) * args.runs}")
    print(f"Output: {out_dir}")
    print()

    if args.dry_run:
        for cond in conds:
            print(f"--- {cond['label']} ---")
            prompt = build_prompt(cond["prefix"], questions[0]["q"])
            print(prompt)
            print(f"  [prefix word count: {len(cond['prefix'].split())}]")
            print()
        return

    all_results = []

    for run_idx in range(args.runs):
        if args.runs > 1:
            print(f"--- Run {run_idx + 1}/{args.runs} ---")

        for cond in conds:
            print(f"  {cond['label']}")
            correct = 0
            total = 0
            cond_results = []

            for i, q in enumerate(questions):
                prompt = build_prompt(cond["prefix"], q["q"])
                try:
                    response, elapsed = run_claude(prompt, args.model)
                    answer = extract_answer(response)
                    is_correct = answer == q["gold"]
                    if is_correct:
                        correct += 1
                    total += 1

                    result = {
                        "question": q["q"],
                        "gold": q["gold"],
                        "predicted": answer,
                        "correct": is_correct,
                        "elapsed": round(elapsed, 2),
                        "response_words": len(response.split()),
                    }
                    cond_results.append(result)

                    mark = "+" if is_correct else "-"
                    print(f"    [{mark}] {i+1}/{len(questions)} "
                          f"(pred={answer}, gold={q['gold']}, {elapsed:.1f}s)")

                except Exception as e:
                    print(f"    [!] {i+1}/{len(questions)} ERROR: {e}")
                    cond_results.append({
                        "question": q["q"],
                        "gold": q["gold"],
                        "predicted": None,
                        "correct": False,
                        "error": str(e),
                    })
                    total += 1

            accuracy = correct / total if total > 0 else 0
            print(f"    => {correct}/{total} = {accuracy:.0%}")
            print()

            all_results.append({
                "condition": cond["key"],
                "label": cond["label"],
                "run": run_idx,
                "correct": correct,
                "total": total,
                "accuracy": round(accuracy, 4),
                "details": cond_results,
            })

    # Summary
    print("=== Summary ===")
    print(f"  {'Condition':<35} {'Accuracy':>10} {'Correct':>10}")
    print(f"  {'-'*35} {'-'*10} {'-'*10}")
    for r in all_results:
        print(f"  {r['label']:<35} {r['accuracy']:>9.0%} "
              f"{r['correct']}/{r['total']:>7}")

    # Save
    summary = {
        "experiment": "memo-strategyqa",
        "model": args.model,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "questions_count": len(questions),
        "runs": args.runs,
        "results": all_results,
    }
    summary_path = out_dir / "summary.json"
    summary_path.write_text(json.dumps(summary, indent=2) + "\n")
    print(f"\nSaved: {summary_path}")


if __name__ == "__main__":
    main()
