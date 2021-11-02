"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
models_1.sequelize.sync({ force: false }).catch((error) => {
    console.error(error);
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/", router_1.default); //라우터
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
    models_1.sequelize
        // .sync({ alter: true })
        .authenticate()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("MySQL Connected ...");
    }))
        .catch((err) => {
        console.log("TT : ", err);
    });
})
    .on("error", (error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map