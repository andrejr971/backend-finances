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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class File extends Orm_1.BaseModel {
    get url() {
        return `http://${Env_1.default.get('HOST')}:${Env_1.default.get('PORT')}/api/v1/files/${this.id}`;
    }
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], File.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], File.prototype, "file", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], File.prototype, "type", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], File.prototype, "subtype", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], File.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], File.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.computed(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], File.prototype, "url", null);
exports.default = File;
//# sourceMappingURL=File.js.map