"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRepository_1 = require("./Repository/userRepository");
const http_1 = __importDefault(require("http"));
const { Server } = require('socket.io');
const port = 5000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins to access the server
        methods: ['GET', 'POST'], // Allow specific HTTP methods
    }
});
//allow all origins to access the server
// Middleware to parse JSON request bodies
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/setUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, userRepository_1.setUserInfo)(req.body);
        res.send({ id: id, isSuccessful: true });
    }
    catch (ex) {
        console.log(ex);
    }
}));
app.get('/getUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, userRepository_1.getUserInfo)();
        res.json(data);
    }
    catch (ex) {
        console.log(ex);
    }
}));
app.post('/setProvider', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, userRepository_1.setProvider)(req.body);
        res.send({ isSuccessful: true, id: id });
    }
    catch (ex) {
        console.log(ex);
    }
}));
app.get('/getProvider', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, userRepository_1.getProvider)();
        res.json(data);
    }
    catch (ex) {
        console.log(ex);
    }
}));
const rooms = new Map();
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join room', (roomID) => {
        console.log(`User ${socket.id} joined room: ${roomID}`);
        if (rooms.has(roomID)) {
            rooms.get(roomID).push(socket.id);
        }
        else {
            rooms.set(roomID, [socket.id]);
        }
        const otherUsers = rooms.get(roomID).filter((id) => id !== socket.id);
        console.log(rooms.get(roomID), roomID, otherUsers);
        socket.emit('all users', otherUsers);
    });
    socket.on('sending signal', (payload) => {
        console.log('new peer is created');
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });
    socket.on('returning signal', (payload) => {
        console.log('returning signal');
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });
    socket.on('leave room', (roomId) => {
        console.log('A user disconnected');
        //rooms.forEach((value, key) => {
        // if (value.includes(socket.id)) {
        //   rooms.set(key, value.filter((id:string) => id !== socket.id));
        // remove the user from the room
        rooms.get(roomId).splice(rooms.get(roomId).indexOf(socket.id), 1);
        if (rooms.get(roomId).length === 0) {
            rooms.delete(roomId);
        }
        // }
        // });
        socket.broadcast.emit('user left', socket.id);
    });
});
// Start the server and listen on the specified port
server.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${port}`);
});
