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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTcodeService = void 0;
// models
const models_1 = require("../models");
// library
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const library_1 = require("../library");
const ejs_1 = __importDefault(require("ejs"));
const nanoid_1 = __importDefault(require("nanoid"));
/**
 *  @이메일_인증번호_전송
 *  @route Post /api/v1/auth/email
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 email
 *      3. 이메일 전송 실패
 */
const POSTemailService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = body;
    // 1. 요청 바디 부족
    if (!email) {
        return -1;
    }
    // 2. 이미 가입한 email
    const emailUser = yield models_1.User.findOne({ where: { email, isDeleted: false } });
    if (emailUser) {
        return -2;
    }
    // 인증번호를 user에 저장 -> 제한 시간 설정하기!
    const certificationCode = nanoid_1.default.nanoid(6);
    let emailTemplate;
    ejs_1.default.renderFile("src/library/emailTemplate.ejs", { certificationCode }, (err, data) => {
        if (err) {
            console.log(err);
        }
        emailTemplate = data;
    });
    const mailOptions = {
        front: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "친구방 이메일 인증코드 입니다.",
        text: "친구방 이메일 인증코드 입니다.",
        html: emailTemplate,
    };
    library_1.emailSender.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return -3;
        }
        else {
            console.log("success");
        }
        library_1.emailSender.close();
    });
    const emailCode = yield models_1.Code.findOne({ where: { email, isDeleted: false } });
    if (emailCode) {
        yield models_1.Code.update({ isDeleted: true }, { where: { codeID: emailCode.codeID } });
    }
    yield models_1.Code.create({ email, code: certificationCode });
    const resData = {
        code: certificationCode,
    };
    return resData;
});
/**
 *  @인증번호_인증
 *  @route Post /api/v1/auth/code
 *  @body email, code
 *  @error
 *      1. 요청 바디 부족
 *      2. 인증 시도 하지 않은 이메일
 *      3. 인증번호 인증 실패
 */
function POSTcodeService(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, code } = body;
        // 1. 요청 바디 부족
        if (!email || !code) {
            return -1;
        }
        const emailCode = yield models_1.Code.findOne({ where: { email, isDeleted: false } });
        // 2. 인증 시도 하지 않은 이메일
        if (!emailCode) {
            return -2;
        }
        // 3. 인증번호 인증 실패
        else if (code !== emailCode.code) {
            return -3;
        }
        // 4. 이미 가입한 email
        const emailUser = yield models_1.User.findOne({ where: { email, isDeleted: false } });
        if (emailUser) {
            return -4;
        }
        // 인증번호 일치
        return undefined;
    });
}
exports.POSTcodeService = POSTcodeService;
/**
 *  @회원가입
 *  @route Post /api/v1/auth/signup
 *  @body email,password, nickname, university
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 이메일
 */
const POSTsignupService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, nickname, university } = data;
    // 1. 요청 바디 부족
    if (!email || !password || !nickname || !university) {
        return -1;
    }
    // 2. 이미 가입한 email
    const emailUser = yield models_1.User.findOne({ where: { email, isDeleted: false } });
    if (emailUser) {
        return -2;
    }
    // password 암호화
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashPassword = yield bcryptjs_1.default.hash(password, salt);
    // User 생성
    const user = yield models_1.User.create({
        email,
        password: hashPassword,
        nickname,
    });
    // Certification 생성
    yield models_1.Certification.create({
        userID: user.userID,
        university,
    });
    yield models_1.Code.update({ isDeleted: true }, { where: { email } });
    // Return jsonwebtoken
    const payload = {
        user: {
            userID: user.userID,
        },
    };
    // access 토큰 발급
    // 유효기간 14일
    let token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" });
    return { user, token };
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
function POSTsigninService(reqData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = reqData;
        // 1. 요청 바디 부족
        if (!email || !password) {
            return -1;
        }
        // 2. email이 DB에 존재하지 않음
        const user = yield models_1.User.findOne({ where: { email: email } });
        if (!user) {
            return -2;
        }
        // 3. password가 올바르지 않음
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return -3;
        }
        yield user.save();
        const payload = {
            user: {
                userID: user.userID,
            },
        };
        const certification = yield models_1.Certification.findOne({
            where: { userID: user.userID },
        });
        let userState = 0;
        let university = null;
        if (certification) {
            userState = 1;
            university = certification.university;
        }
        // access 토큰 발급
        // 유효기간 14일
        let token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" });
        const userData = {
            userState,
            nickname: user.nickname,
            university,
        };
        return { userData, token };
    });
}
const authService = {
    POSTemailService,
    POSTcodeService,
    POSTsignupService,
    POSTsigninService,
};
exports.default = authService;
//# sourceMappingURL=authService.js.map