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
import {} from ".";

@Table({
  tableName: "University",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class University extends Model {
  @PrimaryKey
  @Column
  university: string;

  @Column
  lat: string;

  @Column
  lng: string;
}
