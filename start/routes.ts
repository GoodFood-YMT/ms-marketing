import Route from '@ioc:Adonis/Core/Route'

Route.get('/marketing/order', 'OrdersController.index')
Route.get('/marketing/delivery', 'DeliveriesController.index')
