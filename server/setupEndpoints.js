
game = {};






function startGameEndpoints(app){
    app.get("/test", (req, res)=>{
        console.log(req);
        res.send(JSON.stringify({"test":"test"}))
    });
}

module.exports = {startGameEndpoints};