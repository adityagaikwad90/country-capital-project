import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"Aditya2003@",
    port:5432,
});

db.connect()
const app=express();
const port=3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let quize=[];
db.query("SELECT * FROM capitals",(err,res)=>{
if(err){
    console.error("error connecting query",err.stack);
}
else{
    quize=res.rows;
}
db.end();
});
let totalcorrect = 0;
let curruntquestion={};


// app.use(express.static("public"));
app.get("/",async(req,res)=>{
    totalcorrect=0;
    await nextQuestion();
    console.log(curruntquestion);
    res.render("index.ejs",{question:curruntquestion});
})
app.post("/", (req,res)=>{
    let answer=req.body.answer.trim();
    let iscorrect=false;
    if(curruntquestion.capital.toLowerCase() === answer.toLowerCase()){
        totalcorrect++;
        console.log(totalcorrect);
        iscorrect=true;
    }
    nextQuestion();
    console.log(curruntquestion);
    res.render("index.ejs",{
        question:curruntquestion,
        wasCorrect:iscorrect,
        totalScore:totalcorrect
    })
})

async function nextQuestion() {
  const randomCountry = quize[Math.floor(Math.random() * quize.length)];
  curruntquestion = randomCountry;
}

app.listen(port,() =>{
console.log("server is running");
})