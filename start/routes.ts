import Route from '@ioc:Adonis/Core/Route'

Route.get('/marketing/orders', 'OrdersController.index')
Route.get('/marketing/deliveries', 'DeliveriesController.index')
Route.get('/marketing/users', 'UsersController.index')
Route.get('/marketing/turnovers', 'TurnoversController.index')
Route.get('/marketing/kpi', 'KpisController.index')
