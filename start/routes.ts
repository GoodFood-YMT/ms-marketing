import Route from '@ioc:Adonis/Core/Route'

Route.get('/marketing/Orders', 'OrdersController.index')
Route.get('/marketing/Deliveries', 'DeliveriesController.index')
Route.get('/marketing/Users', 'UsersController.index')
Route.get('/marketing/Turnovers', 'TurnoversController.index')
Route.get('/marketing/KPI', 'KpisController.index')
