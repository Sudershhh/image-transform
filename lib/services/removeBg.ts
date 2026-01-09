import { env } from '../env';

const REMOVE_BG_API_KEY = env.BG_REMOVE_API_KEY;
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

export async function removeBackground(imageBlob: Blob): Promise<ArrayBuffer> {
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', imageBlob);

  const response = await fetch(REMOVE_BG_API_URL, {
    method: 'POST',
    headers: { 'X-Api-Key': REMOVE_BG_API_KEY },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Remove.bg API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.arrayBuffer();
}

export async function removeBackgroundFromUrl(imageUrl: string): Promise<ArrayBuffer> {
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_url', imageUrl);

  const response = await fetch(REMOVE_BG_API_URL, {
    method: 'POST',
    headers: { 'X-Api-Key': REMOVE_BG_API_KEY },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Remove.bg API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.arrayBuffer();
}
