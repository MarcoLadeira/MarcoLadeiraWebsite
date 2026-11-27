#!/usr/bin/env python3
"""Convert real project screenshots into responsive WebP files + a size manifest.

Sources are local clones of the project repositories (paths in SOURCES). Run from
the repo root:  python3 scripts/prepare-media.py
Output: assets/img/work/<project>/<name>-<width>.webp and src/data/media.json
"""
import json, os, sys
from PIL import Image

HOME = os.environ.get("SOURCES_HOME", "/home/claude")
VESTA = f"{HOME}/vesta/vesta/assets/web/__tests__/e2e"
ONE = f"{HOME}/one/docs/screenshots"
STP = f"{HOME}/marcoladeira/savetheplanet/docs/screenshots"
WORK = f"{HOME}/work"

SOURCES = {
    "vesta/chat": f"{VESTA}/agent-workspace-visual.spec.js-snapshots/balanced-agent-workspace.png",
    "vesta/chat-dark": f"{VESTA}/theme.spec.js-snapshots/dark-chat-finished-turn.png",
    "vesta/usage": f"{VESTA}/settings-gallery.spec.js-snapshots/settings-desktop-usage.png",
    "vesta/safety": f"{VESTA}/settings-gallery.spec.js-snapshots/settings-desktop-safety-privacy.png",
    "oddlings/today": f"{WORK}/odd-today.png",
    "oddlings/run": f"{WORK}/odd-run-desktop.png",
    "oddlings/run-phone": f"{WORK}/odd-run-phone.png",
    "oddlings/meet": f"{WORK}/odd-meet-desktop.png",
    "savetheplanet/dashboard": f"{STP}/pr40/1-dashboard.png",
    "savetheplanet/charging": f"{STP}/charging-after.png",
    "savetheplanet/impact": f"{STP}/impact/impact-simulated.png",
}
WIDTHS = [640, 1080, 1600]

def main():
    root = os.getcwd()
    manifest = {}
    for key, src in SOURCES.items():
        if not os.path.exists(src):
            print("missing", src, file=sys.stderr); continue
        im = Image.open(src).convert("RGB")
        w, h = im.size
        project, name = key.split("/")
        out_dir = os.path.join(root, "assets/img/work", project)
        os.makedirs(out_dir, exist_ok=True)
        variants = []
        for tw in [x for x in WIDTHS if x < w] + [min(w, WIDTHS[-1])]:
            if any(v["w"] == tw for v in variants): continue
            th = round(h * tw / w)
            fn = f"{name}-{tw}.webp"
            im.resize((tw, th), Image.LANCZOS).save(os.path.join(out_dir, fn), "WEBP", quality=82, method=6)
            variants.append({"w": tw, "h": th, "src": f"assets/img/work/{project}/{fn}"})
        manifest[key] = {"w": w, "h": h, "variants": variants}
        print(key, w, h, [v["w"] for v in variants])
    with open(os.path.join(root, "src/data/media.json"), "w") as f:
        json.dump(manifest, f, indent=1)

if __name__ == "__main__":
    main()
