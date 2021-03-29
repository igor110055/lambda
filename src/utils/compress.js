/**
 *
 * @param {string} base64String Base64 encoded image string
 * @param {*} maxWidth Max Width of result image
 * @returns {string} Compressed Base64 encoded image string
 */
export const compressImageDataURL = (base64String, maxWidth = 1200) => {
  const originalImage = document.createElement("img");
  originalImage.src = base64String;

  const canvas = document.createElement("canvas");
  const MAX_WIDTH = maxWidth;

  if (originalImage.width > MAX_WIDTH) {
    const scale = MAX_WIDTH / originalImage.width;
    canvas.width = MAX_WIDTH;
    canvas.height = originalImage.height * scale;
  } else {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
  }

  const ctx = canvas.getContext("2d");
  ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
  const mime = base64String.split(";base64,")[0].split(":")[1];
  return ctx.canvas.toDataURL(mime);
};
