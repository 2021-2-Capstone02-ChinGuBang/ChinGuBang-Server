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
  import { User, MessageRoom } from ".";
  
  @Table({
    tableName: "Message",
    freezeTableName: true,
    underscored: false,
    timestamps: true,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
  })
  export default class Message extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column
    messageID: number;

    @CreatedAt
    createdAt!: Date;
  
    @ForeignKey(() => User)
    @Column
    sender: number;

    @ForeignKey(() => MessageRoom)
    @Column
    messageRoomID: number;

    @Column
    content: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => MessageRoom)
    messageRoom: MessageRoom;
}
  