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
  tableName: "RoomOption",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class RoomOption extends Model {
  @PrimaryKey
  @ForeignKey(() => Room)
  @Unique
  @Column
  roomID: number;

  @Default(false)
  @Column
  bed: Boolean;

  @Default(false)
  @Column
  table: Boolean;

  @Default(false)
  @Column
  chair: Boolean;

  @Default(false)
  @Column
  closet: Boolean;

  @Default(false)
  @Column
  airconditioner: Boolean;

  @Default(false)
  @Column
  induction: Boolean;

  @Default(false)
  @Column
  refrigerator: Boolean;

  @Default(false)
  @Column
  tv: Boolean;

  @Default(false)
  @Column
  doorlock: Boolean;

  @Default(false)
  @Column
  microwave: Boolean;

  @Default(false)
  @Column
  washingmachine: Boolean;

  @Default(false)
  @Column
  cctv: Boolean;

  @Default(false)
  @Column
  wifi: Boolean;

  @Default(false)
  @Column
  parking: Boolean;

  @Default(false)
  @Column
  elevator: Boolean;

  @BelongsTo(() => Room)
  room: Room;
}
