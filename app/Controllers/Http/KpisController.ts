import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import { getDates, removeDays } from 'App/Utils'

export default class KpisController {
  public async index({ request, response }: HttpContextContract) {
    let theDate = new Date(request.input('date'))
    if (!(theDate instanceof Date) || !isFinite(+theDate)) {
      theDate = new Date()
    }

    const dates = getDates(removeDays(theDate, 30), theDate)

    const idRestaurant = request.header('RestaurantID')
    const role = request.header('Role')

    const orders = await prisma.orders.findMany({
      where: {
        createdAt: { in: dates },
        ...(role === 'manager' ? { restaurantId: { equals: idRestaurant } } : {}),
      },
      select: { id: true },
    })

    const deliveries = await prisma.deliveries.count({
      where: {
        createdAt: { in: dates },
        ...(role === 'manager' ? { orderId: { in: orders.map((el) => el.id) } } : {}),
      },
    })

    const users = await prisma.users.count({
      where: {
        createdAt: { in: dates },
      },
    })

    const revenu = await prisma.orders.aggregate({
      where: {
        createdAt: { in: dates },
        ...(role === 'manager' ? { restaurantId: { equals: idRestaurant } } : {}),
      },
      _sum: {
        totalPrice: true,
      },
    })
    return response.status(200).json({
      orders: orders.length,
      deliveries: deliveries,
      users: users,
      revenue: revenu._sum.totalPrice ?? 0,
    })
  }
}
