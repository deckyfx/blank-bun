import * as dgram from "dgram";

// 1.  UDP Server (Echo)
const server = dgram.createSocket("udp4");
const SERVER_PORT = 5030;
const SERVER_HOST = "localhost"; // Or '0.0.0.0' to listen on all interfaces

server.on("listening", () => {
  const address = server.address();
  console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.on("message", (message, rinfo) => {
  console.log(
    `Server received: "${message.toString()}" from ${rinfo.address}:${
      rinfo.port
    }`
  );
  // Echo back the message to the client
  server.send(message, rinfo.port, rinfo.address, (error) => {
    if (error) {
      console.error("Error sending response:", error);
    }
  });
});

server.on("error", (error) => {
  console.error("Server error:", error);
  server.close();
});

server.bind(SERVER_PORT, SERVER_HOST);
