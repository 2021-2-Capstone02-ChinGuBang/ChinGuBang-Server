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
let Message = class Message extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "messageID", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "sender", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.MessageRoom),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "messageRoomID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.User),
    __metadata("design:type", _1.User)
], Message.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.MessageRoom),
    __metadata("design:type", _1.MessageRoom)
], Message.prototype, "messageRoom", void 0);
Message = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "Message",
        freezeTableName: true,
        underscored: false,
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci", // ????????? ??????
    })
], Message);
exports.default = Message;
//# sourceMappingURL=Message.js.map