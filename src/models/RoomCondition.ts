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
    tableName: "RoomCondition",
    freezeTableName: true,
    underscored: false,
    timestamps: true,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
  })
  export default class RoomCondition extends Model {
    @PrimaryKey
    @ForeignKey(() => Room)
    @Unique
    @Column
    roomID: number;

    @Column
    gender: string;

    @Default(true)
    @Column
    smoking: Boolean;

    @BelongsTo(() => Room)
    room: Room;
  }
  