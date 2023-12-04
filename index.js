express = require('express'); 
      app = express(); 
      bodyParser = require('body-parser');
const path = require('path');

// Functions for users
const { prismaCreateUser } = require('./js/createUser')
const { prismaEditUser } = require('./js/editUser')
const { getUsers } = require('./js/getUsers');

// Functions for posts
const { prismaCreatePost } = require('./js/createPost')
const { prismaEditPost } = require('./js/editPost')
const { getPosts } = require('./js/getPosts');


const url = require('url')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended : true })); 
app.use(express.static(__dirname));
const multer = require('multer');
const upload = multer({ dest: 'img/' });

app.get('/', function (req, res) {
    main().then((res) => test(res));
    const test = (data) => {
    res.render('index.ejs', {
        data: data,
    });
    }
})
app.get('/create', function (req, res) {  
    res.render('create.ejs', {
    }); 
})
app.post('/create', upload.single('img'), async (request, response) => {
    const { name, email, phone } = request.body;
    const img = request.file ? request.file.filename : null;
    try {
        const newUser = await prismaCreate(name, email, phone, img);

        res.render('create.ejs', {
        });    
    } catch (error) {
        response.status(500).send('Internal Server Error');
    }
});
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

var server = app.listen(8000, function () {  
    var host = server.address().address  
    var port = server.address().port  
    console.log("Example app listening at http://%s:%s", host, port)  
})