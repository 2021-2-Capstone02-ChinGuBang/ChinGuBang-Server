import express from "express";
import { sequelize } from "./models";
import router from "./router";

const app = express();

sequelize.sync({ force: false }).catch((error) => {
  console.error(error);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router); //라우터
// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

app
  .listen(process.env.PORT, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${process.env.PORT} 🛡️
    ################################################
  `);
    sequelize
      // .sync({ alter: true })
      .authenticate()
      .then(async () => {
        console.log("MySQL Connected ...");
      })
      .catch((err) => {
        console.log("TT : ", err);
      });
  })
  .on("error", (error) => {
    console.error(error);
    process.exit(1);
  });
