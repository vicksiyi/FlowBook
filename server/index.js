const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const Test = require('./routes/test');
const Oauth = require('./routes/oauth');
const Bookrack = require('./routes/bookrack');
const Person = require('./routes/manage/person');
const Location = require('./routes/manage/location');
const Type = require('./routes/manage/type');

// // 使用body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/userPassport')(passport);
app.use('/api/test', Test);
app.use('/api/oauth', Oauth);
app.use('/api/bookrack', Bookrack);
app.use('/api/manage/person', Person);
app.use('/api/manage/location', Location);
app.use('/api/manage/type', Type);

app.listen(5000, () => {
    console.log('the server port running');
});