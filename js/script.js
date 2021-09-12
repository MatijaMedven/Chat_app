//Connecting to Scaledrone channel ID
const drone = new ScaleDrone("PfBUnorBGujMUuHi", {
  //Properties
  data: {
    name: getRandomName(),
    color: getRandomColor(),
  },
});

//Array that stores members
let members = [];

//A connection has been opened. The error argument indicates a problem with the connection.
drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  } else
    console.log(
      "Successfully connected to Scaledrone! Welcome to Nintendo Chatter!"
    );

  //Subscribe to messages
  const room = drone.subscribe("observable-room");

  //Emits an array of members that have joined the room.
  room.on("members", (m) => {
    members = m;
    updateMembersDOM();
  });

  //Member join event is emitted when a new member joins the room.
  room.on("member_join", (member) => {
    members.push(member);
    console.log("member joined!");
    updateMembersDOM();
  });

  //Member leave event is emitted when a member leaves the room.
  room.on("member_leave", ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    console.log("member left!");
    updateMembersDOM();
  });

  //Listen to the messages sent by users
  room.on("data", (text, member) => {
    if (member) {
      getParticipantMessage(text, member);
    }
  });
});

//Connection to Scaledrone has been closed.
drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

//Functions to get random name, color, and image

function getRandomName() {
  var result;
  let adjective = [
    "Super",
    "Worried",
    "Brave",
    "Confused",
    "Angry",
    "Sleepy",
    "Happy",
    "Envious",
    "Bored",
    "Sad",
    "Astonished",
    "Delighted",
    "Irritated",
    "Bitter",
  ];
  let character = [
    "Mario",
    "Luigi",
    "Yoshi",
    "Princess_Peach",
    "Wario",
    "Waluigi",
    "Princess_Daisy",
    "Rosalina",
    "Bowser_Jr.",
    "Koopa_Troopa",
    "Shy_Guy",
    "Dry_Bones",
    "Toad",
    "Bowser",
    "King_Boo",
    "Donkey_Kong",
    "Birdo",
    "Toadette",
    "Lakitu",
    "Pauline",
  ];
  result =
    adjective[Math.floor(Math.random() * adjective.length)] +
    " " +
    character[Math.floor(Math.random() * character.length)];
  return result;
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function getImage(res) {
  let character = res.split(" ").slice(-1);
  let imagePath = "./img/" + character + ".png";
  return imagePath;
}
