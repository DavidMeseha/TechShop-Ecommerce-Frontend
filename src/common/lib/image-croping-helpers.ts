function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

// Helper to get cropped image as a blob
export async function getCroppedImg(imageSrc: string, crop: any) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const scale = image.naturalWidth / image.width;
  const cropX = crop.x * scale;
  const cropY = crop.y * scale;
  const cropWidth = crop.width * scale;
  const cropHeight = crop.height * scale;
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg");
  });
}
