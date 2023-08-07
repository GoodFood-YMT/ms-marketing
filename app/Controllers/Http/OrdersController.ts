import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class OrdersController {
  public async index({ request, response }: HttpContextContract) {
    const idRestaurant = request.header('RestaurantID')
    const role = request.header('Role')

    const theDate: Date = new Date()
    theDate.setDate(theDate.getDate() - 30)

    const orders = await prisma.orders.groupBy({
      by: ['createdAt'],
      _count: { _all: true },
      where: {
        createdAt: { gte: theDate },
        ...(role !== 'manager' ? { restaurantId: idRestaurant } : {}),
      },
      orderBy: { createdAt: 'asc' },
    })
    return response.status(200).json(
      orders.map((el) => ({
        createdAt: el.createdAt,
        count: el._count._all,
      }))
    )
  }
}
