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

// const POSTroomService = async (userID: number, reqData) => {
//   const { type, price, information, rentPeriod, options, conditions, photo } =
//     reqData;

//   // 1. 요청 바디 부족
//   if (
//     !type ||
//     !price ||
//     !information ||
//     !rentPeriod ||
//     !options ||
//     !conditions ||
//     !photo
//   ) {
//     return -1;
//   }

//   const user = await User.findOne({ where: { userID } });

//   // 2. 유저 id 잘못됨
//   if (!user) {
//     return -2;
//   }

//   const certification = await Certification.findOne({ where: { userID } });

//   // 3. 유저 권한 없음
//   if (!user.certificated) {
//     return -3;
//   }

//   // room 생성
//   const newRoom = await Room.create({
//     uploader: userID,
//     university: certification.university,
//   });

//   await RoomType.create({
//     roomID: newRoom.roomID,
//     roomType: type.roomType,
//     category: type.category,
//     rentType: type.rentType,
//   });

//   await RoomInformation.create({
//     roomID: newRoom.roomID,
//     area: information.area,
//     floor: information.floor,
//     construction: information.construction,
//     address: information.address,
//     description: information.description,
//   });

//   await RoomPrice.create({
//     roomID: newRoom.roomID,
//     deposit: price.deposit,
//     monthly: price.monthly,
//     control: price.control,
//   });

//   await RoomPeriod.create({
//     roomID: newRoom.roomID,
//     startDate: rentPeriod.startDate,
//     endDate: rentPeriod.endDate,
//   });

//   await RoomCondition.create({
//     roomID: newRoom.roomID,
//     gender: conditions.gender,
//     smoking: conditions.smoking,
//   });

//   await RoomPhoto.create({
//     roomID: newRoom.roomID,
//     main: photo.main,
//     restroom: photo.restroom,
//     kitchen: photo.kitchen,
//     photo1: photo.photo1,
//     photo2: photo.photo2,
//     photo3: photo.photo3,
//   });

//   await RoomOption.create({
//     roomID: newRoom.roomID,
//     bed: options.bed,
//     table: options.table,
//     chair: options.chair,
//     closet: options.closet,
//     airconditioner: options.airconditioner,
//     induction: options.induction,
//     refrigerator: options.refrigerator,
//     tv: options.tv,
//     doorlock: options.doorlock,
//     microwave: options.microwave,
//     washingmachine: options.washingmachine,
//     cctv: options.cctv,
//     wifi: options.wifi,
//     parking: options.parking,
//     elevator: options.elevator,
//   });

//   // table join
//   const room = await Room.findOne({
//     where: {
//       roomID: newRoom.roomID,
//     },
//     include: [
//       {
//         model: User,
//         attributes: ["userID", "nickname"],
//       },
//       {
//         model: RoomType,
//         attributes: ["roomType", "category", "rentType"],
//       },
//       {
//         model: RoomPrice,
//         attributes: ["deposit", "monthly", "control"],
//       },
//       {
//         model: RoomInformation,
//         attributes: ["area", "floor", "construction", "address", "description"],
//       },
//       {
//         model: RoomOption,
//         attributes: [
//           "bed",
//           "table",
//           "chair",
//           "closet",
//           "airconditioner",
//           "induction",
//           "refrigerator",
//           "tv",
//           "doorlock",
//           "microwave",
//           "washingmachine",
//           "cctv",
//           "wifi",
//           "parking",
//           "elevator",
//         ],
//       },
//       {
//         model: RoomCondition,
//         attributes: ["gender", "smoking"],
//       },
//       {
//         model: RoomPhoto,
//         attributes: [
//           "main",
//           "restroom",
//           "kitchen",
//           "photo1",
//           "photo2",
//           "photo3",
//         ],
//       },
//     ],
//     attributes: ["roomID", "createdAt", "updatedAt", "isDeleted"],
//   });

//   const resData = room;

//   return resData;
// };

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
    console.log("!!!!!!!!!!!!!!!");
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
    address: information.address,
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
    photo3: url.photo3,
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
    doorlock: cast.stringToBoolean(options.doorlock),
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
        attributes: ["area", "floor", "construction", "address", "description"],
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
          "doorlock",
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
        attributes: [
          "main",
          "restroom",
          "kitchen",
          "photo1",
          "photo2",
          "photo3",
        ],
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
 *  @route GET api/v1/room?offset=@&limit=
 *  @access private
 *  @error
 *    1. no limit
 */

const GETallRoomService = async (
  userID: number,
  offset?: number,
  limit?: number
) => {
  if (!offset) {
    offset = 0;
  }

  // 1. No limit
  if (!limit) {
    return -1;
  }
  const userCertification = await Certification.findOne({ where: { userID } });
  const university = await userCertification.university;

  const rooms = await Room.findAll({
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
    offset,
    limit,
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
  const room = await Room.findOne({
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
        attributes: ["area", "floor", "construction", "address", "description"],
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
          "doorlock",
          "microwave",
          "washingmashine",
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
        attributes: [
          "main",
          "restroom",
          "kitchen",
          "photo1",
          "photo2",
          "photo3",
        ],
      },
    ],
    attributes: ["roomID", "createdAt", "updatedAt", "isDeleted"],
  });
  // 3. no room
  if (!room) return -3;

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

  if (!type.category || type.category.length === 0) {
    type.category = ["단기임대", "양도"];
  }

  if (!type.rentType || type.rentType.length === 0) {
    type.rentType = ["월세", "전세"];
  }
  if (!rentPeriod.startDate) {
    rentPeriod.startDate = new Date("3000-08-22");
  }
  if (!rentPeriod.endDate) {
    rentPeriod.endDate = new Date("1000-12-31");
  }
  if (!price.deposit) {
    price.deposit = 9999999;
  }

  let bed,
    table,
    chair,
    closet,
    airconditioner,
    induction,
    refrigerator,
    tv,
    doorlock,
    microwave,
    washingmachine,
    cctv,
    wifi,
    parking,
    elevator = [true, false];
  if (options.bed || options.bed.length == 0 || !options.bed[0]) {
    options.bed = [true, false];
  } else {
    options.bed = [true];
  }

  if (!options.table || options.table.length === 0 || !options.table[0]) {
    options.table = [true, false];
  } else {
    options.table = [true];
  }

  if (!options.chair || options.chair.length === 0 || !options.chair[0]) {
    options.chair = [true, false];
  } else {
    options.chair = [true];
  }

  if (!options.closet || options.closet.length === 0 || !options.closet[0]) {
    options.closet = [true, false];
  } else {
    options.closet = [true];
  }

  if (
    !options.airconditioner ||
    options.airconditioner.length === 0 ||
    !options.airconditioner[0]
  ) {
    options.airconditioner = [true, false];
  } else {
    options.airconditioner = [true];
  }

  if (
    !options.induction ||
    options.induction.length === 0 ||
    !options.induction[0]
  ) {
    options.induction = [true, false];
  } else {
    options.induction = [true];
  }

  if (
    !options.refrigerator ||
    options.refrigerator.length === 0 ||
    !options.refrigerator[0]
  ) {
    options.refrigerator = [true, false];
  } else {
    options.refrigerator = [true];
  }

  if (!options.tv || options.tv.length === 0 || !options.tv[0]) {
    options.tv = [true, false];
  } else {
    options.tv = [true];
  }

  if (
    !options.doorlock ||
    options.doorlock.length === 0 ||
    !options.doorlock[0]
  ) {
    options.doorlock = [true, false];
  } else {
    options.doorlock = [true];
  }

  if (
    !options.microwave ||
    options.microwave.length === 0 ||
    !options.microwave[0]
  ) {
    options.microwave = [true, false];
  } else {
    options.microwave = [true];
  }

  if (
    !options.washingmachine ||
    options.washingmachine.length === 0 ||
    !options.washingmachine[0]
  ) {
    options.washingmachine = [true, false];
  } else {
    options.washingmachine = [true];
  }

  if (!options.cctv || options.cctv.length === 0 || !options.cctv[0]) {
    options.cctv = [true, false];
  } else {
    options.cctv = [true];
  }

  if (!options.wifi || options.wifi.length === 0 || !options.wifi[0]) {
    options.wifi = [true, false];
  } else {
    options.wifi = [true];
  }

  if (!options.parking || options.parking.length === 0 || !options.parking[0]) {
    options.parking = [true, false];
  } else {
    options.parking = [true];
  }

  if (
    !options.elevator ||
    options.elevator.length === 0 ||
    !options.elevator[0]
  ) {
    options.elevator = [true, false];
  } else {
    options.elevator = [true];
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
  const university = await userCertification.university;

  const rooms = await Room.findAll({
    order: [["createdAt", "DESC"]],
    where: { isDeleted: false, university },
    include: [
      {
        model: User,
        where: { isDeleted: false },
        attributes: [],
        required: true,
      },
      {
        model: RoomType,
        attributes: ["roomType", "category"],
        where: {
          roomType: { [Op.in]: type.roomType },
          category: { [Op.in]: type.category },
          rentType: { [Op.in]: type.rentType },
        },
      },
      {
        model: RoomPrice,
        attributes: ["monthly", "deposit"],
        where: { deposit: { [Op.lte]: price.deposit } },
      },
      {
        model: RoomPeriod,
        attributes: ["startDate", "endDate"],
        where: {
          startDate: { [Op.lte]: rentPeriod.startDate },
          endDate: { [Op.gte]: rentPeriod.endDate },
        },
      },
      { model: RoomInformation, attributes: ["area", "floor"] },
      { model: RoomPhoto, attributes: ["main"] },
      { model: Like, where: { userID, isLike: true }, required: false },
      {
        model: RoomOption,
        attributes: [],
        where: {
          bed: { [Op.in]: options.bed },
          table: { [Op.in]: options.table },
          chair: { [Op.in]: options.chair },
          closet: { [Op.in]: options.closet },
          airconditioner: { [Op.in]: options.airconditioner },
          induction: { [Op.in]: options.induction },
          refrigerator: { [Op.in]: options.refrigerator },
          tv: { [Op.in]: options.tv },
          doorlock: { [Op.in]: options.doorlock },
          washingmachine: { [Op.in]: options.washingmachine },
          cctv: { [Op.in]: options.cctv },
          wifi: { [Op.in]: options.wifi },
          parking: { [Op.in]: options.parking },
          elevator: { [Op.in]: options.elevator },
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

  const resData = { rooms };

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
};

const roomService = {
  POSTroomService,
  GETallRoomService,
  GETroomDetailService,
  POSTlikeService,
  POSTroomFilterService,
};

export default roomService;
