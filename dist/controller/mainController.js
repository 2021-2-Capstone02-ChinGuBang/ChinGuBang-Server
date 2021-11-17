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
//DTO
// import { roomDTO } from "../DTO";
/**
 *  @메인페이지
 *  @route GET api/v1/main
 *  @access private
 *  @error
 */
const GETmainController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("메인페이지 (GET /main) api 호출");
    console.log(req.body);
    try {
        const data = yield service_1.mainService.GETmainService(req.body.userID.userID);
        library_1.response.dataResponse(res, library_1.returnCode.OK, "메인페이지 보기 성공", data);
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
});
const mainController = {
    GETmainController,
};
exports.default = mainController;
//# sourceMappingURL=mainController.js.map