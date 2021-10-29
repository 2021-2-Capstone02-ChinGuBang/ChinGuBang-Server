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
  tableName: "RoomType",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class RoomType extends Model {
  @PrimaryKey
  @ForeignKey(() => Room)
  @Unique
  @Column
  roomID: number;

  @Column
  roomType: string;

  @Column
  category: string;

  @Column
  rentType: string;

  @BelongsTo(() => Room)
  room: Room;
}
