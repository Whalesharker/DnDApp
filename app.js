var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");
const axios = require('axios');
const auth = require('./routes/auth');
const session = require("express-session"); 
const MongoDBStore = require('connect-mongodb-session')(session);

// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //
const courses = require('./public/data/courses20-21.json')

// *********************************************************** //
//  Loading models
// *********************************************************** //



// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
//const mongodb_URI = process.env.mongodb_URI;
//const mongodb_URI = 'mongodb://localhost:27017/cs103a_todo'
//const mongodb_URI = 'mongodb+srv://cs_sj:BrandeisSpr22@cluster0.kgugl.mongodb.net/IanErickson?retryWrites=true&w=majority'
//This is the URI for the mongoDB compass app.
const mongodb_URI = 'mongodb+srv://Sheetmaker:datamcdatabaseface@dndcluster.qbo62.mongodb.net/test'
//TODO: Go back to the leactures and see what they did on the 6/30 lecture to hide the URL.
mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
//mongoose.set('useFindAndModify', false); 
//mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: Oh no, everybody panic! AAAAAAH'));
db.once('open', function() {console.log("we are connected!!!")});

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}
/*
  Load MongoDB models 
*/
const ToDoItem = require('./models/ToDoItem');
const Contact = require('./models/Contact');
const Schedule = require('./models/Schedule');
const Course = require('./models/Course')
const Spell_List = require('./models/Spell_List');
const Spell = require('./models/Spell');
const Character = require('./models/Character');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cloudData = require('./routes/cloudData');
const exam5 = require('./routes/exam5');


var app = express();

var store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret 7f89a789789as789f73j2krklfdslu89fdsjklfds',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts);
app.use(auth);
app.use(cloudData);
app.use(exam5);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/apidemo/:email',
  async (req,res,next) => {
    const email = req.params.email;
    const response = await axios.get('https://www.cs.brandeis.edu/~tim/cs103aSpr22/courses20-21.json')
    console.dir(response.data.length)
    res.locals.courses = response.data.filter((c) => c.instructor[2]==email+"@brandeis.edu")
    res.render('showCourses')
    //res.json(response.data.slice(100,105));
  })

app.get('/githubInfo/:githubID',
  async (req,res,next) => {
    const id = req.params.githubId;
    const response = await axios.get('https://api.github.com/users/'+id+'/repos')
    console.dir(response.data.length)
    res.locals.repos = response.data
    res.render('showRepos')
    //res.json(response.data.slice(100,105));
  })

app.get('/meals',
async (req,res,next) => {
  res.render('meals')
})

app.post('/meals',
async (req,res,next) => {
  const {ingredient} = req.body;
  const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?i='+ingredient)
  res.locals.meals = response.data.meals || []
  //Null is a false value, so that or statement will make recipes null if response.data.meals doesn't have anything. 
  res.locals.ingredient = ingredient
  res.render('showMeals')
})

app.get('/showIngredients',
  async (req,res,next) => {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    res.locals.repos = response.data.meals
    res.render('showIngredients')
  }
)
app.post('/showIngredients',
async (req,res,next) => {
  const {ingredient} = req.body;
  const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?i='+ingredient)
  res.locals.meals = response.data.meals || []
  //Null is a false value, so that or statement will make recipes null if response.data.meals doesn't have anything. 
  res.locals.ingredient = ingredient
  res.render('showMeals')
})

app.get('/uploadDB',
  async (req,res,next) => {
    await Course.deleteMany({});
    await Course.insertMany(courses);

    const num = await Course.find({}).count();
    res.send("data uploaded: "+num)
  }
)
app.get("/spellSearch",
  (req, res, next) => {
    res.render('spellSearch')
  }
)


app.post('/spellSearch',
async (req,res,next) => {
  const search = req.body.search;
  const response = await axios.get("https://www.dnd5eapi.co/api/spells/")
  var allSpells = response.data.results
  res.locals.search = search
  //Code below gotten and edited from https://stackoverflow.com/questions/10679580/javascript-search-inside-a-json-object
  //results is a list of spells from the API that match the search.
  var results = [];
  var searchVal = search;
  for (var i=0 ; i < allSpells.length ; i++)
  {
    //Iterates through all spells in the API and adds those that have a name that includes the search in the results list.
    if (allSpells[i].name.toLowerCase().includes(searchVal.toLowerCase())) {
        results.push(allSpells[i]);
    }
  }
  //Passes results to spellSearchResults
  res.locals.results = results
  //end of code taken from stack overflow.
  res.render('spellSearchResults')
})

app.get('/addSpell/:spell_id',
   isLoggedIn,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
   async (req,res,next) => {
    try {
      const spellItem = 
         new Spell_List(
          {
            userid:res.locals.user._id,
            spellIndex:req.params.spell_id,
            //username:res.locals.user.username
            spellID:req.params.spell_id,
            
          }
          )
      await spellItem.save();
      res.redirect('/spellSearch')
    }catch(e) {
      next(e)
    }
   }
)
app.get('/showSpellList',
  isLoggedIn,
  async (req,res,next) => {
    try{
      //console.log('1')
      const spells = 
         await Spell_List.find({userId:res.locals.user.id})
             .populate('spellID');
             //console.log('2')
      res.json(spells);
      res.locals.spells = spells;
      res.render('showSpellList')

    }catch(e){
      next(e);
    }
  }
)



app.get('/addCourse/:courseId',
   isLoggedIn,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
   async (req,res,next) => {
    try {
      const schedItem = 
         new Schedule(
          {
            userid:res.locals.user._id,
            courseId:req.params.courseId}
          )
      await schedItem.save();
      res.redirect('/coursesBySubject')
    }catch(e) {
      next(e)
    }
   }
)

app.get('/showSchedule',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const courses = 
         await Schedule.find({userId:res.locals.user.id})
             .populate('courseId');
      //res.json(courses);
      res.locals.courses = courses;
      res.render('showmyschedule')

    }catch(e){
      next(e);
    }
  }
)

app.get('/deleteFromSchedule/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        await Schedule.deleteOne({_id:itemId});
        res.redirect('/showSchedule');
      } catch(e){
        next(e);
      }
    }
)

app.get('/coursesBySubject',
  isLoggedIn,
  async (req,res,next) => {
    res.locals.courses =[]
    console.log('rendering coursesBySubject')
    const scheduledCourses = 
    await Schedule.find({userId:res.locals.user.id});
    res.locals.schedIds = 
      scheduledCourses.map(x => {
        let y = x.courseId.valueOf();
        console.log(y); console.log(typeof y);
        return y+"";
      });
    res.render('coursesBySubject')
  }
)

app.post('/coursesBySubject',
  async (req,res,next) => {
    try{
      const subject = req.body.subject;
      const term = req.body.term;
      const data = await Course.find({
        subject:subject,
        term:term, 
        enrolled:{$gt:10}
        //{$gt: 0} means find items where the specified field is greater than 0.

      })
              //.select("subject coursenum name enrolled term")
              //.select would be if I only want to pull certain parameters.
               .sort({enrolled:-1})
      //res.json(data); 
      const scheduledCourses = 
         await Schedule.find({userId:res.locals.user.id});
      res.locals.schedIds = 
         scheduledCourses.map(x => x.courseId);
      res.locals.courses = data;
      res.render('coursesBySubject');

    }catch(e){
      next(e)
    }
  }
)	
app.get('/todo', (req,res,next) => res.render('todo'))

app.post('/todo',
  isLoggedIn,
  async (req,res,next) => {
    try {
      const desc = req.body.desc;
      const todoObj = {
        userId:res.locals.user._id,
        descr:desc,
        completed:false,
        createdAt: new Date(),
      }
      const todoItem = new ToDoItem(todoObj); // create ORM object for item
      await todoItem.save();  // stores it in the database
      res.redirect('/showTodoList');


    }catch(err){
      next(err);
    }
  }
)

app.get('/showTodoList',
        isLoggedIn,
  async (req,res,next) => {
   try {
    const todoitems = await ToDoItem.find({userId:res.locals.user._id});

    res.locals.todoitems = todoitems
    res.render('showToDoList')
    //res.json(todoitems);
   }catch(e){
    next(e);
   }
  }
)
app.get('/toggleToDoItem/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        const item = await ToDoItem.findOne({_id:itemId});
        item.completed = ! item.completed;
        await item.save();
        res.redirect('/showTodoList');
      } catch(e){
        next(e);
      } 
    }
)

app.get('/deleteToDoItem/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        await ToDoItem.deleteOne({_id:itemId});
        res.redirect('/showTodoList');
      } catch(e){
        next(e);
      }
    }
)
app.get('/createCharacter',
  isLoggedIn,
  async (req,res,next) => {
    const equipment = await axios.get('https://www.dnd5eapi.co/api/equipment')
    const classes = await axios.get('https://www.dnd5eapi.co/api/classes')
    const feats = await axios.get('https://www.dnd5eapi.co/api/feats')
    const races = await axios.get('https://www.dnd5eapi.co/api/races')
    //const backgrounds = await axios.get('https://www.dnd5eapi.co/api/backgrounds')
    //The API seems to only have acolyte as an option for backgrounds, so for now I'm just not gonna include that.
    res.locals.equipment = equipment.data.results
    res.locals.classes = classes.data.results
    res.locals.feats = feats.data.results
    res.locals.races = races.data.results
    res.render('createCharacter')
  }
)

app.post('/createCharacter',
async (req,res,next) => {
  const {name, characterclass, level, race, backstory,str,dex,con,int,wis,cha} = req.body;
  try {
    const character = 
       new Character(
        {
          userid:res.locals.user._id,
          name:name,
          class:characterclass,
          level:level,
          race:race,
          backstory:backstory,
          str:str,
          dex:dex,
          con:con,
          int:int,
          wis:wis,
          cha:cha,
        }
        )
    await character.save();
    res.redirect('/showCharacter')
  }catch(e) {
    next(e)
  }
}
)
app.get('/showCharacter',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const usercharacter = 
         await Character.find({userId:res.locals.user.id})
      res.locals.character = usercharacter;
      console.log("Is there a character object here?")
      console.log(usercharacter)
      res.render('showCharacter')

    }catch(e){
      next(e);
    }
  }
)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
