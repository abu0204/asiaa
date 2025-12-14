const socket = io();

socket.on("notify", (msg) => {
  alert("Live Notification: " + msg);
});

function sendNotify() {
  socket.emit("admin-notify", "New user registered!");
};