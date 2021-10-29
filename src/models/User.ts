// User model
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
  AllowNull,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import { Certification, Room } from ".";

@Table({
  tableName: "User",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  userID: number;

  @Unique
  @Column
  email: string;

  @Unique
  @Column
  password: string;

  @Column
  nickname: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Default(false)
  @Column
  isDeleted: Boolean;

  @Default(true)
  @Column
  certificated: Boolean;

  @HasOne(() => Certification)
  certification: Certification;

  @HasMany(() => Room)
  rooms: Room[];
}
