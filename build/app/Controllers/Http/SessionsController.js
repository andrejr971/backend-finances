"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const node_device_detector_1 = __importDefault(require("node-device-detector"));
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class SessionsController {
    async store({ request, auth, response }) {
        const email = request.input('email');
        const password = request.input('password');
        const sessionSchema = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [Validator_1.rules.required()]),
            password: Validator_1.schema.string({}, [Validator_1.rules.required()]),
        });
        await Validator_1.validator.validate({
            schema: sessionSchema,
            data: {
                email,
                password,
            },
            messages: {
                'email.required': 'email is required to sign in',
                'password.required': 'Password is required to sign in',
            },
        });
        try {
            const token = await auth.use('api').attempt(email, password);
            const detector = new node_device_detector_1.default();
            const userAgent = request.headers()['user-agent'];
            if (userAgent) {
                const device = detector.parseClient(userAgent).name;
                Mail_1.default.send((message) => {
                    var _a, _b;
                    message
                        .from('contato@andrejr.online', '[Equipe Finances]')
                        .to(email)
                        .subject('Novo acesso à sua conta')
                        .htmlView('emails/access_new', {
                        name: (_a = auth.user) === null || _a === void 0 ? void 0 : _a.name,
                        link: `http://localhost:3000/forgot-password`,
                        device,
                        email: (_b = auth.user) === null || _b === void 0 ? void 0 : _b.email,
                        time: date_fns_1.format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                            locale: locale_1.pt,
                        }),
                    });
                });
            }
            if (!auth.user) {
                return response.status(401).send({
                    error: {
                        message: 'User no unathorization',
                    },
                });
            }
            const relations = await User_1.default.findOrFail(auth.user.id);
            await relations.preload('avatar');
            return {
                user: relations,
                token: token.toJSON().token,
            };
        }
        catch (err) {
            if (err.code === 'E_INVALID_AUTH_UID') {
                return response.status(401).send({
                    error: {
                        message: 'E-mail or password incorret',
                    },
                });
            }
            if (err.code === 'E_INVALID_AUTH_PASSWORD') {
                return response.status(401).send({
                    error: {
                        message: 'E-mail or password incorret',
                    },
                });
            }
        }
    }
    async destroy({ auth }) {
        await auth.use('api').logout();
    }
}
exports.default = SessionsController;
//# sourceMappingURL=SessionsController.js.map