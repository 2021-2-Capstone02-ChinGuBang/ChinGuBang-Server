import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { userService } from "../service";
//DTO
import { userDTO } from "../DTO";

/**
 *  @내방_보기
 *  @route GET api/v1/user/room
 *  @access private
 *  @error
 */

const GETmyRoomController = async (req: Request, res: Response) => {
  console.log("나의 방 보기 api 호출");
  console.log(req.body);
  try {
    const data = await userService.GETmyRoomService(req.body.userID.userID);

    response.dataResponse(res, returnCode.OK, "나의 방 보기 성공", data);
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

/**
 *  @프로필_조회
 *  @route GET api/v1/user
 *  @access private
 *  @error
 */

const GETprofileController = async (req: Request, res: Response) => {
  console.log("프로필 조회 api 호출");
  console.log(req.body);
  try {
    const data = await userService.GETprofileService(req.body.userID.userID);

    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "존재하지 않는 사용자입니다."
      );
    }
    response.dataResponse(res, returnCode.OK, "프로필 조회 성공", data);
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};
const userController = {
  GETmyRoomController,
  GETprofileController,
};

export default userController;
