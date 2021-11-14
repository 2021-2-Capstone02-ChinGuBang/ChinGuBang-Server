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
import { Room } from ".";

@Table({
  tableName: "RoomInformation",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class RoomInformation extends Model {
  @PrimaryKey
  @ForeignKey(() => Room)
  @Unique
  @Column
  roomID: number;

  @AllowNull
  @Column
  area!: number;

  @AllowNull
  @Column
  floor!: number;

  @AllowNull
  @Column
  construction!: number;

  @Column
  query: string;

  @Column
  post: string;

  @Column
  address: string;

  @AllowNull
  @Column
  description!: string;

  @BelongsTo(() => Room)
  room: Room;
}
