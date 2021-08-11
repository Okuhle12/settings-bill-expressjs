const express = require("express")
const exphbs  = require("express-handlebars");
const SettingsBill = require("./settings-bill");
const bodyParser = require('body-parser')

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
  });
  

const app = express();

const settingsBill= SettingsBill();

app.engine('handlebars', handlebarSetup);
app.set("view engine", "handlebars");


app.use(express.static("public"));


// app.use(express.json()) //For JSON requests
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json()) //For JSON requests)
app.use(bodyParser.urlencoded({extended: false}));



app.get("/", function(req, res){
    res.render("index", {
        
    settings: settingsBill.getSettings(),
    totals: settingsBill.totals()
    
        
});
});

app.post("/settings", function(req, res){

     settingsBill.setSettings({
     callCost: req.body.callCost,
     smsCost: req.body.smsCost,
     warningLevel: req.body.warningLevel,
     criticalLevel: req.body.criticalLevel,
    })
    console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
    console.log(settingsBill.getSettings())
    res.redirect("/");   
});

app.post("/action", function(req, res){

settingsBill.recordAction(req.body.actionType),
res.redirect("/");

});

app.get("/actions", function(req, res){ 

  res.render("actions", {actions: settingsBill.actions()});



});

app.get("/actions/:type", function(req, res){
  const actionType = req.params.actionType;
  res.render("actions", {actions: settingsBill.actionsFor()});

});


const PORT = process.env.PORT || 3007

app.listen(PORT, function(){
console.log("App started at port:",PORT)
});