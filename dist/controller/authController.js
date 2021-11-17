"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// libraries
const library_1 = require("../library");
// services
const service_1 = require("../service");
/**
 *  @이메일_인증번호_전송
 *  @route Post /api/v1/auth/email
 *  @desc post email code for certification
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 email
 *      3. 이메일 전송 실패
 */
const POSTemailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("이메일 인증번호 전송(POST /auth/email) api 호출");
    console.log(req.body);
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
    }
    try {
        const reqData = req.body;
        const resData = yield service_1.authService.POSTemailService(reqData);
        // 요청 바디가 부족할 경우
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        // 2. 이미 가입한 email
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "이미 가입된 이메일 입니다.");
        }
        // 이메일 전송이 실패한 경우
        // else if (resData === -3) {
        //   response.basicResponse(
        //     res,
        //     returnCode.SERVICE_UNAVAILABLE,
        //     "이메일 전송이 실패하였습니다."
        //   );
        // }
        // 성공
        else {
            library_1.response.dataResponse(res, library_1.returnCode.CREATED, "인증번호 전송 성공", resData);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @인증번호_인증
 *  @route Post /api/v1/auth/code
 *  @body email, code
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 인증 시도 하지 않은 이메일
 *      3. 인증번호 인증 실패
 */
const POSTcodeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("인증번호 인증(POST /auth/code) api 호출");
    console.log(req.body);
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
    }
    try {
        const reqData = req.body;
        const resData = yield service_1.authService.POSTcodeService(reqData);
        // 1. 요청 바디가 부족할 경우
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        // 2. email이 DB에 없을 경우
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "인증 요청 하지 않은 이메일입니다.");
        }
        // 인증번호가 올바르지 않은 경우
        else if (resData === -3) {
            library_1.response.dataResponse(res, library_1.returnCode.OK, "인증번호 인증 실패", {
                isOkay: false,
            });
        }
        else if (resData === -4) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "이미 가입된 이메일입니다.");
        }
        // 인증번호 인증 성공
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, "인증번호 인증 성공", {
                isOkay: true,
            });
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @회원가입
 *  @route Post /api/v1/auth/signup
 *  @body email,password, nickname, university
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 */
const POSTsignupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("회원가입 (POST /auth/signup) api 호출");
    console.log(req.body);
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
    }
    try {
        const reqData = req.body;
        const data = yield service_1.authService.POSTsignupService(reqData);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "이미 가입된 이메일입니다.");
        }
        // 회원가입 성공
        else {
            const { user, token } = data;
            library_1.response.tokenResponse(res, library_1.returnCode.CREATED, "회원가입 성공", token);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @로그인
 *  @route Post /api/v1/auth/siginin
 *  @body email,password
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 패스워드가 올바르지 않음
 *  @response
 *      0 : 학교 인증 미완료 회원
 *      1 : 학교 인증 완료 회원
 *
 */
const POSTsigninController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("로그인 (POST /auth/signin) api 호출");
    console.log(req.body);
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
    }
    try {
        const reqData = req.body;
        const data = yield service_1.authService.POSTsigninService(reqData);
        // 요청 바디가 부족할 경우
        if (data == -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // email이 DB에 없을 경우
        else if (data == -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
        }
        // password가 틀렸을 경우
        else if (data == -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "비밀번호가 틀렸습니다");
        }
        // 로그인 성공
        else {
            const { userData, token } = data;
            library_1.response.dataTokenResponse(res, library_1.returnCode.OK, "로그인 성공", userData, token);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @인증없이_보러가기
 *  @route Post /api/v1/auth/public
 *  @body university
 *  @error
 *      1. 요청 바디 부족
 */
const POSTpublicController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("인증없이 보러가기 (POST /auth/public) api 호출");
    console.log(req.body);
    try {
        const reqData = req.body;
        const data = yield service_1.authService.POSTpublicService(reqData);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 인증없이 보러가기 성공
        else {
            const { token } = data;
            library_1.response.tokenResponse(res, library_1.returnCode.CREATED, "인증없이 보러가기 성공", token);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
const authController = {
    POSTemailController,
    POSTcodeController,
    POSTsignupController,
    POSTsigninController,
    POSTpublicController,
};
exports.default = authController;
//# sourceMappingURL=authController.js.map