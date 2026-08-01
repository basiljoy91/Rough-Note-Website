const { Jimp } = require('jimp');

async function removeBackground(inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    
    // Define the tolerance for "white"
    const tolerance = 230; 

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is close to white, make it transparent
      if (red > tolerance && green > tolerance && blue > tolerance) {
        this.bitmap.data[idx + 3] = 0; // Alpha
      }
    });

    await image.write(outputFile);
    console.log(`Processed ${inputFile}`);
  } catch (error) {
    console.error(`Error processing ${inputFile}:`, error);
  }
}

async function main() {
  const images = [
    '../public/assets/images/pencil-left.png',
    '../public/assets/images/pencil-right.png',
    '../public/assets/images/binder-clip.png'
  ];
  
  for (const img of images) {
    await removeBackground(img, img);
  }
}

main();
