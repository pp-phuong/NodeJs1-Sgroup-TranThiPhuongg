const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash-plus');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { sessionModules } = require('./config/session');

const adminRouter = require('./routes/admin');
const clientRouter = require('./routes/client');

const PORT = process.env.PORT || 3000;
const app = express();
const http = require('http').Server(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('serect'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    methodOverride((req, res) => {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            const method = req.body._method;
            delete req.body._method;
            return method;
        }
    }),
);

app.set('trust proxy', 1); // trust first proxy
app.use(sessionModules);
app.use(flash());
app.use('/admin', adminRouter);
app.use('/', clientRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

http.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});

module.exports = app;
