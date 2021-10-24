import express from "express";
const app = express();
import config from "./config";
import cors from "cors";
import { sequelize } from "./models";
import router from "./router";
import path from "path";
// Connect Database
connectDB();

app.use(express.urlencoded());
app.use(express.json());

// Define Routes
app.use("/api/v1/user", require("./api/user"));
app.use("/api/v1/group", require("./api/group"));
app.use("/api/v1/schedule", require("./api/schedule"));


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app
    .listen(5000, () => {
        console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
    })
    .on("error", (err) => {
        console.error(err);
        process.exit(1);
    });