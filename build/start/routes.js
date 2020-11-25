"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post('session', 'SessionsController.store');
    Route_1.default.post('forgot-password', 'ForgotPasswordsController.store');
    Route_1.default.post('reset-password', 'ResetPasswordsController.store');
    Route_1.default.post('users', 'UsersController.store');
    Route_1.default.get('/files/:id', 'FilesController.index');
    Route_1.default.group(() => {
        Route_1.default.get('balance', 'DashboardController.index');
        Route_1.default.get('charts', 'ChartsController.index');
        Route_1.default.get('users', 'UsersController.index');
        Route_1.default.put('users/:id', 'UsersController.update');
        Route_1.default.get('users/:id', 'UsersController.show');
        Route_1.default.put('users/:id/avatar', 'UpdateAvatarUsersController.store');
        Route_1.default.get('categories', 'CategoriesController.index');
        Route_1.default.post('categories', 'CategoriesController.store');
        Route_1.default.put('categories/:id', 'CategoriesController.update');
        Route_1.default.get('categories/:id', 'CategoriesController.show');
        Route_1.default.resource('transactions', 'TransactionsController').apiOnly();
        Route_1.default.delete('/logout', 'SessionsController.destroy');
    }).middleware('auth');
}).prefix('api/v1');
//# sourceMappingURL=routes.js.map