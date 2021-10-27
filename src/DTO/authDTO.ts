namespace authDTO {
  export interface emailReqDTO {
    email: string;
  }

  export interface emailResDTO {
    code: string;
  }

  export interface codeReqDTO {
    email: string;
    code: string;
  }

  export interface signupReqDTO {
    email: string;
    password: string;
    nickname: string;
    university: string;
  }

  export interface signinReqDTO {
    email: string;
    password: string;
  }

  export interface signinResDTO {
    userState: number;
    nickname: string;
    university: string | null;
  }

  // export interface signupReqDTO {
  //   email: string;
  //   password: string;
  //   nickname: string;
  // }
}

export default authDTO;
