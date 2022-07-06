import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter(),
    vite: {
      resolve: {
        alias: {
          '@pages': path.resolve('./src/pages'),
          '@comp': path.resolve('./src/components'),
          '@lib': path.resolve('./src/lib'),
        },
      },
      optimizeDeps: {
        include: ['papaparse'],
      },
    },
  },
};

export default config;
