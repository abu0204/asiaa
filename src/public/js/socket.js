const socket = io();

(function joinRoom() {
  socket.emit("joinAdmin", localStorage.getItem("adminId"));
})();

function sendNotify() {
  socket.emit("admin-notify", "New user registered!");
}
