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
  import { User, Room } from ".";
  
  @Table({
    tableName: "Like",
    freezeTableName: true,
    underscored: false,
    timestamps: true,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
  })
  export default class Like extends Model {
    @PrimaryKey
    @ForeignKey(() => Room)
    @Column
    roomID: number;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column
    userID: number;

    @Default(false)
    @Column
    isLike!: Boolean;
  
    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Room)
    room: Room;
}
