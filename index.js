const { buildResp } = require('./src/helpers/response.helper');

require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

//  Connect to MongoDB
mongoose
    .connect(process.env.DB_URI, mongoOptions)
    .then(() => {
        // Run server right after DB connected
        console.log("Database connected 🎉");
        const app = express();
        const port = 3000;

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        app.use('/api/v1/users', require('./src/routes/user.route'));
        app.use('/api/v1/categories', require('./src/routes/category.route'));

        app.get('/', (req, res) => {
            let response = buildResp(200, "This API works ! 🎉🎉", [], []);
            res.send(response);
        });

        app.listen(port, (err) => {
            if (err) error.exit(1);
            console.log(`Server is up and running on port ${port} 🚀`);
        });
    })
    .catch(err => {
        // In case error connecting to DB
        console.log(err);
    });

