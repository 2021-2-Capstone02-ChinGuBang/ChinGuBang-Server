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
import { User } from ".";

@Table({
  tableName: "Code",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class Code extends Model {
  @PrimaryKey
  @Unique
  @Column
  email: string;

  @Unique
  @Column
  code: string;
}
