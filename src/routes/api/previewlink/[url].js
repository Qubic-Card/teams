import { getLinkPreview, getPreviewFromContent } from 'link-preview-js';

export const get = async ({ params }) => {
  const url = params.url;
  const res = await getLinkPreview(url);

  return {
    status: 200,
    body: res,
  };
};
