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
    tableName: "Certification",
    freezeTableName: true,
    underscored: false,
    timestamps: true,
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
  })
  export default class Certification extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Unique
    @Column
    userID: number;
  
    @Column
    university: string;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  
    @BelongsTo(() => User)
    user: User;
  }
  