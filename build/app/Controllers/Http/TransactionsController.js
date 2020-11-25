"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Transaction"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Category_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Category"));
class TransactionsController {
    async index({ auth, response, request }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const { page } = request.get();
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        const transactions = await Transaction_1.default.query()
            .where('user_id', auth.user.id)
            .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [month + 1])
            .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
            .preload('category')
            .orderBy('created_at', 'desc')
            .paginate(page || 1, 6);
        return transactions;
    }
    async store({ request, response, auth }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const data = request.only(['title', 'value', 'type', 'category']);
        const validatorSchema = Validator_1.schema.create({
            title: Validator_1.schema.string({}, [Validator_1.rules.required()]),
            value: Validator_1.schema.number([Validator_1.rules.required()]),
            type: Validator_1.schema.string({}, [Validator_1.rules.required()]),
            category: Validator_1.schema.string({}, [Validator_1.rules.required()]),
        });
        await Validator_1.validator.validate({
            schema: validatorSchema,
            data,
        });
        const { category, title, type, value } = data;
        let existCategory = await Category_1.default.findBy('name', category);
        if (!existCategory) {
            existCategory = await Category_1.default.create({
                name: category,
                userId: auth.user.id,
            });
        }
        const transaction = await Transaction_1.default.create({
            title,
            type,
            value,
            userId: auth.user.id,
            categoryId: existCategory.id,
        });
        await transaction.preload('category');
        return transaction;
    }
    async show({ auth, response, params }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const transaction = await Transaction_1.default.findOrFail(params.id);
        await transaction.preload('category');
        return transaction;
    }
    async update({ auth, response, params, request }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const transaction = await Transaction_1.default.findOrFail(params.id);
        const data = request.only(['title', 'value', 'type', 'category']);
        let existCategory = await Category_1.default.findBy('name', data.category);
        if (!existCategory) {
            existCategory = await Category_1.default.create({
                name: data.category,
                userId: auth.user.id,
            });
        }
        delete data.category;
        transaction.merge({ ...data, categoryId: existCategory.id });
        await transaction.save();
        await transaction.preload('category');
        return transaction;
    }
    async destroy({ params }) {
        const transaction = await Transaction_1.default.findOrFail(params.id);
        await transaction.delete();
    }
}
exports.default = TransactionsController;
//# sourceMappingURL=TransactionsController.js.map