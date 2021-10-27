// models
import { User, } from "../models";
// DTO
import { authDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { emailSender } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";

/**
 *  @회원가입
 *  @route Post /auth/signup
 *  @body email,password, nickname, marpolicy, interest
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디 중복
 */
