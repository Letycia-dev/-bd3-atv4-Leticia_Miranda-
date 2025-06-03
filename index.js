const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://leticiamsilva:zCz5nRVGOfaynILJ@cluster0.j9wxj.mongodb.net/Rede_Social?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Post = mongoose.model('Post', {
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

app.get('/', async (req, res) => {
  res.render('index');
});

io.on('connection', async (socket) => {
  console.log('Novo usuário conectado');

  const messages = await Post.find().sort({ timestamp: 1 });
  socket.emit('previousMessages', messages);

  socket.on('sendMessage', async (data) => {
    const post = await Post.create(data);
    io.emit('receivedMessage', post);
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
