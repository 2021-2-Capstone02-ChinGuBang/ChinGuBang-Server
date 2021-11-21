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

    response.dataResponse(res, returnCode.OK, "나의 방 방 보기 성공", data);
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

const userController = {
  GETmyRoomController,
};

export default userController;
