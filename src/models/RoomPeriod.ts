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
  tableName: "RoomPeriod",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class RoomPeriod extends Model {
  @PrimaryKey
  @ForeignKey(() => Room)
  @Unique
  @Column
  roomID: number;

  @Column
  startDate: Date;

  @AllowNull
  @Column
  endDate!: Date;

  @BelongsTo(() => Room)
  room: Room;
}
