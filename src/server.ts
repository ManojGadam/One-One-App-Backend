import express from 'express';
import cors from 'cors';
import {setUserInfo,getUserInfo,setProvider,getProvider} from "./Repository/userRepository"
import http from 'http';
const {Server} = require('socket.io');
const port = 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: '*', // Allow all origins to access the server
    methods: ['GET', 'POST'], // Allow specific HTTP methods
  }});


//allow all origins to access the server
// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());  
app.post('/setUser', async(req, res) => {
    try{
        await setUserInfo(req.body)
        res.send('User set successfully');
  }catch(ex){
    console.log(ex)
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
    try{
        console.log("in",req.body)
        await setProvider(req.body);
        res.send('Provider set successfully');
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