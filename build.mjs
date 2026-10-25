import { build } from "esbuild";
import { readFileSync } from "fs";

await build({
  entryPoints: ["js/helper.js"],
  bundle: true,
  format: "iife",
  outfile: "build/js/bundle.js",
  plugins: [
    {
      name: "worker-as-text",
      setup(b) {
        b.onLoad({ filter: /rpc_worker\.js$/ }, (args) => ({
          contents: readFileSync(args.path, "utf8"),
          loader: "text",
        }));
      },
    },
  ],
});

const ts = new Date().toLocaleString();
console.log(`[${ts}] BUILD OK -> build/js/bundle.js`);
