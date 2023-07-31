import Route from '@ioc:Adonis/Core/Route'

Route.get('/marketing/order', 'OrdersController.index')
Route.post('/marketing/order', 'OrdersController.store')

Route.get('/marketing/delivery', 'DeliveriesController.index')
Route.post('/marketing/delivery', 'DeliveriesController.store')
