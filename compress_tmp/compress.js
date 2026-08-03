const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Compressing ${inputPath}...`);
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-crf 28',         
        '-preset veryfast',
        '-vf scale=-2:720',
        '-pix_fmt yuv420p',
        '-profile:v baseline',
        '-level 3.0',
        '-an',             
        '-movflags +faststart'
      ])
      .save(outputPath)
      .on('end', () => {
        console.log(`Successfully compressed to ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error compressing ${inputPath}:`, err);
        reject(err);
      });
  });
}

async function run() {
  try {
    await compressVideo('../public/Tablet.mp4', '../public/Tablet_compressed.mp4');
    await compressVideo('../public/sk_mobile.mp4', '../public/sk_mobile_compressed.mp4');
    console.log('All compression tasks finished.');
  } catch (err) {
    console.error('Compression failed.', err);
    process.exit(1);
  }
}

run();
