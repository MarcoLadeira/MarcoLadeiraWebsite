#!/usr/bin/env python3
"""Render the CV PDF, social preview images and PNG icons from the build output.

Run after `node src/build.mjs`:  python3 scripts/render-assets.py
Needs Python Playwright and a Chromium/Chrome binary (CHROME env var, default /usr/bin/google-chrome).
"""
import asyncio, os, shutil
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
GEN = ROOT / ".generated"
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])

        # CV → PDF (A4, one page)
        page = await browser.new_page()
        await page.goto((GEN / "cv.html").as_uri())
        await page.wait_for_timeout(300)
        out = ROOT / "assets" / "marco-ladeira-cv.pdf"
        await page.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
        shutil.copyfile(out, ROOT / "assets" / "cv.pdf")  # keep the old download URL working
        await page.close()

        # Social images 1200×630
        og_dir = ROOT / "assets" / "img" / "og"
        og_dir.mkdir(parents=True, exist_ok=True)
        ctx = await browser.new_context(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        page = await ctx.new_page()
        for f in sorted(GEN.glob("og-*.html")):
            await page.goto(f.as_uri())
            await page.wait_for_timeout(200)
            name = f.stem.replace("og-", "")
            await page.screenshot(path=str(og_dir / f"{name}.png"))
        await ctx.close()

        # PNG icons from favicon.svg
        svg = (ROOT / "favicon.svg").read_text()
        for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
            ctx = await browser.new_context(viewport={"width": size, "height": size}, color_scheme="light")
            page = await ctx.new_page()
            await page.set_content(f'<html><body style="margin:0;background:transparent">{svg.replace("<svg ", f"<svg width={size} height={size} ", 1)}</body></html>')
            await page.screenshot(path=str(ROOT / name), omit_background=True)
            await ctx.close()

        await browser.close()


asyncio.run(main())
