const { Kafka } = require("kafkajs");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const kafka = new Kafka({
  clientId: "football-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "football-group" });

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connect via Socket.IO`);
});

const run = async () => {
  await consumer.connect();
  console.log(`Consumer connected`);

  await consumer.subscribe({
    topic: "football-matches",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      const matchData = JSON.parse(message.value.toString());
      console.log(`Received message: ${JSON.stringify(matchData, null, 2)}`);
      
      io.emit('matchUpdate', matchData);
    }
  })

};

run().catch(console.log);

server.listen(5000, () => {
  console.log(`Server is listening on port 5000`);
});
