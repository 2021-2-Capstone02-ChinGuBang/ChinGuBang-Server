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
  HasMany,
  AllowNull,
} from "sequelize-typescript";
import { User, MessageRoom } from ".";

@Table({
  tableName: "Participant",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class Participant extends Model {
  @PrimaryKey
  @ForeignKey(() => MessageRoom)
  @Column
  messageRoomID: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  userID: number;

  @BelongsTo(() => User)
  sender: User;

  @BelongsTo(() => User)
  receiver: User;

  @BelongsTo(() => MessageRoom)
  messageRoom: MessageRoom;
}
