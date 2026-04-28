#!/usr/bin/env python3
"""
SDLC Automation Pipeline
Automates the full Software Development Lifecycle using role-based AI prompts.
Supports: OpenAI | Gemini | Groq
Modes: Full Stack (pauses at UX for images) | Backend Only (zero pauses)

FOLDER STRUCTURE:
  ./roles/          ← all role .md files
  ./inputs/         ← requirements.txt
  ./inputs/designs/ ← OPTIONAL: multiple design images (one per screen)
                      Naming: 01-login-desktop.png, 02-dashboard-mobile.png
  ./outputs/        ← auto-created

QUICK START:
  pip install google-generativeai openai groq pillow
  Set API key below or as env variable
  python sdlc_pipeline.py
  python sdlc_pipeline.py --backend-only
  python sdlc_pipeline.py --provider groq --backend-only
"""

import os
import sys
import time
import base64
import argparse
from pathlib import Path
from datetime import datetime


# ══════════════════════════════════════════════════════════════════════
#  CONFIGURATION
# ══════════════════════════════════════════════════════════════════════

CONFIG = {
    "provider":        "gemini",
    "openai_api_key":  os.getenv("OPENAI_API_KEY",  "YOUR_OPENAI_API_KEY"),
    "gemini_api_key":  os.getenv("GEMINI_API_KEY",  "YOUR_GEMINI_API_KEY"),
    "groq_api_key":    os.getenv("GROQ_API_KEY",    "YOUR_GROQ_API_KEY"),
    "openai_model":    "gpt-4o",
    "gemini_model":    "gemini-2.0-flash",
    "groq_model":      "llama-3.3-70b-versatile",
    "roles_dir":       "./roles",
    "outputs_dir":     "./outputs",
    "inputs_dir":      "./inputs",
    "backend_only":    False,
    "codegen_components": [
        "project scaffold — root folder, package.json files for backend and frontend",
        ".env.example for backend and frontend listing all environment variables",
        "complete database schema and all model/entity files",
        "database connection config, app constants, and utility files",
        "all middleware files — auth (JWT protect + adminOnly), input validation (Joi), "
        "rate limiting (express-rate-limit), mongo sanitize + xss-clean, global error handler",
        "all service layer files with complete business logic — ownership checks first in every mutation",
        "all API route handler files based on eng-output.md API contracts",
        "main app entry point wiring all middleware and routes in correct order",
        "all frontend context files (AuthContext) and custom hooks (useAuth, useTasks)",
        "all frontend components — every component from frontend-structure.md",
        "all frontend pages — every screen from ux-output.md in user flow order",
        "frontend App.jsx (routes) and main.jsx (entry point) and index.html",
        "unit test files for all backend service functions from qa-output.md",
        "API integration test files for all endpoints from qa-output.md Section 6 and 9",
        "security test files for all TC-IDs in qa-output.md Section 9 (auth, BOLA, injection, rate limiting)",
        "Dockerfile for backend and frontend (only if Docker requested)",
        "GitHub Actions CI/CD pipeline config",
        "README.md with complete setup instructions including Tailwind v4 frontend setup",
        "codegen-output.md — generation log of all files created",
    ],
}


# ══════════════════════════════════════════════════════════════════════
#  TERMINAL HELPERS
# ══════════════════════════════════════════════════════════════════════

BLUE=\'\033[94m\'; GREEN=\'\033[92m\'; YELLOW=\'\033[93m\'
RED=\'\033[91m\'; BOLD=\'\033[1m\'; CYAN=\'\033[96m\'; RESET=\'\033[0m\'

def log(msg, color=RESET): print(f"{color}{msg}{RESET}")
def ok(msg):    log(f"  [OK]  {msg}", GREEN)
def info(msg):  log(f"  [..]  {msg}", BLUE)
def warn(msg):  log(f"  [!!]  {msg}", YELLOW)
def err(msg):   log(f"  [XX]  {msg}", RED)
def header(msg):log(f"\n{\'=\'*62}\n  {msg}\n{\'=\'*62}", BOLD)
def step(n,t,m):log(f"\n  [{n}/{t}]  {m}", CYAN)


# ══════════════════════════════════════════════════════════════════════
#  FILE UTILITIES
# ══════════════════════════════════════════════════════════════════════

def read_file(path):
    p = Path(path)
    if not p.exists():
        err(f"File not found: {path}"); sys.exit(1)
    return p.read_text(encoding="utf-8")

def save_file(path, content):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    ok(f"Saved  →  {path}")

def read_image_b64(path):
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    ext = Path(path).suffix.lower().lstrip(".")
    mime = "image/jpeg" if ext in ("jpg", "jpeg") else f"image/{ext}"
    return data, mime


# ══════════════════════════════════════════════════════════════════════
#  IMAGE DISCOVERY — HANDLES SINGLE AND MULTIPLE IMAGES
# ══════════════════════════════════════════════════════════════════════

IMAGE_EXTS = ("*.png", "*.jpg", "*.jpeg", "*.webp")

def find_all_images(inputs_dir):
    """
    Returns a list of image dicts sorted by filename.
    Checks ./inputs/designs/ first (multi-image workflow).
    Falls back to ./inputs/ (single image workflow).

    Each dict:
      { "path": str, "filename": str, "screen_hint": str, "viewport_hint": str }

    ⚠️  [IMAGE MISSING] flags are printed when screens from ux-output
    have no corresponding image — handled during ux-role run.
    """
    designs_dir = Path(inputs_dir) / "designs"

    # ── Multi-image workflow ─────────────────────────────────────────
    if designs_dir.exists():
        images = []
        for ext in IMAGE_EXTS:
            images.extend(designs_dir.glob(ext))
        images = sorted(images, key=lambda p: p.name)

        if images:
            log(f"\n  📁  Found designs/ folder with {len(images)} image(s):", CYAN)
            result = []
            for img in images:
                name = img.stem  # e.g. "03-dashboard-mobile"
                parts = name.split("-")
                viewport = "desktop"
                for p in parts:
                    if p.lower() in ("mobile", "tablet", "desktop"):
                        viewport = p.lower()
                screen = name.replace(parts[0] + "-", "").replace(f"-{viewport}", "") if len(parts) > 1 else name
                log(f"       {img.name}  →  screen: {screen}  viewport: {viewport}", BLUE)
                result.append({
                    "path":         str(img),
                    "filename":     img.name,
                    "screen_hint":  screen,
                    "viewport_hint": viewport,
                })
            return result

    # ── Single image fallback ────────────────────────────────────────
    for ext in IMAGE_EXTS:
        matches = list(Path(inputs_dir).glob(ext))
        if matches:
            img = sorted(matches)[0]
            log(f"  🖼   Single image found: {img.name}", CYAN)
            return [{"path": str(img), "filename": img.name,
                     "screen_hint": "all screens", "viewport_hint": "desktop"}]

    return []  # No images found


def build_image_context_note(images):
    """
    Returns a markdown block describing available images.
    This is injected into the UX role user message.
    """
    if not images:
        return """
## ⚠️  [IMAGE MISSING — ALL SCREENS]
No design images were provided.
For every screen, add the flag: ⚠️  [IMAGE MISSING — NEEDED BEFORE CODE GENERATION]
Code-gen-role will generate UI using design tokens and existing screen patterns.
"""
    lines = ["## Design Images Provided\n",
             "The following images are available. Map each to the correct screen.\n",
             "| Filename | Screen Hint | Viewport |",
             "|----------|------------|----------|"]
    for img in images:
        lines.append(f"| {img[\'filename\']} | {img[\'screen_hint\']} | {img[\'viewport_hint\']} |")
    lines.append("")
    lines.append("These filenames must appear in ux-output.md Section 1 (Document Metadata) image table.")
    lines.append("Reference each image filename in the relevant Screen Specification.")
    return "\n".join(lines)


# ══════════════════════════════════════════════════════════════════════
#  AI PROVIDERS
# ══════════════════════════════════════════════════════════════════════

def call_openai(system_prompt, user_message, images=None):
    from openai import OpenAI
    client = OpenAI(api_key=CONFIG["openai_api_key"])
    content = []
    if images:
        content.append({"type": "text", "text": user_message})
        for img in images:
            b64, mime = read_image_b64(img["path"])
            content.append({"type": "image_url",
                             "image_url": {"url": f"data:{mime};base64,{b64}"}})
    else:
        content = user_message
    response = client.chat.completions.create(
        model=CONFIG["openai_model"],
        messages=[{"role": "system", "content": system_prompt},
                  {"role": "user",   "content": content}],
        max_tokens=8000,
    )
    return response.choices[0].message.content


def call_gemini(system_prompt, user_message, images=None):
    import google.generativeai as genai
    import PIL.Image
    genai.configure(api_key=CONFIG["gemini_api_key"])
    model = genai.GenerativeModel(
        model_name=CONFIG["gemini_model"],
        system_instruction=system_prompt,
    )
    if images:
        parts = [user_message]
        for img in images:
            parts.append(PIL.Image.open(img["path"]))
        response = model.generate_content(parts)
    else:
        response = model.generate_content(user_message)
    return response.text


def call_groq(system_prompt, user_message, images=None):
    from groq import Groq
    if images:
        warn("Groq does not support image input — proceeding without images.")
    client = Groq(api_key=CONFIG["groq_api_key"])
    response = client.chat.completions.create(
        model=CONFIG["groq_model"],
        messages=[{"role": "system", "content": system_prompt},
                  {"role": "user",   "content": user_message}],
        max_tokens=8000,
    )
    return response.choices[0].message.content


def call_ai(system_prompt, user_message, images=None):
    provider = CONFIG["provider"]
    img_count = len(images) if images else 0
    info(f"Calling {provider.upper()} ... ({img_count} image(s) attached)")
    if provider == "openai": return call_openai(system_prompt, user_message, images)
    if provider == "gemini": return call_gemini(system_prompt, user_message, images)
    if provider == "groq":   return call_groq(system_prompt,   user_message, images)
    err(f"Unknown provider: {provider}"); sys.exit(1)


# ══════════════════════════════════════════════════════════════════════
#  ROLE RUNNER
# ══════════════════════════════════════════════════════════════════════

def run_role(role_name, role_file, inputs, output_file, images=None, extra_context=""):
    log(f"\n  Running  →  {role_name.upper()}", BOLD)
    system_prompt = read_file(role_file)
    parts = [
        f"# INSTRUCTION\n"
        f"You are acting as the {role_name}.\n"
        f"Execute your full role. Be thorough, structured, and detailed.\n"
    ]
    if extra_context:
        parts.append(f"\n---\n## ADDITIONAL CONTEXT\n\n{extra_context}")
    for label, path in inputs.items():
        if path and Path(path).exists():
            parts.append(f"\n---\n## INPUT: {label}\n\n{read_file(path)}")
        else:
            warn(f"Input missing, skipping: {label}")
    parts.append(
        "\n---\n## YOUR OUTPUT\n"
        "Generate your complete output now following the exact structure "
        "defined in your role file. Do not omit any sections."
    )
    result = call_ai(system_prompt, "\n".join(parts), images)
    save_file(output_file, result)
    return result


# ══════════════════════════════════════════════════════════════════════
#  CODE GENERATION — COMPONENT BY COMPONENT
# ══════════════════════════════════════════════════════════════════════

def run_codegen_component(component, inputs, output_dir, index, images=None):
    system_prompt = read_file(f"{CONFIG[\'roles_dir\']}/code-gen-role.md")
    parts = [
        "# CODE GENERATION REQUEST\n",
        f"Generate ONLY this component:\n**{component}**\n\n",
        "Rules:\n",
        "- Do not generate any other component\n",
        "- Provide complete, production-ready, immediately runnable code\n",
        "- Use Tailwind v4 for all frontend styling (@import \'tailwindcss\' in index.css, no tailwind.config.js)\n",
        "- Use v4 class names: bg-linear-to-r (not bg-gradient-to-r), shrink-0 (not flex-shrink-0)\n",
        "- SECURITY: ownership check must be the FIRST operation in every service mutation\n",
        "- SECURITY: never pass req.body directly to DB — always destructure first\n",
        "- SECURITY: userId always from req.user (JWT) — never from req.body\n",
        "- IDEMPOTENCY: catch duplicate key errors (code 11000) and return 409\n",
        "- Tag every security check: // SECURITY [type]: description\n",
        "- Tag every business rule: // RULE [BR-ID]: description\n",
        "- Tag every edge case: // EDGE CASE [TC-ID]: description\n",
    ]
    for label, path in inputs.items():
        if path and Path(path).exists():
            parts.append(f"\n---\n## {label}\n\n{read_file(path)}")
    result = call_ai(system_prompt, "\n".join(parts), images)
    safe = component[:50].replace(" ", "_").replace("/", "-").replace("*", "")
    save_file(f"{output_dir}/component_{index:02d}_{safe}.md", result)
    return result


# ══════════════════════════════════════════════════════════════════════
#  MAIN PIPELINE
# ══════════════════════════════════════════════════════════════════════

def run_pipeline():
    header("SDLC AUTOMATION PIPELINE")
    log(f"  Provider  :  {CONFIG[\'provider\'].upper()}", CYAN)
    log(f"  Mode      :  {\'Backend Only\' if CONFIG[\'backend_only\'] else \'Full Stack\'}", CYAN)
    log(f"  Started   :  {datetime.now().strftime(\' %Y-%m-%d  %H:%M:%S\')}", CYAN)

    rd  = CONFIG["roles_dir"]
    od  = CONFIG["outputs_dir"]
    ind = CONFIG["inputs_dir"]

    Path(od).mkdir(parents=True, exist_ok=True)
    Path(ind).mkdir(parents=True, exist_ok=True)

    req = f"{ind}/requirements.txt"
    if not Path(req).exists():
        err(f"requirements.txt not found at: {req}")
        err("Create it and describe your project requirements, then re-run.")
        sys.exit(1)

    pm_out     = f"{od}/pm-output.md"
    ba_out     = f"{od}/ba-output.md"
    ux_out     = f"{od}/ux-output.md"
    eng_out    = f"{od}/eng-output.md"
    qa_out     = f"{od}/qa-output.md"
    devops_out = f"{od}/devops-output.md"
    code_dir   = f"{od}/code-generation"

    total_steps = 6 if CONFIG["backend_only"] else 7
    cur = 0

    # ──────────────────────────────────────────────────────────────
    header("PHASE 1 — PLANNING DOCUMENTS")
    # ──────────────────────────────────────────────────────────────

    cur += 1
    step(cur, total_steps, "Product Manager — PRD (pm-output.md)")
    run_role("Product Manager", f"{rd}/pm-role.md",
             {"requirements.txt": req}, pm_out)

    cur += 1
    step(cur, total_steps, "Business Analyst — FSD (ba-output.md)")
    run_role("Business Analyst", f"{rd}/ba-role.md",
             {"pm-output.md": pm_out}, ba_out)

    # ── UX Role with image handling ──────────────────────────────
    if not CONFIG["backend_only"]:
        cur += 1
        step(cur, total_steps, "UX Designer — Design Spec (ux-output.md)")

        images = find_all_images(ind)

        if not images:
            log("\n" + "-"*62, YELLOW)
            warn("PIPELINE PAUSED — No design images found")
            log("", RESET)
            log("  Option A: Drop images into  ./inputs/designs/", CYAN)
            log("            Naming convention: 01-login-desktop.png", CYAN)
            log("                               02-dashboard-mobile.png", CYAN)
            log("", RESET)
            log("  Option B: Drop a single image into  ./inputs/", CYAN)
            log("", RESET)
            log("  Option C: Press ENTER to skip images (UX output will have", CYAN)
            log("            [IMAGE MISSING] flags — UI will be AI-generated)", CYAN)
            log("-"*62 + "\n", YELLOW)
            input("  Press ENTER when ready (or ENTER to skip): ")
            images = find_all_images(ind)

        if not images:
            warn("No images provided — ux-output.md will contain [IMAGE MISSING] flags")
            warn("code-gen-role will generate UI using design tokens only")

        image_context = build_image_context_note(images)

        run_role(
            "UX Designer", f"{rd}/ux-role.md",
            {"ba-output.md": ba_out},
            ux_out,
            images=images if images else None,
            extra_context=image_context,
        )

    # ── ENG ───────────────────────────────────────────────────────
    cur += 1
    step(cur, total_steps, "Engineer / Architect — TDD (eng-output.md)")
    eng_inputs = {"ba-output.md": ba_out, "pm-output.md": pm_out}
    if Path(ux_out).exists():
        eng_inputs["ux-output.md"] = ux_out
    run_role("Engineer / Architect", f"{rd}/eng-role.md", eng_inputs, eng_out)

    # ── QA ───────────────────────────────────────────────────────
    cur += 1
    step(cur, total_steps, "QA Engineer — Test Plan (qa-output.md)")
    qa_inputs = {"ba-output.md": ba_out, "eng-output.md": eng_out}
    if Path(ux_out).exists():
        qa_inputs["ux-output.md"] = ux_out
    run_role("QA Engineer", f"{rd}/qa-role.md", qa_inputs, qa_out)

    # ── DEVOPS ───────────────────────────────────────────────────
    cur += 1
    step(cur, total_steps, "DevOps Engineer — Infra Design (devops-output.md)")
    run_role("DevOps Engineer", f"{rd}/devops-role.md",
             {"eng-output.md": eng_out, "qa-output.md": qa_out, "pm-output.md": pm_out},
             devops_out)

    # ──────────────────────────────────────────────────────────────
    header("PHASE 2 — CODE GENERATION")
    # ──────────────────────────────────────────────────────────────

    cur += 1
    step(cur, total_steps, "Code Generator — All Components")
    Path(code_dir).mkdir(parents=True, exist_ok=True)

    # Pass design images to code-gen for frontend components
    codegen_images = find_all_images(ind) if not CONFIG["backend_only"] else None

    cg_inputs = {
        "eng-output.md":    eng_out,
        "ba-output.md":     ba_out,
        "qa-output.md":     qa_out,
        "devops-output.md": devops_out,
    }
    if Path(ux_out).exists():
        cg_inputs["ux-output.md"] = ux_out

    total_c = len(CONFIG["codegen_components"])
    for idx, component in enumerate(CONFIG["codegen_components"], start=1):
        log(f"\n  [{idx}/{total_c}]  {component[:70]}", CYAN)
        try:
            # Only pass images for frontend-related components
            is_frontend = any(kw in component.lower()
                              for kw in ["frontend", "component", "page", "context", "hook", "jsx"])
            imgs = codegen_images if (is_frontend and codegen_images) else None
            run_codegen_component(component, cg_inputs, code_dir, idx, imgs)
            time.sleep(1)
        except Exception as exc:
            err(f"Component failed: {component[:50]}")
            err(str(exc))
            warn("Skipping — continuing with next component...")

    # ──────────────────────────────────────────────────────────────
    header("PIPELINE COMPLETE")
    # ──────────────────────────────────────────────────────────────

    log("\n  Generated Files:\n", BOLD)
    summary = [
        ("pm-output.md",     pm_out),
        ("ba-output.md",     ba_out),
        ("ux-output.md",     ux_out),
        ("eng-output.md",    eng_out),
        ("qa-output.md",     qa_out),
        ("devops-output.md", devops_out),
        ("code-generation/", code_dir),
    ]
    for label, path in summary:
        exists = Path(path).exists()
        mark  = "OK  " if exists else "----"
        color = GREEN if exists else YELLOW
        log(f"    [{mark}]  {label}", color)

    log(f"\n  Finished  :  {datetime.now().strftime(\' %Y-%m-%d  %H:%M:%S\')}\n", CYAN)
    ok("All done! Check outputs/ folder.")


# ══════════════════════════════════════════════════════════════════════
#  CLI
# ══════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="SDLC Automation Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python sdlc_pipeline.py                          Full stack (pauses for images)
  python sdlc_pipeline.py --backend-only           Backend only, zero pauses
  python sdlc_pipeline.py --provider openai        Use OpenAI GPT-4o
  python sdlc_pipeline.py --provider groq          Use Groq Llama (fastest)

Multi-image setup:
  Drop all design images into ./inputs/designs/
  Name them:  01-login-desktop.png
              02-dashboard-desktop.png
              03-dashboard-mobile.png
  Pipeline will pass ALL images to UX role automatically.

Install:
  pip install google-generativeai openai groq pillow
        """
    )
    parser.add_argument("--backend-only", action="store_true")
    parser.add_argument("--provider",     type=str)
    parser.add_argument("--roles",        type=str)
    parser.add_argument("--outputs",      type=str)
    parser.add_argument("--inputs",       type=str)
    args = parser.parse_args()

    if args.backend_only: CONFIG["backend_only"] = True
    if args.provider:     CONFIG["provider"]     = args.provider
    if args.roles:        CONFIG["roles_dir"]    = args.roles
    if args.outputs:      CONFIG["outputs_dir"]  = args.outputs
    if args.inputs:       CONFIG["inputs_dir"]   = args.inputs

    run_pipeline()

if __name__ == "__main__":
    main()
