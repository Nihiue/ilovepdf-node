const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const { getAgent, setBaseURL} = require('./agent');
const constants = require('./constants');

const TASK_STAGES = constants.TASK_STAGES;

async function startTask() {
  if (this._stage !== TASK_STAGES.NOT_INIT) {
    throw new Error('task already init');
  }
  const resp = await this._agent.get(`https://${constants.DEFAULT_ENDPOINT}/v1/start/${this._tool}`);

  this._stage = TASK_STAGES.READY;
  this._server = resp.data.server;
  this._taskId = resp.data.task;
  setBaseURL(this._agent, `https://${this._server}`);

  return resp.data;
}

async function addFile(path) {
  if (this._stage !== TASK_STAGES.READY) {
    throw new Error('wrong task stage');
  }
  const fileItem = {
    local: path,
    server: ''
  };
  this._files.push(fileItem);
  const form = new FormData();
  form.append('task', this._taskId);
  form.append('file', fs.createReadStream(path));

  const resp = await this._agent.post('/v1/upload', form, {
    headers: form.getHeaders()
  });

  fileItem.server = resp.data.server_filename;
  return resp.data;
}

async function processFile() {
  if (this._stage !== TASK_STAGES.READY) {
    throw new Error('wrong task stage');
  }

  if (this._files.length === 0) {
    throw new Error('no file added');
  }

  if (this._files.find(file => !file.server)) {
    throw new Error('upload not finished yet');
  }

  const resp = await this._agent.post('/v1/process', {
    task: this._taskId,
    tool: this._tool,
    files: this._files.map((f) => {
      return {
        server_filename: f.server,
        filename: path.basename(f.local),
      };
    })
  });

  this._stage = TASK_STAGES.PROCESSED;
  return resp.data;
}

async function downloadFile(path) {
  if (this._stage !== TASK_STAGES.PROCESSED) {
    throw new Error('task not finished');
  }
  const resp = await this._agent.get(`/v1/download/${this._taskId}`, {
    responseType: 'stream'
  });

  resp.data.pipe(fs.createWriteStream(path));

  return true;
}

async function downloadAsStream() {
  if (this._stage !== TASK_STAGES.PROCESSED) {
    throw new Error('task not finished');
  }
  const resp = await this._agent.get(`/v1/download/${this._taskId}`, {
    responseType: 'stream'
  });

  return resp.data;

}

function Task(tool, publicId, secretKey) {
  if (constants.TASK_TYPES.indexOf(tool) < 0) {
    throw new Error('invalid tool type: ' + tool);
  }
  this._agent = getAgent(publicId, secretKey);
  this._files = [];
  this._tool = tool;
  this._stage = TASK_STAGES.NOT_INIT;
}

Task.prototype = {
  start: startTask,
  addFile,
  process: processFile,
  download: downloadFile,
  downloadAsStream: downloadAsStream,
};

module.exports = Task;