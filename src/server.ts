import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import {setUserInfo,getUserInfo,setProvider,getProvider} from "./Repository/userRepository"
import http from 'http';
import { Provider } from './models/ProviderModel';

const {Server} = require('socket.io');
const port = 5000;
// import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
const admin=require('firebase-admin');
// import serviceAccount from './serviceAccountKey.json';
admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

// module.exports = admin;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: '*', // Allow all origins to access the server
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true // Allow credentials to be sent
  }});


//allow all origins to access the server
// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());  
app.post('/setUser', async(req, res) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  console.log("Token:", token);
  if (!token) {
    return res.status(401).send({ isSuccessful: false, error: 'No token' });
  }
    try{
      const decoded=await admin.auth().verifyIdToken(token);
      const uid= decoded.uid;
      const id = await setUserInfo({...req.body, uid});
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set");
      }
      const JWT = jwt.sign({ uid: decoded.uid }, secret, { expiresIn: '1h' });
      // const JWT=jwt.sign({uid:decoded.uid},process.env.JWT_SECRET, {expiresIn: '1h'});
      console.log("JWT",JWT);
      res.status(200).send({id:id, token:JWT, isSuccessful:true});
  }catch(ex){
    res.status(401).send({isSuccessful:false, error: 'No token'});
  }
});

app.get('/getUser', async(req, res) => {
    try{
        const data = await getUserInfo();
        res.json(data);
  }catch(ex){
    console.log(ex)
  }
});

app.post('/setProvider', async(req, res) => {
    try {
        const id = await setProvider(req.body);
        res.send({isSuccessful:true,id:id});
    }catch(ex){
        console.log(ex)
    }
})

app.get('/getProvider', async(req, res) => {
    try{
        const data = await getProvider();
        res.json(data);
    }catch(ex){
        console.log(ex)
    }
}); 
const rooms = new Map();
io.on('connection', (socket: any) => { 
  console.log('User connected:', socket.id);
  socket.on('join room', (roomID:any) => {
    console.log(`User ${socket.id} joined room: ${roomID}`);
    socket.join(roomID);
  if (rooms.has(roomID)) {
    rooms.get(roomID).push(socket.id);
  } else {
    rooms.set(roomID, [socket.id]);
  }

  const otherUsers = rooms.get(roomID).filter((id: string) => id !== socket.id);
  console.log(rooms.get(roomID),roomID,otherUsers)
  socket.emit('all users', otherUsers);
});

  socket.on('sending signal', (payload:any) => {
  console.log('new peer is created');  
  io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
});
socket.on('returning signal', (payload:any) => {
  console.log('returning signal');
  io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
});

socket.on('leave room', ({ roomId, userId }: { roomId: any; userId: any }) => {
        // Remove socket from room
        socket.leave(roomId);
        
        for (const value of rooms.get(roomId)) {
              socket.to(value).emit('user left', userId);
        }
        
        // Get remaining users in the room
        const room = rooms.get(roomId);
        
        // If room is empty, clean it up
        if (!room || room.size === 0) {
            rooms.delete(roomId);
        }
    });

 socket.on('disconnect', () => {
  console.log('User disconnected:', socket.id);
});

interface MessageData {
  roomId: string;
  message: {
    content: string;
    sender: string;
    timestamp: string;
  };
}

socket.on('send message', (data: MessageData) => {
    console.log('Received message in room:', data.roomId, data.message);
    io.to(data.roomId).emit('receive message', data.message);
});

});

 // Start the server and listen on the specified port
server.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});