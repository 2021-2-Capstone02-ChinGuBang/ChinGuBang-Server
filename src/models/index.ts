import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "./User";
import Certification from "./Certification";
import Room from "./Room";
import RoomCondition from "./RoomCondition";
import RoomInformation from "./RoomInformation";
import RoomOption from "./RoomOption";
import RoomPhoto from "./RoomPhoto";
import Message from "./Message";
import MessageRoom from "./MessageRoom";
import Participant from "./Participant";
import Like from "./Like";
import Code from "./Code";
import RoomType from "./RoomType";
import RoomPeriod from "./RoomPeriod";
import RoomPrice from "./RoomPrice";
import University from "./University";

const db: any = {};

dotenv.config();

export const sequelize = new Sequelize(
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
  }
);

sequelize.addModels([
  User,
  Certification,
  Room,
  RoomInformation,
  RoomCondition,
  RoomPhoto,
  RoomOption,
  Like,
  Message,
  MessageRoom,
  Participant,
  Code,
  RoomType,
  RoomPeriod,
  RoomPrice,
  University,
]);

export {
  User,
  Certification,
  Room,
  RoomInformation,
  RoomCondition,
  RoomPhoto,
  RoomOption,
  Like,
  Message,
  MessageRoom,
  Participant,
  Code,
  RoomType,
  RoomPeriod,
  RoomPrice,
  University,
};

export default sequelize;
