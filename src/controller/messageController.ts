import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { messageService } from "../service";
//DTO
import { messageDTO } from "../DTO";

/**
 *  @쪽지_보내기
 *  @route POST api/v1/message/:roomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 *    4. 잘못된 수신인
 */

const POSTmessageController = async (req: Request, res: Response) => {
  console.log("쪽지 보내기 (POST /message/:roomID) api 호출");
  console.log(req.body);
  try {
    const reqData: messageDTO.postMessageReqDTO = req.body;
    const data = await messageService.POSTmessageService(
      req.body.userID.userID,
      Number(req.params.roomID),
      req.body
    );

    // 1. 요청 바디 부족
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다."
      );
    }
    // 2. 권한이 없는 user
    else if (data === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "권한이 없는 사용자입니다."
      );
    }
    // 3. no room
    else if (data === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 방입니다."
      );
    } else if (data === -4) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "잘못된 수신인 id입니다."
      );
    } else {
      response.dataResponse(res, returnCode.OK, "메세지 보내기 성공", data);
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

/**
 *  @쪽지함_조회
 *  @route GET api/v1/message/:messageRoomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 */

const GETmessageRoomController = async (req: Request, res: Response) => {
  console.log("쪽지함 조회 (GET /message/:messageRoomID) api 호출");
  console.log(req.body);
  try {
    const data = await messageService.GETmessageRoomService(
      req.body.userID.userID,
      Number(req.params.messageRoomID)
    );

    // 1. 요청 바디 부족
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다."
      );
    }
    // 2. 권한이 없는 user
    else if (data === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "권한이 없는 사용자입니다."
      );
    } else {
      response.dataResponse(res, returnCode.OK, "쪽지함 조회 성공", data);
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

/**
 *  @쪽지_알림_조회
 *  @route GET api/v1/message
 *  @access private
 *  @error
 *    1. 권한이 없는 user
 */

const GETmessageController = async (req: Request, res: Response) => {
  console.log("쪽지 알림 조회 (GET /message) api 호출");
  console.log(req.body);
  try {
    const data = await messageService.GETmessageService(req.body.userID.userID);

    // 1. 권한이 없는 user
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "권한이 없는 사용자입니다."
      );
    } else {
      response.dataResponse(res, returnCode.OK, "쪽지 알림 조회 성공", data);
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};
const messageController = {
  POSTmessageController,
  GETmessageRoomController,
  GETmessageController,
};

export default messageController;
