"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Users extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async up() {
        this.schema.table(this.tableName, (table) => {
            table
                .integer('file_id')
                .unsigned()
                .references('id')
                .inTable('files')
                .onUpdate('CASCADE')
                .onDelete('SET NULL');
        });
    }
    async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('file_id');
        });
    }
}
exports.default = Users;
//# sourceMappingURL=1605832307638_add_avatar_id_to_users.js.map