// models
import { User, Code, Certification } from "../models";
// DTO
import { authDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { emailSender } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @이메일_인증번호_전송
 *  @route Post api/v1/auth/email
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 email
 *      3. 이메일 전송 실패
 */
const POSTemailService = async (body: authDTO.emailReqDTO) => {
  const { email } = body;

  // 1. 요청 바디 부족
  if (!email) {
    return -1;
  }

  // 2. 이미 가입한 email
  const emailUser = await User.findOne({ where: { email, isDeleted: false } });
  if (emailUser) {
    return -2;
  }

  // 인증번호를 user에 저장 -> 제한 시간 설정하기!
  const certificationCode = nanoid.nanoid(6);

  let emailTemplate: string;
  ejs.renderFile(
    "src/library/emailTemplate.ejs",
    { certificationCode },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      emailTemplate = data;
    }
  );

  const mailOptions = {
    front: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "친구방 이메일 인증코드 입니다.",
    text: "친구방 이메일 인증코드 입니다.",
    html: emailTemplate,
  };

  emailSender.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return -3;
    } else {
      console.log("success");
    }
    emailSender.close();
  });

  const emailCode = await Code.findOne({ where: { email } });
  if (emailCode) {
    await Code.update({ code: certificationCode }, { where: { email } });
  } else {
    await Code.create({ email, code: certificationCode });
  }

  const resData: authDTO.emailResDTO = {
    code: certificationCode,
  };
  return resData;
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

export async function POSTcodeService(body: authDTO.codeReqDTO) {
  const { email, code } = body;

  // 1. 요청 바디 부족
  if (!email || !code) {
    return -1;
  }

  const emailCode = await Code.findOne({ where: { email } });

  // 2. 인증 시도 하지 않은 이메일
  if (!emailCode) {
    return -2;
  }

  // 3. 인증번호 인증 실패
  if (code !== emailCode.code) {
    return -3;
  }

  // 인증번호 일치
  return undefined;
}

/**
 *  @회원가입
 *  @route Post api/v1/auth/signup
 *  @body email,password, nickname, university
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 */

const POSTsignupService = async (data: authDTO.signupReqDTO) => {
  const { email, password, nickname, university } = data;

  // 1. 요청 바디 부족
  if (!email || !password || !nickname || !university) {
    return -1;
  }

  // password 암호화
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // User 생성
  const user = await User.create({
    email,
    password: hashPassword,
    nickname,
  });
  // Certification 생성
  const certification = await Certification.create({
    userID: user.userID,
    university,
  });

  // Return jsonwebtoken
  const payload = {
    user: {
      userID: user.userID,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });

  return { user, token };
};

const authService = {
  POSTemailService,
  POSTcodeService,
  POSTsignupService,
};

export default authService;
