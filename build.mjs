// Build script: bundles src/ (JSX) into a single self-contained index.html
// so the app still works by double-clicking the file or via GitHub Pages.
//
//   npm run build   -> one-off build
//   npm run dev     -> rebuild on every change in src/
import * as esbuild from "esbuild";
import { readFile, writeFile } from "node:fs/promises";

const watch = process.argv.includes("--watch");

const writeHtml = {
  name: "write-html",
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length) return;
      const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
      const template = await readFile("src/index.html", "utf8");
      const html = template.replace("<!-- APP_SCRIPT -->", () => `<script>\n${js}</script>`);
      await writeFile("index.html", html);
      console.log(`[${new Date().toLocaleTimeString()}] index.html written (${(html.length / 1024).toFixed(0)} kB)`);
    });
  },
};

const options = {
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2019",
  jsx: "automatic",
  write: false,
  legalComments: "eof",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [writeHtml],
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("Watching src/ for changes…");
} else {
  await esbuild.build(options);
}
