"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Transactions extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'transactions';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('title');
            table.decimal('value', 8, 2);
            table.enum('type', ['income', 'outcome']);
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table
                .integer('category_id')
                .unsigned()
                .references('id')
                .inTable('categories')
                .onDelete('CASCADE');
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Transactions;
//# sourceMappingURL=1605827270785_transactions.js.map