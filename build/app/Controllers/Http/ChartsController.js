"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Transaction"));
const date_fns_1 = require("date-fns");
class ChartsController {
    async convertData({ user_id, year, type }) {
        const labels = [];
        const data = [];
        const datasets = [];
        const month = new Date().getMonth() + 1;
        for (let index = 1; index <= month; index++) {
            const transaction = await Transaction_1.default.query()
                .where('user_id', user_id)
                .where('type', type)
                .sum('value')
                .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [index])
                .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
                .first();
            data.push(Number(transaction.sum));
            labels.push(date_fns_1.format(new Date(`${index}`), 'MMM'));
        }
        datasets.push({
            data,
            backgroundColor: type === 'income' ? '#1eb14f' : '#c53030',
            label: type === 'income' ? 'Entrada' : 'Saída',
        });
        return { labels, datasets };
    }
    async index({ auth, response, request }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const { year = new Date().getFullYear() } = request.get();
        const income = await this.convertData({
            user_id: auth.user.id,
            year,
            type: 'income',
        });
        const outcome = await this.convertData({
            user_id: auth.user.id,
            year,
            type: 'outcome',
        });
        return {
            income,
            outcome,
        };
    }
}
exports.default = ChartsController;
//# sourceMappingURL=ChartsController.js.map