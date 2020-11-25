"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const UserToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserToken"));
const date_fns_1 = require("date-fns");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class ResetPasswordsController {
    async store({ request, response }) {
        const { token, password, logout } = request.all();
        const schemaValidator = Validator_1.schema.create({
            token: Validator_1.schema.string({}, [Validator_1.rules.required()]),
            password: Validator_1.schema.string({}, [Validator_1.rules.required()]),
        });
        await Validator_1.validator.validate({
            schema: schemaValidator,
            data: {
                token,
                password,
            },
            messages: {
                'token.required': 'Token is required',
                'password.required': 'Password is required',
            },
        });
        try {
            const confirmToken = await UserToken_1.default.findByOrFail('token', token);
            const parsedDateToken = confirmToken.createdAt.toJSDate();
            const addHoursToken = date_fns_1.addHours(parsedDateToken, 2);
            if (!date_fns_1.isAfter(addHoursToken, parsedDateToken)) {
                return response.status(401).send({
                    error: {
                        message: 'Token invalidate',
                    },
                });
            }
            const user = await User_1.default.find(confirmToken.userId);
            if (!user) {
                return response.status(400).send({
                    error: {
                        message: 'User not found',
                    },
                });
            }
            if (logout) {
                await Database_1.default.from('api_tokens').where('user_id', confirmToken.userId).delete();
            }
            user.password = password;
            confirmToken.delete();
            await user.save();
        }
        catch (err) {
            return response.status(400).send({
                error: {
                    message: 'Token invalidate',
                },
            });
        }
    }
}
exports.default = ResetPasswordsController;
//# sourceMappingURL=ResetPasswordsController.js.map