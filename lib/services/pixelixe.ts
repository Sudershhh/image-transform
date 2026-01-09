import { env } from '../env';

const PIXELIXE_API_KEY = env.PIXELIXE_API_KEY;
const PIXELIXE_API_URL = 'https://studio.pixelixe.com/api/flip/v1';

export async function flipImage(
  imageUrl: string,
  horizontal: boolean = true,
  vertical: boolean = false
): Promise<ArrayBuffer> {
  const baseParams = new URLSearchParams({
    horizontal: horizontal.toString(),
    vertical: vertical.toString(),
    imageType: 'png',
  });
  
  const url = `${PIXELIXE_API_URL}?${baseParams.toString()}&imageUrl=${encodeURIComponent(imageUrl)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${PIXELIXE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pixelixe API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.arrayBuffer();
}
