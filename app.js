var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const _ = require('lodash');

require('./config/config');

var routes = require('./routes/index');

var crawler = require('./crawler/index');
var scrapper = require('./scrapper/index')

//var users = require('./routes/users');

var { mongoose } = require('./db/mongoose');

var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var Page = require('./models/page');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        licenza: req.body.licenza,
        tipologia: req.body.tipologia,
        scuola: req.body.scuola,
        language: req.body.language,
        materia: req.body.materia,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});



// app.post('/pages', authenticate, (req, res) => {


// });

//app.post('/todos', authenticate, (req, res) => {


app.post('/pages', (req, res) => {
    var page = new Page({
        //text: req.body.text,
        titolo: req.body.titolo,
        //_creator: req.user._id
    });

    page.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//app.get('/todos', authenticate, (req, res) => {
app.get('/todos', (req, res) => {
    Todo.find({
        //_creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/pages', authenticate, (req, res) => {
    Page.find({
        _creator: req.user._id
    }).then((pages) => {
        res.send({ pages });
    }, (e) => {
        res.status(400).send(e);
    });
});

//app.get('/pages/:id', authenticate, (req, res) => {
app.get('/pages/:id', (req, res) => {
    var id = req.params.id;

    // if (!ObjectID.isValid(id)) {
    //     return res.status(404).send();
    // };

    Page.findOne({
        _id: id,
        //_creator: req.user._id
    }).then((page) => {
        if (!page) {
            return res.status(404).send();
        }

        res.send({ page });

    }).catch((e) => {
        res.status(400).send();
        //Intenzionalmente non metto err possono esserci dati utente
    })
});

app.delete('/pages/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    Page.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((page) => {
        if (!page) {
            return res.status(404).send();
        }

        res.send({ page });

    }).catch((e) => {
        res.status(400).send()
    })
});

app.patch('/pages/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Page.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, { $set: body }, { new: true }).then((page) => {
        if (!page) {
            return res.status(404).send();
        }

        res.send({ page })
    }).catch((e) => {
        res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };

//module.exports = app;