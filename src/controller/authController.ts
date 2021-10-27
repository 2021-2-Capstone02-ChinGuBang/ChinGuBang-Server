import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { authService } from "../service";
//DTO
import { authDTO } from "../DTO";

/**
 *  @이메일_인증번호_전송
 *  @route Post api/v1/auth/email
 *  @desc post email code for certification
 *  @access Public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 email
 *      3. 이메일 전송 실패
 */

const POSTemailController = async (req: Request, res: Response) => {
  // 이메일 형식이 잘못된 경우
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.basicResponse(
      res,
      returnCode.BAD_REQUEST,
      "요청 값이 올바르지 않습니다."
    );
  }

  try {
    const reqData: authDTO.emailReqDTO = req.body;
    const resData: authDTO.emailResDTO | -1 | -2 | -3 =
      await authService.POSTemailService(reqData);

    // 요청 바디가 부족할 경우
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다."
      );
    }
    // email이 DB에 없을 경우
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "이미 가입된 이메일 입니다."
      );
    }
    // 이메일 전송이 실패한 경우
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.SERVICE_UNAVAILABLE,
        "이메일 전송이 실패하였습니다."
      );
    }
    // 성공
    else {
      response.dataResponse(
        res,
        returnCode.CREATED,
        "인증번호 전송 성공",
        resData
      );
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};

/**
 *  @인증번호_인증
 *  @route Post api/v1/auth/code
 *  @body email, code
 *  @error
 *      1. 요청 바디 부족
 *      2. 인증 시도 하지 않은 이메일
 *      3. 인증번호 인증 실패
 */

const POSTcodeController = async (req: Request, res: Response) => {
  // 이메일 형식이 잘못된 경우
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.basicResponse(
      res,
      returnCode.BAD_REQUEST,
      "요청 값이 올바르지 않습니다."
    );
  }

  try {
    const reqData: authDTO.codeReqDTO = req.body;
    const resData: undefined | -1 | -2 | -3 = await authService.POSTcodeService(
      reqData
    );

    // 1. 요청 바디가 부족할 경우
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "요청 값이 올바르지 않습니다."
      );
    }
    // 2. email이 DB에 없을 경우
    if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        "인증 요청 하지 않은 이메일입니다."
      );
    }
    // 인증번호가 올바르지 않은 경우
    if (resData === -3) {
      response.dataResponse(res, returnCode.OK, "인증번호 인증 실패", {
        isOkay: false,
      });
    }
    // 인증번호 인증 성공
    response.dataResponse(res, returnCode.OK, "인증번호 인증 성공", {
      isOkay: true,
    });
  } catch (err) {
    console.error(err.message);
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
};
const authController = {
  POSTemailController,
  POSTcodeController,
};

export default authController;
