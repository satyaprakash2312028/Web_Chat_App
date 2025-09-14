export const compressImage = (file, maxSizeMB = 1, quality = 0.2) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject('Not an image');
    console.log("Original size:", file.size / 1024, "KB");
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject('Compression failed');
          },
          'image/jpeg',
          quality // value between 0 and 1
        );
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}