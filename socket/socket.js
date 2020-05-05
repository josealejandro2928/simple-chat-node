const jwt = require('jsonwebtoken');
/////////////////////Globals Variables////////////////////////
var Clients = {}
var socketIO = undefined;
module.exports = {
    socketHandler(server) {
        socketIO = require('socket.io')(server);
        global.socketIO = socketIO;
        console.log("Inicializado el socket");

        socketIO.on('connection', socket => {
            console.log("Client Connected")

            socketIO.emit('get-token', {
                action: "Socket connected"
            });

            socket.on('set-token', async (token) => {
                let userId = getUser(token);
                socket.username = userId;
                Clients[userId] = socket;
                await global.models.User.findOneAndUpdate({
                    _id: userId
                }, {
                    isConnected: true
                });
                let user = await global.models.User.findById(userId);
                this.showClientsConnected();
                socketIO.emit('users-changed', {
                    user: user,
                    event: 'joined'
                });
            });

            socket.on('disconnect', async function () {
                console.log("Client disconnect")
                for (let key in Clients) {
                    if (Clients[key].id == socket.id) {
                        await global.models.User.findOneAndUpdate({
                            _id: key
                        }, {
                            isConnected: false,
                            lastConnection: new Date()
                        });
                        let user = await global.models.User.findById(key);
                        socketIO.emit('users-changed', {
                            user: user,
                            event: 'left'
                        });
                        delete Clients[key];
                    }
                }

            });
            ///////////////UTILES FOR CHAT//////////////////////////////////

            //////////////1-MARCAR MENSAJE COMO LEIDO/////////////////////
            socket.on('mark-message-as-read', async function (data) {
                let messageId = data.messageId;
                let message = await global.models.Message.findById(messageId);
                if (message.action != 'received') {
                    throw new Error('THis action only works for messages received')
                }
                let messageFrom = await global.models.Message.findById(message.messageFromId);
                messageFrom.status = 'read';
                let newMessageFrom = await messageFrom.save();
                let soketClient = getClient(newMessageFrom.creator);
                if (soketClient) {
                    soketClient.emit("message-read", {
                        message: newMessageFrom
                    });
                }

            })
            //////////////2-USUARIO ESCRIBIENDO/////////////////////////
            socket.on('user-typing', async function (data) {
                let chatId = data.chatId;
                if (!chatId) {
                    throw new Error('Invalid operation you must provide a chat')
                }
                let chat = await global.models.SimpleChat.findById(chatId);
                let soketClient = getClient(chat.userTo);
                if (soketClient) {
                    soketClient.emit('user-typing', {});
                }
            })

        })
    },
    getSocketIO() {
        if (!socketIO) {
            throw new Error('Not socket connected');
        } else {
            return socketIO
        }
    },
    getClient: getClient,
    getConnectedClients: getConnectedClients,
    getUser: getUser,
    showClientsConnected: showClientsConnected
}

////////////////UTILS FUNCTIONS FOR SOCKET MODULE////////////////////////
function getUser(Authorization) {
    if (!Authorization) {
        const error = new Error('Invalid Authentication');
        error.statusCode = 401;
        throw error;
    }
    let token = Authorization.split(' ')[1]
    let decodedToken;
    // eslint-disable-next-line no-useless-catch
    try {
        decodedToken = jwt.decode(token, global.config, global.config.jwtKey);
        console.log("getUser -> decodedToken", decodedToken)
    } catch (err) {
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    return decodedToken.userId
}

function getClient(userId) {
    return Clients[userId];
}

function getConnectedClients() {
    return Object.keys(Clients);
}

function showClientsConnected() {
    console.log("Client: ")
    Object.keys(Clients).map(key => {
        console.log(`UserId: ${key} - socket: ${Clients[key].id}`)
    })
}