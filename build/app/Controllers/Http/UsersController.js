"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UsersController {
    async index() {
        const users = await User_1.default.all();
        return users;
    }
    async store({ request }) {
        const validatorSchema = Validator_1.schema.create({
            name: Validator_1.schema.string({}, [Validator_1.rules.required()]),
            email: Validator_1.schema.string({}, [Validator_1.rules.email(), Validator_1.rules.unique({ table: 'users', column: 'email' })]),
            password: Validator_1.schema.string({}, [Validator_1.rules.required(), Validator_1.rules.minLength(6)]),
        });
        const data = request.only(['name', 'last_name', 'email', 'password']);
        await Validator_1.validator.validate({
            schema: validatorSchema,
            data,
        });
        const user = await User_1.default.create(data);
        return user;
    }
    async show({ auth, response }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const user = await User_1.default.find(auth.user.id);
        return user;
    }
    async update({ auth, response, request }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const data = request.only(['name', 'last_name', 'email', 'password']);
        const user = await User_1.default.findOrFail(auth.user.id);
        user.merge(data);
        await user.save();
        await user.preload('avatar');
        return user;
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map