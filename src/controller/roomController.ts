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
  console.log("방내놓기 api 호출");
  console.log(req.body);
  try {
    const url = {
      main: (req as any).files.main
        ? (req as any).files.main[0].location
        : null,
      restroom: (req as any).files.restroom
        ? (req as any).files.restroom[0].location
        : null,
      kitchen: (req as any).files.kitchen
        ? (req as any).files.kitchen[0].location
        : null,
      photo1: (req as any).files.photo1
        ? (req as any).files.photo1[0].location
        : null,
      photo2: (req as any).files.photo2
        ? (req as any).files.photo2[0].location
        : null,
    };

    const reqData: roomDTO.postRoomReqDTO = req.body;
    const resData = await roomService.POSTroomService(
      req.body.userID.userID,
      reqData,
      url
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

/**
 *  @방_수정하기
 *  @route Patch /api/v1/room/:roomID
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 *      3. 유저 권한 없음
 */

const PATCHroomController = async (req: Request, res: Response) => {
  console.log("방 수정하기 api 호출");
  console.log(req.body);
  try {
    const url = {
      main: (req as any).files.main
        ? (req as any).files.main[0].location
        : null,
      restroom: (req as any).files.restroom
        ? (req as any).files.restroom[0].location
        : null,
      kitchen: (req as any).files.kitchen
        ? (req as any).files.kitchen[0].location
        : null,
      photo1: (req as any).files.photo1
        ? (req as any).files.photo1[0].location
        : null,
      photo2: (req as any).files.photo2
        ? (req as any).files.photo2[0].location
        : null,
    };

    const reqData: roomDTO.postRoomReqDTO = req.body;
    const resData = await roomService.PATCHroomService(
      req.body.userID.userID,
      Number(req.params.roomID),
      reqData,
      url
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
      response.dataResponse(
        res,
        returnCode.CREATED,
        "방 수정하기 성공",
        resData
      );
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};
/**
 *  @모든_방_보기
 *  @route GET api/v1/room
 *  @access private
 *  @error
 */

const GETallRoomController = async (req: Request, res: Response) => {
  console.log("모든방보기 api 호출");
  console.log(req.body);
  try {
    const data = await roomService.GETallRoomService(req.body.userID.userID);

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
  console.log("방보기 detail api 호출");
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

/**
 *  @방_좋아요
 *  @route POST api/v1/room/like
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 */

const POSTlikeController = async (req: Request, res: Response) => {
  console.log("방 좋아요 api 호출");
  console.log(req.body);
  console.log(req.params);
  try {
    const data: -1 | -2 | -3 | 1 | 2 = await roomService.POSTlikeService(
      req.body.userID.userID,
      Number(req.params.roomID)
    );
    console.log(10);

    // 1. 요청 바디 부족
    if (data === -1) {
      console.log("요청 바디 부족");
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다."
      );
    }
    // 2. 권한이 없는 user
    else if (data === -2) {
      console.log("권한이 없는 user");
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "권한이 없는 사용자입니다."
      );
    }
    // 3. no room
    else if (data === -3) {
      console.log("존재하지 않는 방");
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 방입니다."
      );
    } else if (data === 1) {
      console.log("좋아요 성공");
      response.basicResponse(res, returnCode.OK, "좋아요 성공");
    } else {
      console.log("좋아요 취소");
      response.basicResponse(res, returnCode.OK, "좋아요 취소 성공");
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

/**
 *  @필터링_방_보기
 *  @route POST api/v1/room/filter
 *  @access private
 *  @error
 */
const POSTroomFilterController = async (req: Request, res: Response) => {
  console.log("필터링 방 보기 api 호출");
  console.log(req.body);
  try {
    const data = await roomService.POSTroomFilterService(
      req.body.userID.userID,
      req.body
    );

    response.dataResponse(res, returnCode.OK, "필터링 된 방 보기 성공", data);
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

/**
 *  @방_삭제하기
 *  @route Delete /api/v1/room/:roomID
 *  @body
 *  @error
 *      1. 유저 id 잘못됨
 *      2. 유저 권한 없음
 */

const DELETEroomController = async (req: Request, res: Response) => {
  console.log("방 삭제하기 api 호출");
  console.log(req.body);
  try {
    const resData = await roomService.DELETEroomService(
      req.body.userID.userID,
      Number(req.params.roomID)
    );

    // 유저 id 잘못된 경우
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 사용자입니다"
      );
    }

    // 권한이 없는 유저의 경우
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "방 삭제 권한이 없는 유저입니다"
      );
    }

    // 3. 존재하지 않는 방
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 방 입니다"
      );
    }

    //4. 이미 삭제된 방
    else if (resData === -4) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "이미 삭제된 방 입니다"
      );
    }

    // 방 등록 성공
    else {
      response.basicResponse(res, returnCode.OK, "방 삭제하기 성공");
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

const roomController = {
  POSTroomController,
  PATCHroomController,
  GETallRoomController,
  GETroomDetailController,
  POSTlikeController,
  POSTroomFilterController,
  DELETEroomController,
};

export default roomController;
