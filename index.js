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
    res.render('index.ejs', {
    });
})
app.get('/', islogedin, (req, res) => {
    res.render('index.ejs', {
    });
})
app.get('/', (req, res) => {
    res.render('login.ejs', {
        upp: ""
    });
})
app.get('/login', (req, res) => {
    res.render('login.ejs', {
        upp: ""
    });
})
app.post('/', async (req, res) => {
    const { username, password } = req.body;
    req.session.regenerate(async function (err) {
        if (err) next(err)
    try {
        if(password == '' || username == ''){
        res.render('login.ejs', {
            upp: "Username and/or password can't be empty",
        });
        }else{
        let getPass = await getspesUsers(username);
        let dbPass = getPass[0].password;
        let dbAdmin = getPass[0].admin;
        if(password === dbPass && dbAdmin === true){
            req.session.admin = getPass[0].admin
            req.session.save(function (err) {
                if (err) return next(err)
            res.render('admin.ejs', {
            });
            })
        }else if(password === dbPass && dbAdmin === false){
            req.session.username = req.body.username;
            req.session.save(function (err) {
                if (err) return next(err)
            res.render('index.ejs', {
            });
            })
        }
        }
    } catch (error) {
        console.log(error);
    }
})
});
app.get('/logout', function (req, res, next) {
    // logout logic
  
    // clear the user from the session object and save.
    req.session.username = null
    req.session.save(function (err) {
      if (err) next(err)
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err)
        res.redirect('/')
      })
    })
})
app.get('/signup', (req, res) => {  
    res.render('signup.ejs', {
        us: "",
    });    
})
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    let CUN = await getspesUsers(username);
    if(CUN[0] == null && password != '' && username != ''){
        try {
            await prismaCreateUser(username, password, false);
            res.render('login.ejs', {
                upp: ""
            });    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }else if(CUN[0] != null){
        res.render('signup.ejs', {
            us: "Username is taken",
        });    
    }else if(password == '' || username == ''){
        res.render('signup.ejs', {
            us: "Username and/or password can't be empty",
        });    
    }
});
app.get('/changePassword', (req, res) => {  
    res.render('changePassword.ejs', {
        us: "",
    });    
})
app.post('/changePassword', async (req, res) => {
    const { usern, pass } = req.body;
    let oldPass = await getspesUsers(usern);
    if(oldPass[0] != null && pass != ''){
        try {
            changes = {password:pass, admin:false}
            await prismaEditUser(usern, changes);
            res.render('login.ejs', {
                upp: ""
            });    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }else{
        res.render('changePassword.ejs', {
            us: "Password can't be empty",
        });    
    }
});
app.get('/admin', (req, res) => {  
    res.render('signup.ejs', {
    });    
})
app.post('/admin', async (req, res) => {  
let { usern, pass, adm } = req.body;
let oldPass = await getspesUsers(usern);
if(oldPass[0] != null && pass != '' && adm !== undefined){
    adm = Boolean(Number(adm));
    try {
        changes = {password:pass, admin:adm}
        await prismaEditUser(usern, changes);
        res.render('admin.ejs', {
        });    
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}else if(oldPass[0] != null && adm != undefined){
    adm = Boolean(Number(adm));
    try {
        changes = {admin:adm}
        await prismaEditUser(usern, changes);
        res.render('admin.ejs', {
        });    
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}else if(oldPass[0] != null && pass != ''){
    try {
        changes = {password:pass}
        await prismaEditUser(usern, changes);
        res.render('admin.ejs', {
        });    
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}else{
    res.render('admin.ejs', {
    });    
}
})

app.post('/blog', upload.single('img'), async (req, res) => {
    const { title, content, author } = req.body;
    const img = req.file ? req.file.filename : null;
    let id = await getspesUsers(author);
    authorid = id[0].id;
    try {
        await prismaCreatePost(title, content, authorid, img);
        res.render('admin.ejs', {
        });
    } catch (error) {
        console.log(error)
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