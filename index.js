const express = require('express')
const exphbs  = require('express-handlebars');
const SettingsBill = require('./settings-bill');
const bodyParser = require('body-parser')
const moment = require('moment'); 
moment().format(); 

const handlebarSetup = exphbs({
    partialsDir: './views/partials',
    viewPath: './views',
    layoutsDir: './views/layouts'
  });
  

const app = express();

const settingsBill= SettingsBill();

app.engine('handlebars', handlebarSetup);
app.set('view engine", "handlebars');


app.use(express.static('public'));


app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended: false}));



app.get('/', function(req, res){
    res.render('index', {
        
    settings: settingsBill.getSettings(),
    totals: settingsBill.totals(),
    addColor: settingsBill.addClasses()

        
});
});

app.post('/settings', function(req, res){

     settingsBill.setSettings({
     callCost: req.body.callCost,
     smsCost: req.body.smsCost,
     warningLevel: req.body.warningLevel,
     criticalLevel: req.body.criticalLevel,
    })
    res.redirect('/');   
});

app.post('/action', function(req, res){

settingsBill.recordAction(req.body.actionType),
res.redirect('/');

});


app.get('/actions', function(req, res){
  let actionsMade = settingsBill.actions();
  actionsMade.forEach(element => {
    
  element.recordTime = moment(element.timestamp).fromNow()
 
});

res.render('actions' , {actions: actionsMade});

});

app.get('/actions/:actionType', function(req, res){
const actionType = req.params.actionType;
const actionTypeMade = settingsBill.actionsFor(actionType);
actionTypeMade.forEach(element => {
  element.recordTime = moment(element.timestamp).fromNow()

});

res.render('actions', {actions: actionTypeMade});

});



const PORT = process.env.PORT || 3007

app.listen(PORT, function(){
console.log('App started at port:',PORT)
}); 