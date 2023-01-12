// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import { getLinkPreview } from 'link-preview-js';

export const GET = async ({ params }) => {
  const url = params.url;
  const res = await getLinkPreview(url, {
    timeout: 2000, headers: { "user-agent": "googlebot" }
  });

  return new Response(JSON.stringify({ res }));
};
