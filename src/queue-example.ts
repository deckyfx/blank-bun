import { sleep } from "bun";

import * as readline from "readline";
import * as dgram from "dgram";

import "./utils/Array";
import "./utils/Number";
import "./utils/ObjectArray";
import "./utils/String";
import { Task } from "./utils/Task";
import { debounce, repeat } from "./utils/Timer";
import { ObservableValue } from "./utils/ObservableValue";
import { effect } from "./utils/Effect";
import { computed } from "./utils/ComputedValue";

async function TimedOutProccess(task: Task) {
  console.log("Tick every seconds, and abort after 3 seconds");

  repeat(
    1000,
    () => {
      console.log("Tick");
      task.emit("data", "From Task");
    },
    { signal: task.signal }
  );
  await sleep(3000);

  task.abort();
}

const task = Task.create<void>(TimedOutProccess);

task.on("data", (data) => {
  console.log("Received Data", data);
});

task.on("done", (_task) => {
  console.log("Done");
});

task.on("error", (_task) => {
  console.log("Error", _task._meta);
});

// task.run(null);

// const name = new ObservableValue<string>("John");

// const cleanup = effect(() => {
//   console.log("Changed", name.value);
// }, [name]);

// name.value = "Doe";

// 2. UDP Client (Debounced Keystrokes)
const client = dgram.createSocket("udp4");

// 3. Create an ObservableValue to store the user's input.
const userInput$ = new ObservableValue("");

const computed$ = computed([userInput$], (v: string) => `${v}`);

computed$.unsubscribeSources();

// 4. Define a debounced function to send data to the server.
const debouncedSend = debounce((input: string) => {
  const message = Buffer.from(input);
  client.send(message, 5030, "localhost", (error) => {
    if (error) {
      console.error("Error sending data:", error);
    } else {
      userInput$.value = ""; // Reset the input after sending.
      process.stdout.write(`\x1b[0G\x1b[2KType something: `); // keep the prompt
    }
  });
}, 1000);

// 5. Create an effect that calls the debouncedSend function
//    whenever the userInput$ ObservableValue changes.
effect(() => {
  debouncedSend(userInput$.value);
}, [userInput$]);

// 6. Set up readline to listen for user input from the console in raw mode.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

// 7. Listen for 'data' events to get keystrokes.
process.stdin.on("data", (key: string) => {
  // Handle Ctrl+C to exit.
  if (key === "\u0003") {
    process.stdout.write("\n");
    process.exit();
  }

  // Update the userInput$.  Append the key.
  userInput$.value += key;
  process.stdout.write(`\x1b[0G\x1b[2KType something: ${userInput$.value}`);
});

// 8. Initial prompt.
process.stdout.write("Type something: ");
