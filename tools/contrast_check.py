"""Validate contrast ratios for the Veil design tokens.

Run:  python tools/contrast_check.py
Exit: 0 if every assertion holds, 1 otherwise.

Tokens are parsed from prototype/tokens.css, which is the single source of
truth. Do not duplicate hex values here: if this file and the stylesheet
disagree, this file is the one that is wrong.

WCAG 2.2 thresholds used:
  - body text (< 24px)      >= 4.5:1   (AA normal)
  - large text (>= 24px, or >= 18.66px bold)  >= 3:1  (AA large)
  - non-text UI borders / icons / focus ring  >= 3:1  (AA non-text 1.4.11)
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# ---------------------------------------------------------------- tokens

TOKENS_CSS = Path(__file__).resolve().parent.parent / "prototype" / "tokens.css"

THEME_RE = re.compile(
    r":root\[data-theme='(?P<theme>dark|light)'\]\s*\{(?P<body>[^}]*)\}",
    re.MULTILINE,
)
VAR_RE = re.compile(
    r"--(?P<key>[a-z0-9-]+)\s*:\s*(?P<value>#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))\s*;",
    re.MULTILINE,
)


def load_theme(theme: str) -> dict[str, str]:
    """Read one theme's color tokens straight out of tokens.css."""
    if not TOKENS_CSS.exists():
        raise SystemExit(f"cannot find {TOKENS_CSS}")
    css = TOKENS_CSS.read_text(encoding="utf-8")
    match = next((m for m in THEME_RE.finditer(css) if m.group("theme") == theme), None)
    if match is None:
        raise SystemExit(f"no [data-theme='{theme}'] block found in {TOKENS_CSS.name}")
    return {m.group("key"): m.group("value") for m in VAR_RE.finditer(match.group("body"))}

# (foreground, background, minimum ratio, label)
PAIRS: list[tuple[str, str, str, float, str]] = [
    # --- dark theme
    ("text-primary", "bg", "dark", 4.5, "dark: body text on bg"),
    ("text-primary", "surface", "dark", 4.5, "dark: body text on card"),
    ("text-primary", "surface-raised", "dark", 4.5, "dark: body text on raised card"),
    ("text-secondary", "surface", "dark", 4.5, "dark: secondary text on card"),
    ("text-secondary", "bg", "dark", 4.5, "dark: secondary text on bg"),
    ("text-tertiary", "surface", "dark", 4.5, "dark: tertiary/meta text on card"),
    ("text-tertiary", "bg", "dark", 4.5, "dark: tertiary/meta text on bg"),
    ("on-primary", "primary", "dark", 4.5, "dark: label on primary button"),
    ("on-primary", "primary-pressed", "dark", 4.5, "dark: label on pressed button"),
    ("primary", "surface", "dark", 3.0, "dark: primary as link/icon on card"),
    ("primary", "bg", "dark", 3.0, "dark: primary as link/icon on bg"),
    ("on-accent", "accent", "dark", 4.5, "dark: label on accent button"),
    ("accent", "surface", "dark", 3.0, "dark: accent text on card"),
    ("on-success", "success", "dark", 4.5, "dark: label on success chip"),
    ("success", "surface", "dark", 3.0, "dark: success text on card"),
    ("on-warn", "warn", "dark", 4.5, "dark: label on warn chip"),
    ("warn", "surface", "dark", 3.0, "dark: warn text on card"),
    ("on-danger", "danger", "dark", 4.5, "dark: label on danger button"),
    ("danger", "surface", "dark", 3.0, "dark: danger text/card border"),
    ("seal", "surface", "dark", 3.0, "dark: seal glyph on card"),
    ("seal", "bg", "dark", 3.0, "dark: seal glyph on bg"),
    ("text-primary", "surface-sunken", "dark", 4.5, "dark: body text on sunken well"),
    ("border", "surface", "dark", 1.0, "dark: hairline border (decorative)"),
    ("border", "bg", "dark", 1.0, "dark: hairline border on bg (decorative)"),
    # --- light theme
    ("text-primary", "bg", "light", 4.5, "light: body text on bg"),
    ("text-primary", "surface", "light", 4.5, "light: body text on card"),
    ("text-primary", "surface-sunken", "light", 4.5, "light: body text on sunken well"),
    ("text-secondary", "surface", "light", 4.5, "light: secondary text on card"),
    ("text-secondary", "bg", "light", 4.5, "light: secondary text on bg"),
    ("text-tertiary", "surface", "light", 4.5, "light: tertiary/meta text on card"),
    ("text-tertiary", "bg", "light", 4.5, "light: tertiary/meta text on bg"),
    ("on-primary", "primary", "light", 4.5, "light: label on primary button"),
    ("on-primary", "primary-pressed", "light", 4.5, "light: label on pressed button"),
    ("primary", "surface", "light", 3.0, "light: primary as link/icon on card"),
    ("primary", "bg", "light", 3.0, "light: primary as link/icon on bg"),
    ("on-accent", "accent", "light", 4.5, "light: label on accent button"),
    ("accent", "surface", "light", 3.0, "light: accent text on card"),
    ("on-success", "success", "light", 4.5, "light: label on success chip"),
    ("success", "surface", "light", 3.0, "light: success text on card"),
    ("on-warn", "warn", "light", 4.5, "light: label on warn chip"),
    ("warn", "surface", "light", 3.0, "light: warn text on card"),
    ("on-danger", "danger", "light", 4.5, "light: label on danger button"),
    ("danger", "surface", "light", 3.0, "light: danger text / card border"),
    ("seal", "surface", "light", 3.0, "light: seal glyph on card"),
    ("seal", "bg", "light", 3.0, "light: seal glyph on bg"),
    ("border", "surface", "light", 1.0, "light: hairline border (decorative)"),
    ("border", "bg", "light", 1.0, "light: hairline border on bg (decorative)"),
]


# ---------------------------------------------------------------- math

def _srgb_to_linear(channel: float) -> float:
    return channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4


def relative_luminance(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError(f"bad hex color: {hex_color}")
    r, g, b = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))
    return (
        0.2126 * _srgb_to_linear(r)
        + 0.7152 * _srgb_to_linear(g)
        + 0.0722 * _srgb_to_linear(b)
    )


def contrast_ratio(fg: str, bg: str) -> float:
    l1, l2 = relative_luminance(fg), relative_luminance(bg)
    lighter, darker = max(l1, l2), min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


# ---------------------------------------------------------------- report

def main() -> int:
    themes = {"dark": load_theme("dark"), "light": load_theme("light")}

    missing = sorted(
        {f"{t}:{k}" for t, theme in themes.items() for pair in PAIRS
         for k in (pair[0], pair[1]) if k not in theme}
    )
    if missing:
        print("tokens.css is missing a token that this checker needs:")
        for key in missing:
            print(f"  - {key}")
        return 1

    failures: list[tuple[str, float, float, str]] = []
    rows: list[tuple[str, str, str, float, float, bool]] = []

    for fg_key, bg_key, theme_name, minimum, label in PAIRS:
        theme = themes[theme_name]
        ratio = contrast_ratio(theme[fg_key], theme[bg_key])
        ok = ratio >= minimum
        rows.append((theme_name, fg_key, bg_key, ratio, minimum, ok))
        if not ok:
            failures.append((label, ratio, minimum, theme[fg_key]))

    current = ""
    for theme_name, fg_key, bg_key, ratio, minimum, ok in rows:
        if theme_name != current:
            current = theme_name
            print(f"\n{theme_name.upper()}")
            print("-" * 74)
            print(f"{'foreground':<16}{'background':<18}{'ratio':>7}{'min':>7}   ")
        flag = "PASS" if ok else "FAIL"
        print(f"{fg_key:<16}{bg_key:<18}{ratio:>6.2f}:1{minimum:>6.1f}   {flag}")

    print()
    if failures:
        print(f"{len(failures)} FAILURE(S):")
        for label, ratio, minimum, color in failures:
            print(f"  - {label}: {ratio:.2f}:1 < {minimum:.1f}:1  ({color})")
        return 1

    print(f"All {len(rows)} token pairs satisfy WCAG 2.2 targets.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
