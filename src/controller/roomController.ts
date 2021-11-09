import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { roomService } from "../service";
//DTO
import { roomDTO } from "../DTO";

/**
 *  @방_내놓기
 *  @route Post /api/v1/room
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */

const POSTroomController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const reqData: roomDTO.postRoomReqDTO = req.body;
    const resData = await roomService.POSTroomService(
      req.body.userID.userID,
      reqData
    );

    // 요청 바디가 부족할 경우
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 유저 id 잘못된 경우
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 사용자입니다"
      );
    }

    // 권한이 없는 유저의 경우
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "방 등록 권한이 없는 유저입니다"
      );
    }

    // 방 등록 성공
    else {
      response.dataResponse(res, returnCode.CREATED, "방 내놓기 성공", resData);
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

// const POSTroomController = async (req: Request, res: Response) => {
//   try {
//     const url = {
//       main: (req as any).files.main
//         ? (req as any).files.main[0].location
//         : null,
//       restroom: (req as any).files.restroom
//         ? (req as any).files.restroom[0].location
//         : null,
//       kitchen: (req as any).files.kitchen
//         ? (req as any).files.kitchen[0].location
//         : null,
//       photo1: (req as any).files.photo1
//         ? (req as any).files.photo1[0].location
//         : null,
//       photo2: (req as any).files.photo2
//         ? (req as any).files.photo2[0].location
//         : null,
//       photo3: (req as any).files.photo3
//         ? (req as any).files.photo3[0].location
//         : null,
//     };

//     const reqData: roomDTO.postRoomReqDTO = req.body;
//     const resData = await roomService.POSTroomService(
//       req.body.userID.userID,
//       reqData,
//       url
//     );

//     // 요청 바디가 부족할 경우
//     if (resData === -1) {
//       response.basicResponse(
//         res,
//         returnCode.BAD_REQUEST,
//         "요청 값이 올바르지 않습니다"
//       );
//     }
//     // 유저 id 잘못된 경우
//     else if (resData === -2) {
//       response.basicResponse(
//         res,
//         returnCode.BAD_REQUEST,
//         "존재하지 않는 사용자입니다"
//       );
//     }

//     // 권한이 없는 유저의 경우
//     else if (resData === -3) {
//       response.basicResponse(
//         res,
//         returnCode.BAD_REQUEST,
//         "방 등록 권한이 없는 유저입니다"
//       );
//     }

//     // 방 등록 성공
//     else {
//       response.dataResponse(res, returnCode.CREATED, "방 내놓기 성공", resData);
//     }
//   } catch (err) {
//     console.error(err.message);
//     response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
//   }
// };

/**
 *  @모든_방_보기
 *  @route GET api/v1/room?offset=@&limit=
 *  @access private
 *  @error
 *    1. no limit
 */

const GETallRoomController = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const data = await roomService.GETallRoomService(
      req.body.userID.userID,
      Number(req.query.offset),
      Number(req.query.limit)
    );

    // 1. No limit
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다."
      );
    }

    response.dataResponse(res, returnCode.OK, "모든 방 보기 성공", data);
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
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

const GETroomDetailController = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const data = await roomService.GETroomDetailService(
      req.body.userID.userID,
      Number(req.params.roomID)
    );

    // 1. 요청 바디 부족
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다."
      );
    }
    // 2. no user
    else if (data === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 사용자입니다."
      );
    }
    // 3. no room
    else if (data === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 방입니다."
      );
    }

    response.dataResponse(res, returnCode.OK, "방 Detail 보기 성공", data);
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

const roomController = {
  POSTroomController,
  GETallRoomController,
  GETroomDetailController,
};

export default roomController;
