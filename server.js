require('dotenv').config();
const port = 3000;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Process ENV 
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectei à base de dados.')
        app.emit('ready');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes')
const path = require('path');
const helmet = require('helmet');
// const csrf = require('csurf');
const { middlewareGlobal } = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'dsadsadkamsdaskdoasdiujwqhneujac',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);

app.use(flash());

// Caminhos dos viwes
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// app.use(csrf());
// Middlewares globais
app.use(middlewareGlobal);
// app.use(checkCsrfError);
// app.use(csrfMiddleware);
app.use(routes);

// Promise p/ conexão com banco de dados
app.on('ready', () => {
    app.listen(port, () => {
        console.log(`Servidor executando na porta: ${port}.`);
    });
});
