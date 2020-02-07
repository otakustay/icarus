const {workerData, parentPort} = require('worker_threads');
const sharp = require('sharp');

const resizeImage = (buffer, width, height) => sharp(buffer).resize(width, height).toBuffer();

const main = async () => {
    const {id, content, width, height} = workerData;
    const buffer = Buffer.from(content);
    const resized = await resizeImage(buffer, width, height);
    resized.copy(buffer);
    parentPort && parentPort.postMessage({id, size: resized.byteLength, content: resized});
};
main();
