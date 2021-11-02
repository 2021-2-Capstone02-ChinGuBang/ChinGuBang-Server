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
let RoomPhoto = class RoomPhoto extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => _1.Room),
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RoomPhoto.prototype, "roomID", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RoomPhoto.prototype, "main", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RoomPhoto.prototype, "restroom", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RoomPhoto.prototype, "kitchen", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RoomPhoto.prototype, "photo1", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RoomPhoto.prototype, "photo2", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RoomPhoto.prototype, "photo3", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.Room),
    __metadata("design:type", _1.Room)
], RoomPhoto.prototype, "room", void 0);
RoomPhoto = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "RoomPhoto",
        freezeTableName: true,
        underscored: false,
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], RoomPhoto);
exports.default = RoomPhoto;
//# sourceMappingURL=RoomPhoto.js.map