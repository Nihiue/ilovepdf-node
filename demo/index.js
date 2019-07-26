
const ilovepdfSDK = require('../lib/index');
const path = require('path');

const sdk = new ilovepdfSDK('project_public_id', 'secret_key');

async function convertOfficeToPdf() {
  const inputFile = path.resolve(__dirname, 'test', 'Process.docx');
  const outputFile = path.resolve(__dirname, 'test', 'output.pdf');
  try {
    const task = await sdk.createTask('officepdf');

    await task.addFile(inputFile);

    const result = await task.process();
    console.log(result);

    await task.download(outputFile);
  } catch (e) {
    console.log(e);
  }
}
