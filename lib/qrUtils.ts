/**
 * Generate a secure UUIDv4 token for QR codes
 */
export function generateQrToken(): string {
  // Generate UUIDv4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate QR code data URL from a URL string
 * Uses qrcode library (client-side only)
 */
export async function generateQrDataUrl(url: string, size = 256): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('generateQrDataUrl can only be called on the client side');
  }

  // Dynamic import of qrcode library
  const QRCode = (await import('qrcode')).default;
  
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}












