const { Kafka } = require("kafkajs");
const readline = require("readline");

const kafka = new Kafka({
  clientId: "football-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const teams = ["A", "B"];
let score = [0, 0];

const matchEvents = [
  "Goal",
  "Foul",
  "Substitution",
  "Corner",
  "Yellow Card",
  "Red Card",
];

const promptUser = () => {
  rl.question(
    `Enter event (${matchEvents.join(", ")}) and team (${teams.join(
      ", "
    )}), separated by a comma: `,
    async (input) => {
      const [event, team] = input.split(",").map((str) => str.trim());

      if (!matchEvents.includes(event) || !teams.includes(team)) {
        console.log("Invalid input. Please enter a valid event and team.");
        promptUser();
        return; 
      }

      if (event == "Goal") {
        console.log({team})
        console.log(team[0])
        console.log(teams[0] == team)
        if ((teams[0] == team)) {
          score[0]++;
        } else {
          score[1]++;
        }
      }

      let matchUpdate = {
        matchId: "match123",
        homeTeam: "Team A",
        awayTeam: "Team B",
        event,
        team,
        score: score.join("-"),
        timestamp: new Date().toISOString(),
      };

      await producer.send({
        topic: "football-matches",
        messages: [{ value: JSON.stringify(matchUpdate) }],
      });

      console.log(`Sent message: ${JSON.stringify(matchUpdate, null, 2)}`);
      promptUser(); 
    }
  );
};

const run = async () => {
  await producer.connect();
  console.log("Producer connected. You can now enter match events.");

  promptUser();
};

run().catch(console.error);
