"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.University = exports.RoomPrice = exports.RoomPeriod = exports.RoomType = exports.Code = exports.Participant = exports.MessageRoom = exports.Message = exports.Like = exports.RoomOption = exports.RoomPhoto = exports.RoomCondition = exports.RoomInformation = exports.Room = exports.Certification = exports.User = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Certification_1 = __importDefault(require("./Certification"));
exports.Certification = Certification_1.default;
const Room_1 = __importDefault(require("./Room"));
exports.Room = Room_1.default;
const RoomCondition_1 = __importDefault(require("./RoomCondition"));
exports.RoomCondition = RoomCondition_1.default;
const RoomInformation_1 = __importDefault(require("./RoomInformation"));
exports.RoomInformation = RoomInformation_1.default;
const RoomOption_1 = __importDefault(require("./RoomOption"));
exports.RoomOption = RoomOption_1.default;
const RoomPhoto_1 = __importDefault(require("./RoomPhoto"));
exports.RoomPhoto = RoomPhoto_1.default;
const Message_1 = __importDefault(require("./Message"));
exports.Message = Message_1.default;
const MessageRoom_1 = __importDefault(require("./MessageRoom"));
exports.MessageRoom = MessageRoom_1.default;
const Participant_1 = __importDefault(require("./Participant"));
exports.Participant = Participant_1.default;
const Like_1 = __importDefault(require("./Like"));
exports.Like = Like_1.default;
const Code_1 = __importDefault(require("./Code"));
exports.Code = Code_1.default;
const RoomType_1 = __importDefault(require("./RoomType"));
exports.RoomType = RoomType_1.default;
const RoomPeriod_1 = __importDefault(require("./RoomPeriod"));
exports.RoomPeriod = RoomPeriod_1.default;
const RoomPrice_1 = __importDefault(require("./RoomPrice"));
exports.RoomPrice = RoomPrice_1.default;
const University_1 = __importDefault(require("./University"));
exports.University = University_1.default;
const db = {};
dotenv_1.default.config();
exports.sequelize = new sequelize_typescript_1.Sequelize(
// config.development.database,
// config.development.username,
// config.development.password,
{
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DBNAME,
    dialect: "mysql",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: false,
    timezone: "+09:00",
});
exports.sequelize.addModels([
    User_1.default,
    Certification_1.default,
    Room_1.default,
    RoomInformation_1.default,
    RoomCondition_1.default,
    RoomPhoto_1.default,
    RoomOption_1.default,
    Like_1.default,
    Message_1.default,
    MessageRoom_1.default,
    Participant_1.default,
    Code_1.default,
    RoomType_1.default,
    RoomPeriod_1.default,
    RoomPrice_1.default,
    University_1.default,
]);
exports.default = exports.sequelize;
//# sourceMappingURL=index.js.map