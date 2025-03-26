// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import progress from 'rollup-plugin-progress';
import packageJson from "./package.json" assert { type: "json" };
import simpleGit from "simple-git";

export default {
  input: 'src/main.ts',
  output: {
    name: "Wormhole",
    file: '../Live/Wormhole/Stable/bundle.js',
    format: 'iife',
    sourcemap: true,
		banner: `// Wormhole
if (typeof window.ImportBondageCollege !== "function") {
  alert("Club not detected! Please only use this while you have Club open!");
  throw "Dependency not met";
}
if (window.Wormhole_Loaded !== undefined) {
  alert("Wormhole is already detected in current window. To reload, please refresh the window.");
  throw "Already loaded";
}
window.Wormhole_Loaded = false;
console.debug("Wormhole: Parse start...");
`,
    intro: async () => {
      // const git = simpleGit();
      // console.log(await git.status());
      let Wormhole_VERSION = packageJson.version;
      // await git.tags((err, tags) => {
      //   if (!!tags.latest) {
      //     console.log('\nUsing tag version: %s\n', tags.latest);
      //     Wormhole_VERSION = tags.latest;
      //   } else {
      //     console.log('\nUnable to determine latest tag: %s\n', tags.latest);
      //   }
      // });
      Wormhole_VERSION = (Wormhole_VERSION.length > 0 && Wormhole_VERSION[0] == 'v') ? Wormhole_VERSION : "v" + Wormhole_VERSION;
      return `const Wormhole_VERSION="${Wormhole_VERSION}";`;
    },
    plugins: [terser({
      mangle: false
    })]
  },
  treeshake: false,
  plugins: [
    progress({ clearLine: true }),
		resolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json", inlineSources: true }),
    commonjs()
  ]
};
