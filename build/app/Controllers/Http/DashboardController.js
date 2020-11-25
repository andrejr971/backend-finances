"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Transaction"));
class DashboardController {
    getBalance(transactions) {
        const { income, outcome } = transactions.reduce((accumulator, transaction) => {
            switch (transaction.type) {
                case 'income':
                    accumulator.income += Number(transaction.value);
                    break;
                case 'outcome':
                    accumulator.outcome += Number(transaction.value);
                    break;
                default:
                    break;
            }
            return accumulator;
        }, {
            income: 0,
            outcome: 0,
            total: 0,
        });
        const total = income - outcome;
        return {
            income,
            outcome,
            total,
        };
    }
    async index({ auth, response }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const transactions = await Transaction_1.default.query().where('user_id', auth.user.id);
        const balance = this.getBalance(transactions);
        return balance;
    }
}
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map