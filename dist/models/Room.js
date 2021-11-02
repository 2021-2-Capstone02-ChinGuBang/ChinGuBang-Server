"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const _1 = require(".");
let Room = class Room extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Room.prototype, "roomID", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Room.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Room.prototype, "uploader", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Room.prototype, "university", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Room.prototype, "isDeleted", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.User),
    __metadata("design:type", _1.User)
], Room.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => _1.RoomType),
    __metadata("design:type", _1.RoomType)
], Room.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => _1.RoomPeriod),
    __metadata("design:type", _1.RoomPeriod)
], Room.prototype, "rentPeriod", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => _1.RoomInformation),
    __metadata("design:type", _1.RoomInformation)
], Room.prototype, "information", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => _1.RoomCondition),
    __metadata("design:type", _1.RoomCondition)
], Room.prototype, "conditions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => _1.RoomPhoto),
    __metadata("design:type", _1.RoomPhoto)
], Room.prototype, "photo", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => _1.RoomOption),
    __metadata("design:type", _1.RoomOption)
], Room.prototype, "options", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => _1.RoomPrice),
    __metadata("design:type", _1.RoomPrice)
], Room.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => _1.Like),
    __metadata("design:type", Array)
], Room.prototype, "likes", void 0);
Room = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Room",
        freezeTableName: true,
        underscored: false,
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], Room);
exports.default = Room;
//# sourceMappingURL=Room.js.map