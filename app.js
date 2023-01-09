require('dotenv').config();
const express=require('express');
const bp=require('body-parser');
const mongoose = require('mongoose');
const date=require(__dirname+"/date.js");
const _=require('lodash');
const app=express()

app.use(bp.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.set('strictQuery', false); 
mongoose.connect(process.env.MONGO_URI,{useNewUrlparser:true});

const itemSchema=new mongoose.Schema({
name:String
});

const Item=mongoose.model("Item",itemSchema); 

const item1=new Item({
name:"Welcome to your to-do-list."
});

const item2=new Item({
    name:"Hit the + button to add a new item."
    }); 

    const item3=new Item({
        name:"<-- Hit this to delete an item."
        });

        const defitem=[item1,item2,item3];

        const listSchema={
            name:String,
            items:[itemSchema]
        };

        const List=mongoose.model("List",listSchema);

app.get("/",function(req,res){
           
        Item.find({},function(err,foundItems){
            if(foundItems.length === 0){
                Item.insertMany(defitem,function(err){
                    if(err)
                    console.log(err);
                    else
                    console.log("Successfully saved items to DB.");
                });
                res.redirect("/");
            }
            else{
            res.render("index",{kindofDay:"Today",newListitems:foundItems});}
        });
    });
   // app.post("/",function(req,res){
     //   var item=req.body.newItem;
       // i.push(item);
        //res.redirect("/");
//});

app.post("/",function(req,res){ 
    const itemName=req.body.newItem;
    const listName=req.body.list;
    //console.log(listName);
    const item=new Item({
        name:itemName
    });

if(listName === "Today"){
    item.save();
    res.redirect("/");
}else{
    List.findOne({name:listName},function(err,foundList){
       foundList.items.push(item);
        // console.log(foundList);
       foundList.save();
        res.redirect("/"+listName);
    });
}
});

app.post("/delete",function(req,res){
    const checked=req.body.checkbox;
    const listName=req.body.listName;
    if(listName=="Today"){
        Item.findByIdAndRemove(checked,function(err){
            if(err)
            console.log(err);
            else  {
                res.redirect("/");
            console.log("Suucessfully deleted!")}
        });
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checked}}},function(err,foundList){
            if(!err)
            res.redirect("/"+listName);
        });
    }
});

app.get("/:customListName",function(req,res){
    const customListName= _.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            console.log(foundList);
            if(!foundList)
            {
                const list=new List({
                    name:customListName,
                    items:defitem
                 });
                 list.save();
            }
            else{
              res.render("index",{kindofDay:foundList.name,newListitems:foundList.items})
            }
        }

    });
//console.log(req.params.customListName);
});

app.listen(process.env.PORT||7000,function(){
    console.log("Server is runing on port 7000.");
});  
