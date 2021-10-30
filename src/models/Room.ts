import {
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
  BelongsTo,
  ForeignKey,
  HasOne,
  HasMany,
  AllowNull,
} from "sequelize-typescript";
import {
  User,
  RoomInformation,
  RoomCondition,
  RoomPhoto,
  RoomOption,
  RoomType,
  RoomPeriod,
  RoomPrice,
} from ".";

@Table({
  tableName: "Room",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class Room extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  roomID: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @ForeignKey(() => User)
  @Column
  uploader: number;

  @Column
  university: string;

  @Default(false)
  @Column
  isDeleted: Boolean;

  @BelongsTo(() => User)
  user: User;

  @HasOne(() => RoomType)
  type: RoomType;
  @HasOne(() => RoomPeriod)
  rentPeriod: RoomPeriod;
  @HasOne(() => RoomInformation)
  information: RoomInformation;
  @HasOne(() => RoomCondition)
  conditions: RoomCondition;
  @HasOne(() => RoomPhoto)
  photo: RoomPhoto;
  @HasOne(() => RoomOption)
  options: RoomOption;
  @HasOne(() => RoomPrice)
  price: RoomPrice;
}
