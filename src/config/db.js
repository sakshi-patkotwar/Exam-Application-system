let mysql=require("mysql2");

let conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"ExamAppSystem"
});
conn.connect((err)=>{
    if(err)
    {
        console.log("Database is not connected");
    }
    else
    {
        console.log("Database is connected");
    }
})
module.exports=conn;