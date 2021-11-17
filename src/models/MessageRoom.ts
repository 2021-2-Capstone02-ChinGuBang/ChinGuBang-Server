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
import { Room, Participant, Message } from ".";

@Table({
  tableName: "MessageRoom",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class MessageRoom extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  messageRoomID: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @ForeignKey(() => Room)
  @Column
  roomID: number;

  @BelongsTo(() => Room)
  room: Room;

  @HasMany(() => Participant)
  participants: Participant[];

  @HasMany(() => Participant)
  participant1: Participant[];

  @HasMany(() => Participant)
  participant2: Participant[];

  @HasMany(() => Message)
  messages: Message[];
}
