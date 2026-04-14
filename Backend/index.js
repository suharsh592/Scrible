import express from "express"
import http from "http"
import {Server} from "socket.io";

const app= express();
const rooms={};

//http server create kremge ekk hum
const server= http.createServer(app);
// attach websockewt server

const io = new Server(server,{
    cors:{
        origin:"*",
    }
});//
app.use(express.json());

//socket connection shit somenthing like this
io.on("connection", (socket)=>{
    console.log("user connected", socket.id);
    //connection build
    socket.on("join-room", ({roomId, name})=>{
        console.log("join request via socket id:", roomId, name);
        const room= rooms[roomId];
        if(!room){
            return socket.emit("error", "room not found");
        }

        const playerId= Math.random().toString(36).substring(2,8);

        const player={
            playerId,
            name,
            socketId: socket.id,
        };
        room.players.push(player);
        socket.join(roomId);
        console.log("player joined:", player);

        io.to(roomId).emit("room-update",{
            roomId,
            players: room.players,
        }); 
    });
    //disconnect
    socket.on("disconnect", ()=>{
    console.log("player is disconnected:", socket.id);

    for(const roomId in rooms){
        const room= rooms[roomId];

        room.players= room.players.filter(
            (p)=> p.socketId !== socket.id
        );
        io.to(roomId).emit("room-update", {
            roomId, 
            players: room.players,
        });
    };
});
})

app.get("/", (req,res)=>{
    res.send("Working");
});

//create room

app.post("/rooms", (req, res)=>{
    const roomId=Math.random().toString(36).substring(2,8);

    rooms[roomId]={
        roomId,
        players:[],
    };

    res.json({roomId});
});
app.post("/rooms/:roomId/join",(req,res)=>{
    const {roomIgd}=req.params;
    const {name}= req.body;

    const room= rooms[roomId];

    if(!room){
        return res.status(404).json({error: "room doesnt exist"});
    }

    const playerId=Math.random().toString(36).substring(2,8);g

    const player={
        playerId,
        name
    }

    room.players.push(player);

    res.json({
        message:"room joined Successfully",
        playerId,
        player,
        room
    })
})
server.listen(3000, ()=>{
    console.log("server running on port 3000");
})