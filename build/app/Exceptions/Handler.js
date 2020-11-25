"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const HttpExceptionHandler_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HttpExceptionHandler"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const youch_1 = __importDefault(require("youch"));
class ExceptionHandler extends HttpExceptionHandler_1.default {
    constructor() {
        super(Logger_1.default);
    }
    async handle(error, { response, request }) {
        if (error.name === 'ValidationException') {
            return response.status(error.status).send(error.messages);
        }
        if (Env_1.default.get('NODE_ENV') === 'development') {
            const youch = new youch_1.default(error, request.request);
            const errorJSON = await youch.toJSON();
            return response.status(error.status).send(errorJSON);
        }
        return response.status(500).send('Internal Error');
    }
}
exports.default = ExceptionHandler;
//# sourceMappingURL=Handler.js.map