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
 *  @쪽지_보내기
 *  @route POST api/v1/message/:roomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 *    4. 잘못된 수신인
 */
const POSTmessageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("쪽지 보내기 (POST /message/:roomID) api 호출");
    console.log(req.body);
    try {
        const reqData = req.body;
        const data = yield service_1.messageService.POSTmessageService(req.body.userID.userID, Number(req.params.roomID), req.body);
        // 1. 요청 바디 부족
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        // 2. 권한이 없는 user
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "권한이 없는 사용자입니다.");
        }
        // 3. no room
        else if (data === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "존재하지 않는 방입니다.");
        }
        else if (data === -4) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "잘못된 수신인 id입니다.");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, "메세지 보내기 성공", data);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @쪽지함_조회
 *  @route GET api/v1/message/:messageRoomID
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 */
const GETmessageRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("쪽지함 조회 (GET /message/:messageRoomID) api 호출");
    console.log(req.body);
    try {
        const data = yield service_1.messageService.GETmessageRoomService(req.body.userID.userID, Number(req.params.messageRoomID));
        // 1. 요청 바디 부족
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        // 2. 권한이 없는 user
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "권한이 없는 사용자입니다.");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, "쪽지함 조회 성공", data);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
/**
 *  @쪽지_알림_조회
 *  @route GET api/v1/message
 *  @access private
 *  @error
 *    1. 권한이 없는 user
 */
const GETmessageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("쪽지 알림 조회 (GET /message) api 호출");
    console.log(req.body);
    try {
        const data = yield service_1.messageService.GETmessageService(req.body.userID.userID);
        // 1. 권한이 없는 user
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, "권한이 없는 사용자입니다.");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, "쪽지 알림 조회 성공", data);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
const messageController = {
    POSTmessageController,
    GETmessageRoomController,
    GETmessageController,
};
exports.default = messageController;
//# sourceMappingURL=messageController.js.map