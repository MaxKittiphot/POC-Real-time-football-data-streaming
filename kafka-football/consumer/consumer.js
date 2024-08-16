const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'football-consumer',
  brokers: ['localhost:9092'] // Replace with your broker addresses
});

const consumer = kafka.consumer({ groupId: 'football-group' });

const run = async () => {
  await consumer.connect();
  console.log('Consumer connected');

  await consumer.subscribe({ topic: 'football-matches', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const matchData = JSON.parse(message.value.toString());
      console.log(`Received message: ${JSON.stringify(matchData, null, 2)}`);
    },
  });
};

run().catch(console.error);