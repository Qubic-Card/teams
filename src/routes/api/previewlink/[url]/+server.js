// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import { getLinkPreview } from 'link-preview-js';

export const GET = async ({ params }) => {
  const url = params.url;
  const res = await getLinkPreview(url, {
    followRedirects: 'manual',
    handleRedirects: (baseURL, forwardedURL) => {
      const urlObj = new URL(baseURL);
      const forwardedURLObj = new URL(forwardedURL);
      if (
        forwardedURLObj.hostname === urlObj.hostname ||
        forwardedURLObj.hostname === 'www.' + urlObj.hostname ||
        'www.' + forwardedURLObj.hostname === urlObj.hostname
      ) {
        return true;
      } else {
        return false;
      }
    },
    timeout: 2000,
    headers: { 'user-agent': 'googlebot' },
  }).catch((e) => {});

  return new Response(JSON.stringify({ res }));
};
