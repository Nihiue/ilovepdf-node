# node-ilovepdf-sdk

node.js SDK for [iLovePDF REST API](https://developer.ilovepdf.com)

You can sign up for a iLovePDF account at https://developer.ilovepdf.com

Develop and automate PDF processing tasks like Compress PDF, Merge PDF, Split PDF, convert Office to PDF, PDF to JPG, Images to PDF, add Page Numbers, Rotate PDF, Unlock PDF, stamp a Watermark and Repair PDF. Each one with several settings to get your desired results.

## Install
```bash
$ npm install ilovepdf-sdk
```

## Getting Started
```javascript

const ilovepdfSDK = require('ilovepdf-sdk');

const sdk = new ilovepdfSDK('PROJECT_PUBLIC_ID','SECRET_KEY');

try {
  const task = await sdk.createTask('officepdf');

  await task.addFile('./input.docx');
  const resultInfo = await task.process();

  // download as file
  await task.download('./ouput.pdf');

  // download as stream
  const stream = await task.downloadAsStream();

} catch (e) {
  console.log(e);
}

```

## Supported Task Types
```javascript
[
  'merge',
  'split',
  'compress',
  'pdfjpg',
  'imagepdf',
  'unlock',
  'pagenumber',
  'watermark',
  'officepdf',
  'repair',
  'rotate',
  'protect',
  'pdfa',
  'validatepdfa',
  'extract'
]
```

## Documentation

Please see https://developer.ilovepdf.com/docs for up-to-date documentation.