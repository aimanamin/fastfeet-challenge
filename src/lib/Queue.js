import Bee from 'bee-queue';

import NotificationJob from '../app/jobs/notification';
import CancellationJob from '../app/jobs/cancellation';
import redisConfig from '../configs/redis';

const Jobs = [NotificationJob, CancellationJob];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    Jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    Jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
