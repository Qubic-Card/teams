import preprocess from 'svelte-preprocess';
import netlify from '@sveltejs/adapter-netlify';
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
    adapter: netlify(),
    vite: {
      resolve: {
        alias: {
          '@pages': path.resolve('./src/pages'),
          '@comp': path.resolve('./src/components'),
          '@lib': path.resolve('./src/lib'),
        },
      },
    },
  },
};

export default config;
