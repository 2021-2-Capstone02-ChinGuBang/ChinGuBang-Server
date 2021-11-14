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
// models
const models_1 = require("../models");
/**
 *  @
 *  @route POST api/v1/message
 *  @access private
 *  @error
 *    1. 요청 바디 부족
 *    2. 권한이 없는 user
 *    3. no room
 */
const POSTlikeService = (userID, roomID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID || !roomID)
        return -1;
    const user = yield models_1.User.findOne({ where: { userID, isDeleted: false } });
    // 2. 권한이 없는 user
    if (!user.certificated)
        return -2;
    const userCertification = yield models_1.Certification.findOne({ where: { userID } });
    const university = yield userCertification.university;
    const room = yield models_1.Room.findOne({ where: { roomID, isDeleted: false } });
    // 3. no room
    if (!room)
        return -3;
    let like = yield models_1.Like.findOne({ where: { userID, roomID } });
    if (!like) {
        yield models_1.Like.create({ roomID, userID, isLike: true });
        return 1;
    }
    else {
        if (!like.isLike) {
            yield models_1.Like.update({ isLike: true }, { where: { userID, roomID } });
            return 1;
        }
        else {
            yield models_1.Like.update({ isLike: false }, { where: { userID, roomID } });
            return 2;
        }
    }
});
const messageService = {};
exports.default = messageService;
//# sourceMappingURL=messageService.js.map