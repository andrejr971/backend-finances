"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Files extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'files';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('file').notNullable();
            table.string('name').notNullable();
            table.string('type', 20);
            table.string('subtype', 20);
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Files;
//# sourceMappingURL=1605830745736_files.js.map