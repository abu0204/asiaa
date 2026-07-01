const socket = io();

(function joinRoom() {
  socket.emit("joinAdmin", localStorage.getItem("adminId"));
})();