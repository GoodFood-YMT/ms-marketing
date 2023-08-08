import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/orders', 'OrdersController.index')
  Route.get('/deliveries', 'DeliveriesController.index')
  Route.get('/users', 'UsersController.index')
  Route.get('/turnovers', 'TurnoversController.index')
  Route.get('/kpi', 'KpisController.index')
}).prefix('marketing')
