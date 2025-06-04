import express from 'express';
import {setUserInfo,getUserInfo,setProvider,getProvider} from "./Repository/userRepository"
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());  
app.post('/setUser', async(req, res) => {
    try{
        await setUserInfo(req.body)
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

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});