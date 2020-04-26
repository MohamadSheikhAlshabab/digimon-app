'use strict';
require('dotenv').config();
const express=require('express');
const superagent=require('superagent');
const pg=require('pg');
const methodOverride=require('method-override');
const PORT=process.env.PORT || 4000;
const app=express();
const client=new  pg.Client(process.env.DATABASE_URL);
client.on('error',errorHandler);
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.set('view engine','ejs');


app.get('/',getDigi);
function getDigi(req,res){
let getSQL='SELECT * FROM newtable;';
client.query(getSQL)
.then((getRes)=>{
    res.render('index');
}).catch((err)=>errorHandler(err,req,res));
}

app.get('/favorite',favDigi);
function favDigi(req,res){
    let urlName=req.query.name;
    let urlLevel=req.query.level;
    let urlApi=`https://digimon-api.herokuapp.com/api/digimon?search_query=${urlName}&${urlLevel}`;
    
   
  superagent.get(urlApi)
  .then((result)=>{
    res.redirect(`/favorite/${digi_id}`,{favKey:result});
}).catch((err)=>errorHandler(err,req,res));
}
app.get('/view/:digi_id',getView);
function getView(req,res){
let SQL='SELECT * FROM newtable WHERE id=$1;';
let SQLVal=[req.params.id];
client.query(SQL,SQLVal)
.then((veiwRes)=>{
    res.redirect(`/favorite/${digi_id}`,{viewKey:veiwRes});
}).catch((err)=>errorHandler(err,req,res));
}

app.post('/add',addDigi);
function addDigi(req,res){
let digimon =new Digimon (data);
    let addSQL='INSERT INTO newtable (name,img,level)VALUES($1,$2,$3);';
    let addVal=[req.body.name,req.body.img,req.body.level];
    client.query(digimon,addSQL,addVal)
    .then((addRes)=>{
        res.redirect(`index`,{addKey:addRes})
    }).catch((err)=>errorHandler(err,req,res));
}

app.put('/update/:digi_id',updateDigi);
function updateDigi(req,res){
let updateSQL='UPDATE newtable SET name=$1 AND img=$2 AND level=$3 WHERE id=$4; ';
let updateVal=[req.body.name,req.body.img,req.body.level,req.params.digi_id];
client.query(updateSQL,updateVal)
.then((result)=>{
 res.redirect('/details',{updateKey:result})
}).catch((err)=>errorHandler(err,req,res));
}

app.delete('/delete/:digi_id',deleteDigi);
function deleteDigi(req,res){
    let deleteSQL='SELECT FROM newtable';
    let deleteVal=[req.params.digi_id];
    client.query(deleteSQL,deleteVal)
    .then((result)=>{
        res.redirect('/details')
    }).catch((err)=>errorHandler(err,req,res));
}

function Digimon(data){
this.name=data.name;
this.img=data.img;
this.level=data.level;
}
app.use('*',notFoundHandler);
client.connect()
.then(()=>{
    app.listen(PORT,console.log(`Running on port ${PORT}`));
})
function notFoundHandler(req,res){
    res.status(404).send('Page Not Found');
}

function errorHandler(error,req,res){
    res.status(500).send(error)
}