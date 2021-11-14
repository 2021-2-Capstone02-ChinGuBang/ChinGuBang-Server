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
  tableName: "RoomPhoto",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class RoomPhoto extends Model {
  @PrimaryKey
  @ForeignKey(() => Room)
  @Unique
  @Column
  roomID: number;

  @AllowNull
  @Column
  main!: string;

  @AllowNull
  @Column
  restroom!: string;

  @AllowNull
  @Column
  kitchen!: string;

  @AllowNull
  @Column
  photo1!: string;

  @AllowNull
  @Column
  photo2!: string;

  @BelongsTo(() => Room)
  room: Room;
}
