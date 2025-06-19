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
        const id = await setUserInfo(req.body)
        res.send({id:id, isSuccessful:true});
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

 socket.on('disconnect', (roomId:any) => {
  console.log('A user disconnected',roomId);
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