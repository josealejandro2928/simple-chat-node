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
            // Clients[userId] = socket;

            socket.on('set-token', async (token) => {
                console.log("socketHandler -> token", token)
                let userId = getUser(token);
                socket.username = userId;
                Clients[userId] = socket;
                let user = await global.models.User.findOneAndUpdate({
                    _id: userId
                }, {
                    isConnected: true
                });

                socketIO.emit('users-changed', {
                    user: user,
                    event: 'joined'
                });
            });

            socket.on('disconnect', async function () {
                console.log("Client disconnect")
                for (let key in Clients) {
                    if (Clients[key].id == socket.id) {
                        let user = await global.models.User.findOneAndUpdate({
                            _id: key
                        }, {
                            isConnected: false
                        });

                        socketIO.emit('users-changed', {
                            user: user,
                            event: 'left'
                        });
                        delete Clients[key];
                    }
                }

            });
        })
    },
    getSocketIO() {
        if (!socketIO) {
            throw new Error('Not socket connected');
        } else {
            return socketIO
        }
    },
    getClient(userId) {
        return Clients[userId];
    },
    getConnectedClients() {
        return Object.keys(Clients);
    },
    getUser: getUser,
}

////////////////UTILS FUNCTIONS////////////////////////
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