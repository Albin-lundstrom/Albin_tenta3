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
const { prismaDeletePost } = require('./js/removePost');
const { prismaEditPost } = require('./js/editPost')
const { getPosts } = require('./js/getPosts');

// Setting upp session and ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// setting upp bodyParser and multer
app.use(bodyParser.urlencoded({ extended : true })); 
app.use(express.static(__dirname));
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'img/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

// Setting upp the session functions
const isAuthenticated = (req, res, next) => {
    if (req.session.admin === true) next()
    else next('route')
}
const islogedin = (req, res, next) => {
    if (req.session.username != null) next()
    else next('route')
}

// all the paths
    // all the check to go into index and how to send to the login
app.get('/', isAuthenticated, async (req, res) => {
    getPosts().then((res) => users(res));
        const users = async (admin) => {
        let data = await getspesUsers(req.session.username);
        for(var i = 0; i < admin.length; i++){
            date = new Date(admin[i].createdAt)
            let Newdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            admin[i].createdAt = Newdate;
        }
        res.render('index.ejs', {
            data: data,
            user: admin
    });
}});
app.get('/', islogedin, (req, res) => {
    getPosts().then((res) => users(res));
        const users = async (admin) => {
        let data = await getspesUsers(req.session.username);
        for(var i = 0; i < admin.length; i++){
            date = new Date(admin[i].createdAt)
            let Newdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            admin[i].createdAt = Newdate;
        }
        res.render('index.ejs', {
            data: data,
            user: admin
    });
}});
app.get('/login', (req, res) => {
    res.render('login.ejs', {
        upp: ""
    });
});
    // the post for login to sett upp session and get to index
app.post('/', async (req, res) => {
    const { username, password } = req.body;
    req.session.regenerate(async function (err) {
        if (err) next(err)
    try {
            // if somehow the post get sent with empty values
        if(password == '' || username == ''){
        res.render('login.ejs', {
            upp: "Username and/or password can't be empty",
        });
        }else{
        let getPass = await getspesUsers(username);
        let dbPass = getPass[0].password;
        let dbAdmin = getPass[0].admin;
            // if statments to check if user is admin or not and the password is correct or not
        if(password === dbPass && dbAdmin === true){
            req.session.username = getPass[0].username
            req.session.admin = getPass[0].admin
            req.session.save(async function (err) {
                if (err) return next(err)
                getPosts().then((res) => users(res));
                const users = async (admin) => {
                let data = await getspesUsers(req.session.username);
                for(var i = 0; i < admin.length; i++){
                    date = new Date(admin[i].createdAt)
                    let Newdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
                    admin[i].createdAt = Newdate;
                }
                    // redirect you to index
                res.render('index.ejs', {
                    data: data,
                    user: admin,
                });
            }})
        }else if(password === dbPass && dbAdmin === false){
            req.session.username = req.body.username;
            req.session.save(function (err) {
                if (err) return next(err)
                getPosts().then((res) => users(res));
                const users = async (admin) => {
                let data = await getspesUsers(req.session.username);
                for(var i = 0; i < admin.length; i++){
                    date = new Date(admin[i].createdAt)
                    let Newdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
                    admin[i].createdAt = Newdate;
                }
                res.render('index.ejs', {
                    data: data,
                    user: admin
                });
            }})
        }else if(password !== dbPass){
            res.render('login.ejs', {
                upp: "Username and/or password is wrong",
            });
        }}
    } catch (error) {
        console.log(error);
    }
})
});
    // Logout function
app.get('/logout', function (req, res, next) {
    // logout function
  
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
});
app.get('/signup', (req, res) => {  
    res.render('signup.ejs', {
        us: "",
    });    
});
    // singup post, creates a user with admin false
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    let CUN = await getspesUsers(username);
        // if the user don't not exit then create user
    if(CUN[0] == null && password != '' && username != ''){
        try {
            await prismaCreateUser(username, password, false);
            res.render('login.ejs', {
                upp: ""
            });    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }else if(CUN[0] != null){ // if the username is taken 
        res.render('signup.ejs', {
            us: "Username is taken",
        });    
    }else if(password == '' || username == ''){ // if the values are somehow empty
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
    // change password post
app.post('/changePassword', async (req, res) => {
    const { usern, pass } = req.body;
    let oldPass = await getspesUsers(usern);
    if(oldPass[0] != null && pass != ''){ // if the user exist and the password isn't empty then change the password
        try {
            changes = {password:pass, admin:false}
            await prismaEditUser(usern, changes);
            res.render('login.ejs', {
                upp: ""
            });    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }else{ // if the value is somehow empty
        res.render('changePassword.ejs', {
            us: "Password can't be empty",
        });    
    }
});
    // admin site if the user is a admin
app.get('/admin', isAuthenticated, async(req, res) => {  
    let data = await getspesUsers(req.session.username);
    res.render('admin.ejs', {
        data: data
    });
});
    // Change a user into a admin post and change password
app.post('/admin', async (req, res) => {  
    let { usern, pass, adm } = req.body;
    let oldPass = await getspesUsers(usern);
        // get the old user and check if they exist 
    if(oldPass[0] != null && pass != '' && adm !== undefined){ // if the user exist and the admin value + password field is not empty
        adm = Boolean(Number(adm));
        try {
            changes = {password:pass, admin:adm}
            await prismaEditUser(usern, changes);
            let data = await getspesUsers(req.session.username);
            res.render('admin.ejs', {
                data: data
            });    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }else if(oldPass[0] != null && adm != undefined){  // if the user exist and the admin value is not empty
        adm = Boolean(Number(adm));
        try {
            changes = {admin:adm}
            await prismaEditUser(usern, changes);
            let data = await getspesUsers(req.session.username);
            res.render('admin.ejs', {
                data: data
            });    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }else if(oldPass[0] != null && pass != ''){ // if the user exist and the password value is not empty
        try {
            changes = {password:pass}
            await prismaEditUser(usern, changes);
            let data = await getspesUsers(req.session.username);
            res.render('admin.ejs', {
                data: data
            });    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }else{ // else just reload the page
        let data = await getspesUsers(req.session.username);
        res.render('admin.ejs', {
            data: data
        });    
    }
});
    // Create a blog post 
app.post('/blog', upload.single('img'), async (req, res) => {
        // Get all the data and upload the img
    const { title, content, author, clickbait } = req.body; 
    const img = req.file ? req.file.filename : null;
    try {
        await prismaCreatePost(title, content, author, img, clickbait);
        let data = await getspesUsers(req.session.username);
        res.render('admin.ejs', {
            data: data
        });
    } catch (error) {
        console.log(error)
    }
});
    // redirect from blog to admin
app.get('/blog', async(req, res) => {  
    res.redirect('admin');
});
    // The blogs site
app.get('/blogpost:id', islogedin || isAuthenticated, async (req, res) => { 
    getPosts().then((res) => users(res));
    const clientUrl = req.hostname + req.originalUrl;
    cilentPath = clientUrl
    let index = Number(cilentPath.slice(18));
    const users = async (admin) => {
        let data = await getspesUsers(req.session.username);
        for(var i = 0; i < admin.length; i++){
            date = new Date(admin[i].createdAt)
            let Newdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            admin[i].createdAt = Newdate;
        }
        res.render('blogpost.ejs', {
            data: data,
            user: admin,
            i: index
        });    
}});
    // Delete the selected blog only if user is admin
app.get('/delete:id', isAuthenticated, async (req, res) => {
    const clientUrl = req.hostname + req.originalUrl;
    cilentPath = clientUrl
    let index = Number(cilentPath.slice(16));
    getPosts().then((res) => users(res));
    const users = async (admin) => {
    await prismaDeletePost(admin[index].id);
    res.redirect('/');
}});
    // Edit site for admin
app.get('/edit:id', isAuthenticated, async (req, res) => { 
        getPosts().then((res) => users(res));
        const clientUrl = req.hostname + req.originalUrl;
        cilentPath = clientUrl
        let index = Number(cilentPath.slice(14));
        const users = async (admin) => {
        let data = await getspesUsers(req.session.username);
        for(var i = 0; i < admin.length; i++){
            date = new Date(admin[i].createdAt)
            let Newdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            admin[i].createdAt = Newdate;
        }
        res.render('edit.ejs', {
            data: data,
            user: admin,
            i: index
        });    
}});
    // Post for edit
app.post('/edit:id', upload.single('img'), async (req, res) => {
        // get data and upload img
    const { title, content, author, clickbait } = req.body;
    const img = req.file ? req.file.filename : null;
    try {
            // Gets the url and makes it into a index
        const clientUrl = req.hostname + req.originalUrl;
        cilentPath = clientUrl
        let index = Number(cilentPath.slice(14));
        getPosts().then((res) => users(res));
        const users = async (admin) => {
        let data = await getspesUsers(req.session.username);
            date = new Date(admin[index].createdAt)
            let Newdate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            admin[index].createdAt = Newdate
                // if the img is not changed don't change it
            if(img === null){
            let changes = { title:title, content:content, authorId:author, clickbait:clickbait }
            await prismaEditPost(admin[index].id, changes);
        }else{ // otherwise change it
            let changes = { title:title, content:content, authorId:author, clickbait:clickbait, img:img}
            await prismaEditPost(admin[index].id, changes);
        }
        res.render('edit.ejs', {
            i: index,
            data: data,
            user: admin
        });
    }} catch (error) {
        console.log(error)
    }
});
// all the path that send you to login if you are not loged in
app.get('/', (req, res) => {
    res.render('login.ejs', {
        upp: ""
    });
});
app.get('/edit:id', (req, res) => {
    res.render('login.ejs', {
        upp: ""
    });
});
app.get('/admin', (req, res) => {
    res.render('login.ejs', {
        upp: ""
    });
});
app.get('/blogpost:id', (req, res) => {
    res.render('login.ejs', {
        upp: ""
    });
});
 server = app.listen(8000, () => {  
    var host = server.address().address  
    var port = server.address().port  
    console.log("Example app listening at http://%s:%s", host, port)  
});