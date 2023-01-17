// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import { getLinkPreview } from 'link-preview-js';
const dns = require("node:dns");

export const GET = async ({ params }) => {
  const url = params.url;
  const res = await getLinkPreview(url, {
    resolveDNSHost: async (url) => {
      return new Promise((resolve, reject) => {
        const hostname = new URL(url).hostname;
        dns.lookup(hostname, (err, address, family) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(address); // if address resolves to localhost or '127.0.0.1' library will throw an error
        });
      });
    }, timeout: 3000, headers: { "user-agent": "googlebot" }
  }).catch((e)=> {});

  return new Response(JSON.stringify({ res }));
};
