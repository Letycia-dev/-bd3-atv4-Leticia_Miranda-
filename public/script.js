const socket = io();

socket.on('previousMessages', (messages) => {
  for (let msg of messages) {
    renderMessage(msg);
  }
});

socket.on('receivedMessage', (message) => {
  renderMessage(message);
});

$('#chatForm').submit(function (e) {
  e.preventDefault();

  const user = $('#user').val();
  const message = $('#message').val();

  socket.emit('sendMessage', { user, message });

  $('#message').val('');
});

function renderMessage(data) {
  $('#chat').append(`<p><strong>${data.user}:</strong> ${data.message}</p>`);
}
