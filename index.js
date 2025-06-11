let app=require("./src/app.js");
let PORT=3100;

app.listen(PORT,(req,res)=>{
    console.log("Server Started " +PORT);
});