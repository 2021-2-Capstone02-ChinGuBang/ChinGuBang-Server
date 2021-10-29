namespace roomDTO {
  export interface postRoomReqDTO {
    type: roomTypeDTO;
    information: roomInfoReqDTO;
    rentPeriod: rentPeriodReqDTO;
    options: roomOptionReqDTO;
    conditions: roomConditionReqDTO;
  }

  export interface userInfoDTO {
    userID: string;
    nickname: string;
    university: string;
  }

  export interface roomTypeDTO {
    roomType: string;
    category: string;
    rentType: string;
  }

  export interface roomInfoDTO {
    deposit: number | null;
    monthly: number | null;
    control: number | null;
    area: number | null;
    floor: number | null;
    construction: number | null;
    description: string;
    address: string;
  }

  export interface roomInfoReqDTO {
    deposit: string | null;
    monthly: string | null;
    control: string | null;
    area: string | null;
    floor: string | null;
    construction: string | null;
    description: string;
    address: string;
  }

  export interface roomConditionDTO {
    gender: string;
    smoking: Boolean;
  }

  export interface roomConditionReqDTO {
    gender: string;
    smoking: string;
  }

  export interface rentPeriodDTO {
    startDate: Date;
    endDate: Date | null;
  }

  export interface rentPeriodReqDTO {
    startDate: string;
    endDate: string | null;
  }

  export interface roomOptionDTO {
    bed: Boolean;
    table: Boolean;
    chair: Boolean;
    closet: Boolean;
    airconditioner: Boolean;
    induction: Boolean;
    refrigerator: Boolean;
    tv: Boolean;
    doorlock: Boolean;
    microwave: Boolean;
    washingmachine: Boolean;
    cctv: Boolean;
    wifi: Boolean;
    parking: Boolean;
    elevator: Boolean;
  }
  export interface roomOptionReqDTO {
    bed: string;
    table: string;
    chair: string;
    closet: string;
    airconditioner: string;
    induction: string;
    refrigerator: string;
    tv: string;
    doorlock: string;
    microwave: string;
    washingmachine: string;
    cctv: string;
    wifi: string;
    parking: string;
    elevator: string;
  }

  export interface roomPhotoDTO {
    main: string | null;
    restroom: string | null;
    kitchen: string | null;
    photo1: string | null;
    photo2: string | null;
    photo3: string | null;
  }
}

export default roomDTO;
