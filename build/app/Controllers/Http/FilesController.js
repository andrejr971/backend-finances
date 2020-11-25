"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const File_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/File"));
class FilesController {
    async index({ params, response }) {
        const file = await File_1.default.findOrFail(params.id);
        return response.download(Application_1.default.tmpPath(`uploads/${file.file}`));
    }
    async store({ request }) {
        const upload = request.file('file', {
            size: '2mb',
        });
        if (!upload) {
            return 'Please upload file';
        }
        if (upload.hasErrors) {
            return upload.errors;
        }
        const filename = `${Date.now()}.${upload.subtype}`;
        await upload.move(Application_1.default.tmpPath('uploads'), {
            name: filename,
        });
        const file = await File_1.default.create({
            file: filename,
            name: upload.clientName,
            type: upload.type,
            subtype: upload.subtype,
        });
        return file;
    }
}
exports.default = FilesController;
//# sourceMappingURL=FilesController.js.map