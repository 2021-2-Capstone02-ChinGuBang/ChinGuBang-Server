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
// libraries
const library_1 = require("../library");
// services
const service_1 = require("../service");
/**
 *  @내방_보기
 *  @route GET api/v1/user/room
 *  @access private
 *  @error
 */
const GETmyRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("나의 방 보기 api 호출");
    console.log(req.body);
    try {
        const data = yield service_1.userService.GETmyRoomService(req.body.userID.userID);
        library_1.response.dataResponse(res, library_1.returnCode.OK, "나의 방 보기 성공", data);
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @프로필_조회
 *  @route GET api/v1/user
 *  @access private
 *  @error
 */
const GETprofileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("프로필 조회 api 호출");
    console.log(req.body);
    try {
        const data = yield service_1.userService.GETprofileService(req.body.userID.userID);
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "존재하지 않는 사용자입니다.");
        }
        library_1.response.dataResponse(res, library_1.returnCode.OK, "프로필 조회 성공", data);
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @프로필_수정
 *  @route PATCH api/v1/user
 *  @access private
 *  @error
 *      1. 요청 바디 부족
 *      2. 존재하지 않는 유저
 */
const PATCHuserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("프로필 수정 api 호출");
    console.log(req.body);
    try {
        const data = yield service_1.userService.PATCHuserService(req.body.userID.userID, req.body.nickname);
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 바디 부족.");
        }
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "존재하지 않는 사용자입니다.");
        }
        library_1.response.basicResponse(res, library_1.returnCode.OK, "프로필 수정 성공");
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @아이디_삭제
 *  @route DELETE api/v1/user
 *  @access private
 *  @error
 *      2. 존재하지 않는 유저
 */
const DELETEuserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("아이디 삭제 api 호출");
    console.log(req.body);
    try {
        const data = yield service_1.userService.DELETEuserService(req.body);
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 바디 부족.");
        }
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "존재하지 않는 사용자입니다.");
        }
        library_1.response.basicResponse(res, library_1.returnCode.OK, "아이디 삭제 성공");
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
const userController = {
    GETmyRoomController,
    GETprofileController,
    PATCHuserController,
    DELETEuserController,
};
exports.default = userController;
//# sourceMappingURL=userController.js.map