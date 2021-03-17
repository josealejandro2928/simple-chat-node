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
                socketIO.emit("chats-update", {
                    msg: 'Chats update'
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
                socketIO.emit("chats-update", {
                    msg: 'Chats update'
                });

            });
            ///////////////UTILES FOR CHAT//////////////////////////////////

            //////////////1-MARCAR MENSAJE COMO LEIDO/////////////////////
            socket.on('mark-message-as-read', async function (data) {
                try {
                    let messageId = data.messageId;
                    let message = await global.models.Message.findById(messageId);
                    if (message.action != 'received') {
                        throw new Error('THis action only works for messages received')
                    }
                    let messageFrom = await global.models.Message.findById(message.messageFromId);
                    messageFrom.status = 'read';
                    let newMessageFrom = await messageFrom.save();

                    message.status = 'read';
                    await message.save();

                    let soketClient = getClient(newMessageFrom.creator);
                    if (soketClient) {
                        soketClient.emit("message-read", {
                            message: newMessageFrom,
                            chatId: newMessageFrom.simpleChat
                        });
                    }

                } catch (err) {
                    console.log("Error en: mark-message-as-read", err)
                }


            })
            //////////////2-USUARIO ESCRIBIENDO/////////////////////////
            socket.on('user-typing', async function (data) {
                let chatId = data.chatId;
                if (!chatId) {
                    throw new Error('Invalid operation you must provide a chat')
                }
                try {
                    let chat = await global.models.SimpleChat.findById(chatId).populate('userFrom');
                    let chatTo = await global.models.SimpleChat.findById(chat.chatTo);
                    let soketClient = getClient(chat.userTo);
                    if (soketClient) {
                        soketClient.emit('user-typing', {
                            chat: chatTo,
                            msg: `${chat.userFrom.name} is typing`,
                            chatId: chatTo._id
                        });
                    }

                } catch (err) {
                    console.log("Error en: user-typing", err)

                }

            })

            //////////////////3-ULTIMO MENSAJE LEIDO O ENVIADO POR EL USUARIO//////////////////
            socket.on('set-message-as-last-read-or-send', async function (data) {
                let messageId = data.messageId;
                console.log("Entrando mucho aqui");
                try {
                    let message = await global.models.Message.findById(messageId).populate('simpleChat');
                    let chat = message.simpleChat;
                    if (chat.lastMessageSendOrRead && chat.lastMessageSendOrRead.toString() < message._id.toString()) {
                        chat.lastMessageSendOrRead = message._id;
                        return await chat.save();
                    }
                    if (!chat.lastMessageSendOrRead) {
                        chat.lastMessageSendOrRead = message._id;
                        return await chat.save();
                    }
                } catch (error) {
                    console.log("Error en: set-message-as-last-read-or-send", error)

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