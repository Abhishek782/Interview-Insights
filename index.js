const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv').config();
const PORT = 5000 || process.env.PORT;
const hbs = require('hbs');
const Article = require('./models/article')
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const homeRouter = require('./routes/home');
const interviewRouter = require('./routes/interview');
const adminRouter = require('./routes/admin');
const developerRouter = require('./routes/developers')
const cookieParser = require('cookie-parser');
const path = require('path');

const { checkUser } = require('./middleware/authMiddleware');
const uploadRouter = require('./routes/uploads')
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})


app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials/');
app.use(express.static(path.join(__dirname, './public/')));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.get('*', checkUser);

app.use('/articles', articleRouter);
app.use('/user', userRouter);
app.use('/request', requestRouter);
app.use('/uploads', uploadRouter);
app.use('/home', homeRouter);
app.use('/interview', interviewRouter);
app.use('/admin', adminRouter);
app.use('/developers', developerRouter);



app.get('/', async (req, res) => {
    res.render('welcome/welcome');
})


app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
})