//DOM query selectors for all classes
const DOM = {
  members: document.querySelector(".members"),
  messages: document.querySelector(".messages"),
  form: document.querySelector(".message-form"),
  input: document.querySelector(".message-form_input"),
  exit: document.querySelector(".message-form_exit"),
};

//Event listeners for sending messages and exiting chat
DOM.form.addEventListener("submit", sendMessage);
DOM.exit.addEventListener("click", exitChat);

//Exiting chat and returning to homepage
function exitChat() {
  return drone.close();
}

//Sending a message
function sendMessage() {
  const value = DOM.input.value;
  if (value === "") {
    return alert("Please type something");
  }
  DOM.input.value = "";
  drone.publish({
    room: "observable-room",
    message: value,
  });
}

//Function to update the who's online
function updateMembersDOM() {
  DOM.members.innerHTML = `${members.length} friends in the room: ${members
    .map((value) => {
      return `<span style="color: ${value.clientData.color}">${value.clientData.name}</span>`;
    })
    .join(", ")}`;
}

//DOM create message element. Separate messages from me and other participants
function createMessageElement(text, member, image) {
  const clientID = drone.clientId;
  const messageFromMe = member.id === clientID;

  //Conditional (ternary) operator
  const className = messageFromMe ? "message currentMember" : "message";
  const { name, color } = member.clientData;

  //Message text
  const msg = document.createElement("div");
  msg.appendChild(document.createTextNode(text));
  msg.className = "message_text";

  //Creating username profile with a name, color, and an icon
  const profile = document.createElement("div");
  profile.className = "profile";

  const character = document.createElement("div");
  character.appendChild(document.createTextNode(name));
  character.style.color = color;
  character.className = "name";

  const img = document.createElement("img");
  img.classList.add("icon");
  img.src = image;

  profile.appendChild(character);
  profile.appendChild(img);

  //Combining user profile and message into one element based on whether the message is from you or other participanys
  const element = document.createElement("div");
  element.appendChild(profile);
  element.appendChild(msg);
  element.className = className;
  return element;
}

//Add a new message to the chat window and automatically scroll to the bottom of the chat
function getParticipantMessage(text, member, image) {
  var userName = member.clientData.name;
  image = getImage(userName);

  const element = DOM.messages;
  const wasTop =
    element.scrollTop === element.scrollHeight - element.clientHeight;
  element.appendChild(createMessageElement(text, member, image));
  if (wasTop) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }
}
