import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import { removeDays, getDates } from 'start/rabbit'

export default class DeliveriesController {
  public async index({ request, response }: HttpContextContract) {
    const role = request.header('Role')
    const idRestaurant = request.header('RestaurantID')

    const dates = getDates(removeDays(new Date(), 30), new Date())

    const page = Number(request.input('page') ?? 1)
    const pageSize = Number(request.input('pageSize') ?? 10)

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
        createdAt: { in: dates },
        ...restaurantCondition,
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return response.status(200).json({
      data: deliveries.map((el) => ({
        createdAt: el.createdAt,
        count: el._count._all,
      })),
    })
  }
}
