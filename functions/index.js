const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const createRoute = require("./users/createUser");
const updateRoute = require("./users/updateUser");
const deleteRoute = require("./users/deleteUser");
const getRoute = require("./users/getUser");

const app = express();
app.use(cors({origin: true}));
app.use("/api", createRoute);
app.use("/api", updateRoute);
app.use("/api", deleteRoute);
app.use("/api", getRoute);
exports.app = functions.https.onRequest(app);
