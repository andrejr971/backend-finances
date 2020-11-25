"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Category"));
class CategoriesController {
    async index({ auth, response }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const categories = await Category_1.default.query().where('user_id', auth.user.id);
        return categories;
    }
    async store({ auth, response, request }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const name = request.input('name');
        const category = await Category_1.default.create({
            name,
            userId: auth.user.id,
        });
        return category;
    }
    async show({ auth, response, params }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const category = await Category_1.default.query().where('id', params.id).where('user_id', auth.user.id);
        return category;
    }
    async update({ auth, response, params, request }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const category = await Category_1.default.findOrFail(params.id);
        const name = request.input('name');
        category.name = name;
        await category.save();
        return category;
    }
}
exports.default = CategoriesController;
//# sourceMappingURL=CategoriesController.js.map