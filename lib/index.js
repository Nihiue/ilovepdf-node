
const Task = require('./task');


module.exports = function (publicId, secretKey) {
  return {
    async createTask(tool) {
      try {
        const task = new Task(tool, publicId, secretKey);
        await task.start();
        return task;
      } catch (e) {
        console.log(e);
      }
    },
  }
}