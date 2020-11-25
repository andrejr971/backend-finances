"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const UserToken_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserToken"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const uuid_1 = require("uuid");
class ForgotPasswordsController {
    async store({ request }) {
        const email = request.input('email');
        const schemaValidator = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [Validator_1.rules.email(), Validator_1.rules.required()]),
        });
        await Validator_1.validator.validate({
            schema: schemaValidator,
            data: {
                email,
            },
            messages: {
                'email.required': 'Email is required',
            },
        });
        const user = await User_1.default.findByOrFail('email', email);
        const token = uuid_1.v4();
        await UserToken_1.default.create({
            token,
            userId: user.id,
        });
        await Mail_1.default.send((message) => {
            message
                .from('contato@andrejr.online', '[Equipe Finances]')
                .to(email)
                .subject('Recuperação de senha')
                .htmlView('emails/forgot_password', {
                name: user.name,
                link: `http://localhost:3000/reset-password?token=${token}`,
            });
        });
    }
}
exports.default = ForgotPasswordsController;
//# sourceMappingURL=ForgotPasswordsController.js.map