import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public/Awards_JPG';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const tempPath = path.join(dir, `temp_${file}`);
    
    await sharp(inputPath)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(tempPath);
      
    fs.renameSync(tempPath, inputPath);
    console.log(`Processed ${file}`);
  }
}

processImages();
