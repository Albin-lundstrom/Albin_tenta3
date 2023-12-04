// Sätta upp modulrés
express = require('express'); 
      app = express(); 
      bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session')

// Functions for users
const { prismaCreateUser } = require('./js/createUser')
const { prismaEditUser } = require('./js/editUser')
const { getUsers } = require('./js/getUsers');
const { getspesUsers } = require('./js/getSpesUser');


// Functions for posts
const { prismaCreatePost } = require('./js/createPost')
const { prismaEditPost } = require('./js/editPost')
const { getPosts } = require('./js/getPosts');


const url = require('url')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended : true })); 
app.use(express.static(__dirname));
const multer = require('multer');
const upload = multer({ dest: 'img/' });

const isAuthenticated = (req, res, next) => {
    if (req.session.admin === true) next()
    else next('route')
}
const islogedin = (req, res, next) => {
    if (req.session.username != null) next()
    else next('route')
}
  


app.get('/', isAuthenticated, (req, res) => {
    res.render('admin.ejs', {
    });
})
app.get('/', islogedin, (req, res) => {
    res.render('index.ejs', {
    });
})
app.get('/', (req, res) => {
    res.render('login.ejs', {
    });
})
app.post('/', async (req, res) => {
    const { username, password } = req.body;
    req.session.regenerate(async function (err) {
        if (err) next(err)
    try {
        let getPass = await getspesUsers(username);
        req.session.username = req.body.username;
        dbPass = getPass[0].password;
        dbAdmin = getPass[0].admin;
        if(password === dbPass && dbAdmin === true){
            req.session.admin = getPass[0].admin
            req.session.save(function (err) {
                if (err) return next(err)
            res.render('admin.ejs', {
            });
            })
        }else if(password === dbPass && dbAdmin === false){
            req.session.save(function (err) {
                if (err) return next(err)
            res.render('index.ejs', {
            });
            })
        }else{
            res.render('login.ejs', {
            });
        }
            
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})
});
app.get('/create', (req, res) => {  
    res.render('create.ejs', {
    }); 
})
app.post('/create', upload.single('img'), async (req, res) => {
    const { name, email, phone } = req.body;
    const img = req.file ? req.file.filename : null;
    try {
        const newUser = await prismaCreate(name, email, phone, img);

        res.render('create.ejs', {
        });    
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

var server = app.listen(8000, () => {  
    var host = server.address().address  
    var port = server.address().port  
    console.log("Example app listening at http://%s:%s", host, port)  
})