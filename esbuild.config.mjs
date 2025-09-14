// @ts-check
import { build, context } from 'esbuild';

(async () => {

  /** @type {import('esbuild').BuildOptions} */
  const buildOptions = {
    entryPoints: ['./src/Wormhole.ts'],
    outfile: './dist/wormhole.js',
    format: 'iife',
    globalName: 'Wormhole',
    bundle: true,
    sourcemap: true,
    target: ['es2020'],
    loader: {
      '.html': 'text',
      '.css': 'text',
    },
    treeShaking: true,
    keepNames: true,
  };

  await build(buildOptions)
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
})();