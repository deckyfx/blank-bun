import type { Task } from "./Task";

class Queue {
  private tasks: Task[] = [];

  constructor() {}

  enque(task: Task) {
    this.tasks.push(task);
  }

  deque() {
    return this.tasks.shift();
  }

  async sequence() {
    const task = this.deque();
    if (!task) {
      return;
    }
    task.on("done", () => {});
    await task.run();
  }

  async paralel() {}
}
