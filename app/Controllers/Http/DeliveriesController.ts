import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class DeliveriesController {
  public async index({ request, response }: HttpContextContract) {
    const role = request.header('Role')
    const idRestaurant = request.header('RestaurantID')

    const theDate: Date = new Date()
    theDate.setDate(theDate.getDate() - 30)

    const page = Number(request.input('page') ?? 1)
    const pageSize = Number(request.input('pageSize') ?? 10)

    let restaurantCondition = {}
    if (role !== 'manager') {
      const orders = await prisma.orders.findMany({
        where: {
          restaurant_id: { equals: idRestaurant },
        },
        select: {
          id: true,
        },
      })
      let orderId = orders.map((el) => el.id)
      restaurantCondition = { orderId: { in: orderId } }
    }

    const deliveries = await prisma.deliveries.groupBy({
      by: ['created_at'],
      _count: { _all: true },
      where: {
        created_at: { gte: theDate },
        ...restaurantCondition,
      },
      orderBy: { created_at: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return response.status(200).json(
      deliveries.map((el) => ({
        createdAt: el.created_at,
        count: el._count._all,
      }))
    )
  }
}
