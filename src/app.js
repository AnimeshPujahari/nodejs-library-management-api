const express = require('express');
require('./database/db');

//Routes
const bookRouter = require('./routes/book');
const studentRouter = require('./routes/student');
const adminRouter = require('./routes/admins');
const teacherRouter = require('./routes/teacher');

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(bookRouter);
app.use(studentRouter);
app.use(adminRouter);
app.use(teacherRouter);

app.listen(port , () => {
    console.log('Server is up and running...');
})