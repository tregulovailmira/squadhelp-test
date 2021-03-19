const { Server } = require('socket.io');
const ChatController = require('./controllers/sockets/ChatController');
const NotificationController = require('./controllers/sockets/NotificationController');

let notificationController;
let chatController;

module.exports.createConnection = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  });
  notificationController = new NotificationController();
  notificationController.connect('/api/notifications', io);
  chatController = new ChatController();
  chatController.connect('/api/chat', io);
};

module.exports.getChatController = () => {
  return chatController;
};

module.exports.getNotificationController = () => {
  return notificationController;
};
