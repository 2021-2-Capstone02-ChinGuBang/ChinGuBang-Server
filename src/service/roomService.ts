// models
import {
  User,
  Certification,
  Room,
  RoomInformation,
  RoomCondition,
  RoomPhoto,
  RoomOption,
  RoomType,
  RoomPeriod,
  RoomPrice,
  Like,
  University,
  Participant,
} from "../models";
// DTO
import { roomDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { date, cast } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";
import { ConnectionTimedOutError, Op, QueryTypes, Sequelize } from "sequelize";

/**
 *  @방_내놓기
 *  @route Post /api/v1/room
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */

const POSTroomService = async (
  userID: number,
  reqData: roomDTO.postRoomReqDTO,
  url?
) => {
  const { type, price, information, rentPeriod, options, conditions } = reqData;

  // 1. 요청 바디 부족
  if (
    !type ||
    !price ||
    !information ||
    !rentPeriod ||
    !options ||
    !conditions
  ) {
    return -1;
  }
  const user = await User.findOne({ where: { userID } });
  // 2. 유저 id 잘못됨
  if (!user) {
    return -2;
  }
  // 3. 유저 권한 없음
  const certification = await Certification.findOne({ where: { userID } });
  if (!certification) {
    return -3;
  }
  // room 생성
  const newRoom = await Room.create({
    uploader: userID,
    university: certification.university,
  });
  await RoomType.create({
    roomID: newRoom.roomID,
    roomType: type.roomType,
    category: type.category,
    rentType: type.rentType,
  });
  await RoomInformation.create({
    roomID: newRoom.roomID,
    area: cast.stringToNumber(information.area),
    floor: cast.stringToNumber(information.floor),
    construction: cast.stringToNumber(information.construction),
    query: information.query,
    post: information.post,
    address: information.address,
    lat: information.lat,
    lng: information.lng,
    description: information.description,
  });
  await RoomPrice.create({
    roomID: newRoom.roomID,
    deposit: cast.stringToNumber(price.deposit),
    monthly: cast.stringToNumber(price.monthly),
    control: cast.stringToNumber(price.control),
  });
  await RoomPeriod.create({
    roomID: newRoom.roomID,
    startDate: date.stringToDate(rentPeriod.startDate),
    endDate: date.stringToDate(rentPeriod.endDate),
  });
  await RoomCondition.create({
    roomID: newRoom.roomID,
    gender: conditions.gender,
    smoking: conditions.smoking,
  });
  await RoomPhoto.create({
    roomID: newRoom.roomID,
    main: url.main,
    restroom: url.restroom,
    kitchen: url.kitchen,
    photo1: url.photo1,
    photo2: url.photo2,
  });
  await RoomOption.create({
    roomID: newRoom.roomID,
    bed: cast.stringToBoolean(options.bed),
    table: cast.stringToBoolean(options.table),
    chair: cast.stringToBoolean(options.chair),
    closet: cast.stringToBoolean(options.closet),
    airconditioner: cast.stringToBoolean(options.airconditioner),
    induction: cast.stringToBoolean(options.induction),
    refrigerator: cast.stringToBoolean(options.refrigerator),
    tv: cast.stringToBoolean(options.tv),
    microwave: cast.stringToBoolean(options.microwave),
    washingmachine: cast.stringToBoolean(options.washingmachine),
    cctv: cast.stringToBoolean(options.cctv),
    wifi: cast.stringToBoolean(options.wifi),
    parking: cast.stringToBoolean(options.parking),
    elevator: cast.stringToBoolean(options.elevator),
  });
  // table join
  const room = await Room.findOne({
    where: {
      roomID: newRoom.roomID,
    },
    include: [
      {
        model: User,
        attributes: ["userID", "nickname"],
      },
      {
        model: RoomType,
        attributes: ["roomType", "category", "rentType"],
      },
      {
        model: RoomPrice,
        attributes: ["deposit", "monthly", "control"],
      },
      {
        model: RoomInformation,
        attributes: [
          "area",
          "floor",
          "construction",
          "query",
          "post",
          "address",
          "lat",
          "lng",
          "description",
        ],
      },
      { model: RoomPeriod, attributes: ["startDate", "endDate"] },
      {
        model: RoomOption,
        attributes: [
          "bed",
          "table",
          "chair",
          "closet",
          "airconditioner",
          "induction",
          "refrigerator",
          "tv",
          "microwave",
          "washingmachine",
          "cctv",
          "wifi",
          "parking",
          "elevator",
        ],
      },
      {
        model: RoomCondition,
        attributes: ["gender", "smoking"],
      },
      {
        model: RoomPhoto,
        attributes: ["main", "restroom", "kitchen", "photo1", "photo2"],
      },
    ],
    attributes: ["roomID", "createdAt", "updatedAt", "isDeleted"],
  });
  const resData = room;
  // // data 형식에 맞게 변경
  // const resData: roomDTO.postRoomResDTO = {
  //   roomID: room.roomID,
  //   createdAt: room.createdAt,
  //   uploader: room.upl
  // };
  return resData;
};

/**
 *  @방_수정하기
 *  @route Post /api/v1/room/:roomID
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */

const PATCHroomService = async (
  userID: number,
  roomID: number,
  reqData: roomDTO.postRoomReqDTO,
  url?
) => {
  const { type, price, information, rentPeriod, options, conditions } = reqData;

  // 1. 요청 바디 부족
  if (
    !type ||
    !price ||
    !information ||
    !rentPeriod ||
    !options ||
    !conditions
  ) {
    return -1;
  }
  const user = await User.findOne({ where: { userID } });
  // 2. 유저 id 잘못됨
  if (!user) {
    return -2;
  }
  // 3. 유저 권한 없음
  const certification = await Certification.findOne({ where: { userID } });
  if (!certification) {
    return -3;
  }
  const alreadyRoom = await Room.findOne({
    where: { roomID, isDeleted: false },
  });
  if (alreadyRoom.uploader !== userID) return -3;

  await RoomType.update(
    {
      roomType: type.roomType,
      category: type.category,
      rentType: type.rentType,
    },
    { where: { roomID } }
  );

  await RoomInformation.update(
    {
      area: cast.stringToNumber(information.area),
      floor: cast.stringToNumber(information.floor),
      construction: cast.stringToNumber(information.construction),
      query: information.query,
      post: information.post,
      address: information.address,
      lat: information.lat,
      lng: information.lng,
      description: information.description,
    },
    { where: { roomID } }
  );

  await RoomPrice.update(
    {
      deposit: cast.stringToNumber(price.deposit),
      monthly: cast.stringToNumber(price.monthly),
      control: cast.stringToNumber(price.control),
    },
    { where: { roomID } }
  );

  await RoomPeriod.update(
    {
      startDate: date.stringToDate(rentPeriod.startDate),
      endDate: date.stringToDate(rentPeriod.endDate),
    },
    { where: { roomID } }
  );
  await RoomCondition.update(
    {
      gender: conditions.gender,
      smoking: conditions.smoking,
    },
    { where: { roomID } }
  );

  await RoomPhoto.update(
    {
      main: url.main,
      restroom: url.restroom,
      kitchen: url.kitchen,
      photo1: url.photo1,
      photo2: url.photo2,
    },
    { where: { roomID } }
  );

  await RoomOption.update(
    {
      bed: cast.stringToBoolean(options.bed),
      table: cast.stringToBoolean(options.table),
      chair: cast.stringToBoolean(options.chair),
      closet: cast.stringToBoolean(options.closet),
      airconditioner: cast.stringToBoolean(options.airconditioner),
      induction: cast.stringToBoolean(options.induction),
      refrigerator: cast.stringToBoolean(options.refrigerator),
      tv: cast.stringToBoolean(options.tv),
      microwave: cast.stringToBoolean(options.microwave),
      washingmachine: cast.stringToBoolean(options.washingmachine),
      cctv: cast.stringToBoolean(options.cctv),
      wifi: cast.stringToBoolean(options.wifi),
      parking: cast.stringToBoolean(options.parking),
      elevator: cast.stringToBoolean(options.elevator),
    },
    { where: { roomID } }
  );

  // table join
  const room = await Room.findOne({
    where: { roomID },
    include: [
      {
        model: User,
        attributes: ["userID", "nickname"],
      },
      {
        model: RoomType,
        attributes: ["roomType", "category", "rentType"],
      },
      {
        model: RoomPrice,
        attributes: ["deposit", "monthly", "control"],
      },
      {
        model: RoomInformation,
        attributes: [
          "area",
          "floor",
          "construction",
          "query",
          "post",
          "address",
          "lat",
          "lng",
          "description",
        ],
      },
      { model: RoomPeriod, attributes: ["startDate", "endDate"] },
      {
        model: RoomOption,
        attributes: [
          "bed",
          "table",
          "chair",
          "closet",
          "airconditioner",
          "induction",
          "refrigerator",
          "tv",
          "microwave",
          "washingmachine",
          "cctv",
          "wifi",
          "parking",
          "elevator",
        ],
      },
      {
        model: RoomCondition,
        attributes: ["gender", "smoking"],
      },
      {
        model: RoomPhoto,
        attributes: ["main", "restroom", "kitchen", "photo1", "photo2"],
      },
    ],
    attributes: ["roomID", "createdAt", "updatedAt", "isDeleted"],
  });
  const resData = room;
  // // data 형식에 맞게 변경
  // const resData: roomDTO.postRoomResDTO = {
  //   roomID: room.roomID,
  //   createdAt: room.createdAt,
  //   uploader: room.upl
  // };
  return resData;
};

/**
 *  @모든_방_보기
 *  @route GET api/v1/room
 *  @access private
 *  @error
 */

const GETallRoomService = async (userID: number) => {
  const userCertification = await Certification.findOne({ where: { userID } });
  const university = await userCertification.university;

  const rawRooms = await Room.findAll({
    order: [["createdAt", "DESC"]],
    where: { isDeleted: false, university },
    include: [
      {
        model: User,
        where: { isDeleted: false },
        attributes: [],
        required: true,
      },
      { model: RoomType, attributes: ["roomType", "category", "rentType"] },
      { model: RoomPrice, attributes: ["monthly", "deposit"] },
      { model: RoomPeriod, attributes: ["startDate", "endDate"] },
      { model: RoomInformation, attributes: ["area", "floor"] },
      { model: RoomPhoto, attributes: ["main"] },
      { model: Like, where: { userID, isLike: true }, required: false },
    ],
    attributes: ["roomID", "createdAt"],
  });

  const rooms = rawRooms.map((room) => {
    return {
      roomID: room.roomID,
      createdAt: date.dateToString(room.createdAt),
      type: room.type,
      price: room.price,
      rentPeriod: {
        startDate: date.dateToString(room.rentPeriod.startDate),
        endDate: date.dateToString(room.rentPeriod.endDate),
      },
      information: room.information,
      photo: room.photo,
      isLike: room.likes.length ? true : false,
    };
  });

  const totalRoomNum = await Room.count({
    where: { isDeleted: false, university },
  });
  const resData = { rooms, totalRoomNum };
  return resData;
};

/**
 *  @방_보기_deail
 *  @route GET api/v1/room/:roomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. no user
 *    3. no room
 */

const GETroomDetailService = async (userID: number, roomID: number) => {
  // 1. 요청 바디 부족
  if (!userID || !roomID) return -1;

  const user = await User.findOne({ where: { userID, isDeleted: false } });

  // 2. no user
  if (!user) return -2;
  const userCertification = await Certification.findOne({ where: { userID } });

  const university = await userCertification.university;

  // table join
  const rawRoom = await Room.findOne({
    where: {
      roomID,
      isDeleted: false,
    },
    include: [
      {
        model: User,
        attributes: ["userID", "nickname"],
      },
      {
        model: RoomType,
        attributes: ["roomType", "category", "rentType"],
      },
      {
        model: RoomPrice,
        attributes: ["deposit", "monthly", "control"],
      },
      {
        model: RoomInformation,
        attributes: [
          "area",
          "floor",
          "construction",
          "query",
          "post",
          "address",
          "lat",
          "lng",
          "description",
        ],
      },
      {
        model: RoomPeriod,
        attributes: ["startDate", "endDate"],
      },
      {
        model: RoomOption,
        attributes: [
          "bed",
          "table",
          "chair",
          "closet",
          "airconditioner",
          "induction",
          "refrigerator",
          "tv",
          "microwave",
          "washingmachine",
          "cctv",
          "wifi",
          "parking",
          "elevator",
        ],
      },
      {
        model: RoomCondition,
        attributes: ["gender", "smoking"],
      },
      {
        model: RoomPhoto,
        attributes: ["main", "restroom", "kitchen", "photo1", "photo2"],
      },
    ],
    attributes: ["roomID", "createdAt", "updatedAt", "isDeleted"],
  });
  // 3. no room
  if (!rawRoom) return -3;

  const room = {
    roomID: rawRoom.roomID,
    user: rawRoom.user,
    type: rawRoom.type,
    price: rawRoom.price,
    information: rawRoom.information,
    rentPeriod: {
      startDate: date.dateToString(rawRoom.rentPeriod.startDate),
      endDate: date.dateToString(rawRoom.rentPeriod.endDate),
    },
    options: rawRoom.options,
    conditions: rawRoom.conditions,
    photo: rawRoom.photo,
  };

  const resData = room;
  return resData;
};

/**
 *  @필터링_방_보기
 *  @route POST api/v1/room/filter
 *  @access private
 *  @error
 */

const POSTroomFilterService = async (userID: number, reqData) => {
  const { type, price, rentPeriod, options, conditions } = reqData;

  // type이 null이면
  if (!type.roomType || type.roomType.length === 0) {
    type.roomType = ["원룸", "투룸 이상", "오피스텔", "아파트"];
  }

  let category = ["단기임대", "양도"];
  if (type.category || type.category.length !== 0) {
    category = [];
    category.push(type.category);
  }

  if (!type.rentType || type.rentType.length === 0) {
    type.rentType = ["월세", "전세"];
  }

  let startDate = new Date("3000-08-22");
  if (rentPeriod.startDate) {
    startDate = date.stringToDate(rentPeriod.startDate);
  }
  console.log("startDate:", startDate);

  let endDate = new Date("1000-12-31");
  if (rentPeriod.endDate) {
    endDate = date.stringToDate(rentPeriod.endDate);
  }
  console.log("endDate:", endDate);

  if (!price.deposit) {
    price.deposit = 9999999;
  }
  if (!price.monthly) {
    price.monthly = 9999999;
  }
  let bed,
    table,
    chair,
    closet,
    airconditioner,
    induction,
    refrigerator,
    tv,
    microwave,
    washingmachine,
    cctv,
    wifi,
    parking,
    elevator;

  if (options.bed) {
    bed = [true];
  } else {
    bed = [true, false];
  }

  if (options.table) {
    table = [true];
  } else {
    table = [true, false];
  }

  if (options.chair) {
    chair = [true];
  } else {
    chair = [true, false];
  }

  if (options.closet) {
    closet = [true];
  } else {
    closet = [true, false];
  }

  if (options.airconditioner) {
    airconditioner = [true];
  } else {
    airconditioner = [true, false];
  }

  if (options.induction) {
    induction = [true];
  } else {
    induction = [true, false];
  }

  if (options.refrigerator) {
    refrigerator = [true];
  } else {
    refrigerator = [true, false];
  }

  if (options.tv) {
    tv = [true];
  } else {
    tv = [true, false];
  }

  if (options.microwave) {
    microwave = [true];
  } else {
    microwave = [true, false];
  }

  if (options.washingmachine) {
    washingmachine = [true];
  } else {
    washingmachine = [true, false];
  }

  if (options.cctv) {
    cctv = [true];
  } else {
    cctv = [true, false];
  }

  if (options.wifi) {
    wifi = [true];
  } else {
    wifi = [true, false];
  }

  if (options.parking) {
    parking = [true];
  } else {
    parking = [true, false];
  }

  if (options.elevator) {
    elevator = [true];
  } else {
    elevator = [true, false];
  }

  if (!conditions.gender || conditions.gender.length === 0) {
    conditions.gender = ["남성", "여성", "무관"];
  }

  if (!conditions.smoking || conditions.smoking.length === 0) {
    conditions.smoking = ["비흡연", "무관"];
  }

  const userCertification = await Certification.findOne({
    where: { userID },
  });
  const universityName = userCertification.university;

  const university = await University.findOne({
    where: { university: universityName },
    attributes: ["university", "lat", "lng"],
  });

  const rawRooms = await Room.findAll({
    order: [["createdAt", "DESC"]],
    where: { isDeleted: false, university: universityName },
    include: [
      {
        model: User,
        where: { isDeleted: false },
        attributes: [],
        required: true,
      },
      {
        model: RoomType,
        attributes: ["roomType", "category", "rentType"],
        where: {
          roomType: { [Op.in]: type.roomType },
          category: { [Op.in]: category },
          rentType: { [Op.in]: type.rentType },
        },
      },
      {
        model: RoomPrice,
        attributes: ["monthly", "deposit"],
        where: {
          deposit: { [Op.lte]: price.deposit },
          monthly: { [Op.lte]: price.monthly },
        },
      },
      {
        model: RoomPeriod,
        attributes: ["startDate", "endDate"],
        where: {
          startDate: { [Op.lte]: startDate },
          endDate: { [Op.gte]: endDate },
        },
      },
      {
        model: RoomInformation,
        attributes: ["area", "floor", "query", "post", "address", "lat", "lng"],
      },
      { model: RoomPhoto, attributes: ["main"] },
      { model: Like, where: { userID, isLike: true }, required: false },
      {
        model: RoomOption,
        attributes: [],
        where: {
          bed: { [Op.in]: bed },
          table: { [Op.in]: table },
          chair: { [Op.in]: chair },
          closet: { [Op.in]: closet },
          airconditioner: { [Op.in]: airconditioner },
          induction: { [Op.in]: induction },
          refrigerator: { [Op.in]: refrigerator },
          tv: { [Op.in]: tv },
          microwave: { [Op.in]: microwave },
          washingmachine: { [Op.in]: washingmachine },
          cctv: { [Op.in]: cctv },
          wifi: { [Op.in]: wifi },
          parking: { [Op.in]: parking },
          elevator: { [Op.in]: elevator },
        },
      },
      {
        model: RoomCondition,
        attributes: [],
        where: {
          gender: { [Op.in]: conditions.gender },
          smoking: { [Op.in]: conditions.smoking },
        },
      },
    ],
    attributes: ["roomID", "createdAt"],
  });
  const rooms = rawRooms.map((room) => {
    return {
      roomID: room.roomID,
      createdAt: date.dateToString(room.createdAt),
      type: room.type,
      price: room.price,
      rentPeriod: {
        startDate: date.dateToString(room.rentPeriod.startDate),
        endDate: date.dateToString(room.rentPeriod.endDate),
      },
      information: room.information,
      photo: room.photo,
      isLike: room.likes.length ? true : false,
    };
  });
  const newMessageNum = await Participant.count({
    where: { userID, new: true },
  });

  const resData = { university, newMessageNum, rooms };

  return resData;
};

/**
 *  @방_좋아요
 *  @route POST api/v1/room/like
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 */

const POSTlikeService = async (userID: number, roomID: number) => {
  // 1. 요청 바디 부족
  if (!userID || !roomID) return -1;

  const user = await User.findOne({ where: { userID, isDeleted: false } });

  // 2. 권한이 없는 user
  if (!user.certificated) return -2;

  const userCertification = await Certification.findOne({ where: { userID } });

  const university = await userCertification.university;

  const room = await Room.findOne({ where: { roomID, isDeleted: false } });

  // 3. no room
  if (!room) return -3;

  let like = await Like.findOne({ where: { userID, roomID } });

  if (!like) {
    await Like.create({ roomID, userID, isLike: true });
    return 1;
  } else {
    if (!like.isLike) {
      await Like.update({ isLike: true }, { where: { userID, roomID } });
      return 1;
    } else {
      await Like.update({ isLike: false }, { where: { userID, roomID } });
      return 2;
    }
  }
  return undefined;
};

/**
 *  @방_삭제하기
 *  @route Delete /api/v1/room/:roomID
 *  @body
 *  @error
 *      1. 유저 id 잘못됨
 *      2. 유저 권한 없음
 *      3. 존재하지 않는 방
 *      4. 이미 삭제된 방
 */

const DELETEroomService = async (userID: number, roomID: number) => {
  const user = await User.findOne({ where: { userID } });
  // 1. 유저 id 잘못됨
  if (!user) {
    return -1;
  }
  // 2. 유저 권한 없음
  const certification = await Certification.findOne({ where: { userID } });
  if (!certification) {
    return -2;
  }
  const alreadyRoom = await Room.findOne({ where: { roomID } });
  if (alreadyRoom.uploader !== userID) return -3;

  if (alreadyRoom.isDeleted) return -4;

  await Room.update({ isDeleted: true }, { where: { roomID } });

  return undefined;
};
const roomService = {
  POSTroomService,
  PATCHroomService,
  GETallRoomService,
  GETroomDetailService,
  POSTlikeService,
  POSTroomFilterService,
  DELETEroomService,
};

export default roomService;
