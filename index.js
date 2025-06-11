let app=require("./src/app.js");
let PORT=3100;

app.listen(PORT,(req,res)=>{
    console.log("Server Started " +PORT +`click here to run and view the project http://localhost:${PORT}`);
});