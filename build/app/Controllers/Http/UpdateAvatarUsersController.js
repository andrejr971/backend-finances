"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const File_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/File"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const fs_1 = __importDefault(require("fs"));
class UpdateAvatarUsersController {
    async store({ request, auth, response }) {
        if (!auth.user) {
            return response.status(401).send({
                error: {
                    message: 'User no unathorization',
                },
            });
        }
        const user = await User_1.default.findOrFail(auth.user.id);
        if (user.fileId) {
            await user.preload('avatar');
            const filePath = Application_1.default.tmpPath(`uploads/${user.avatar.file}`);
            try {
                await fs_1.default.promises.stat(filePath);
            }
            catch {
                return;
            }
            const existFile = await File_1.default.findOrFail(user.fileId);
            await fs_1.default.promises.unlink(filePath);
            await existFile.delete();
        }
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
        user.fileId = file.id;
        await user.save();
        await user.preload('avatar');
        return user;
    }
}
exports.default = UpdateAvatarUsersController;
//# sourceMappingURL=UpdateAvatarUsersController.js.map