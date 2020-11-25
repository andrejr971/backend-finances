import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('session', 'SessionsController.store')
  Route.post('forgot-password', 'ForgotPasswordsController.store')
  Route.post('reset-password', 'ResetPasswordsController.store')

  Route.post('users', 'UsersController.store')
  Route.get('/files/:id', 'FilesController.index')

  Route.group(() => {
    Route.get('balance', 'DashboardController.index')
    Route.get('charts', 'ChartsController.index')

    Route.get('users', 'UsersController.index')
    Route.put('users/:id', 'UsersController.update')
    Route.get('users/:id', 'UsersController.show')
    Route.put('users/:id/avatar', 'UpdateAvatarUsersController.store')

    Route.get('categories', 'CategoriesController.index')
    Route.post('categories', 'CategoriesController.store')
    Route.put('categories/:id', 'CategoriesController.update')
    Route.get('categories/:id', 'CategoriesController.show')

    Route.resource('transactions', 'TransactionsController').apiOnly()

    Route.delete('/logout', 'SessionsController.destroy')
  }).middleware('auth')
}).prefix('api/v1')
