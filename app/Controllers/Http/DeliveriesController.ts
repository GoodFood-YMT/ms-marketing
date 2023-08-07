import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class DeliveriesController {
  public async index({ request, response }: HttpContextContract) {
    const role = request.header('Role')
    const idRestaurant = request.header('RestaurantID')

    const theDate: Date = new Date()
    theDate.setDate(theDate.getDate() - 30)

    let restaurantCondition = {}
    if (role !== 'manager') {
      const orders = await prisma.orders.findMany({
        where: {
          restaurantId: { equals: idRestaurant },
        },
        select: {
          id: true,
        },
      })
      let orderId = orders.map((el) => el.id)
      restaurantCondition = { orderId: { in: orderId } }
    }

    const deliveries = await prisma.deliveries.groupBy({
      by: ['createdAt'],
      _count: { _all: true },
      where: {
        createdAt: { gte: theDate },
        ...restaurantCondition,
      },
      orderBy: { createdAt: 'asc' },
    })

    return response.status(200).json(deliveries)
  }
}
