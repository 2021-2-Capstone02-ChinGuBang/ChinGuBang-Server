import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { mainService } from "../service";
//DTO
// import { roomDTO } from "../DTO";

/**
 *  @메인페이지
 *  @route GET api/v1/main
 *  @access private
 *  @error
 */

const GETmainController = async (req: Request, res: Response) => {
  console.log("메인페이지 (GET /main) api 호출");
  console.log(req.body);
  try {
    const data = await mainService.GETmainService(req.body.userID.userID);

    response.dataResponse(res, returnCode.OK, "메인페이지 보기 성공", data);
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

const mainController = {
  GETmainController,
};

export default mainController;
