import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class KpisController {
  public async index({ request, response }: HttpContextContract) {
    let theDate = new Date(request.input('date'))
    if (!(theDate instanceof Date) || !isFinite(+theDate)) {
      theDate = new Date()
    }

    const idRestaurant = request.header('RestaurantID')
    const role = request.header('Role')

    const orders = await prisma.orders.findMany({
      where: {
        createdAt: { equals: theDate },
        ...(role !== 'manager' ? { restaurantId: { equals: idRestaurant } } : {}),
      },
      select: { id: true },
    })

    const deliveries = await prisma.deliveries.count({
      where: {
        createdAt: { equals: theDate },
        ...(role !== 'manager' ? { orderId: { in: orders.map((el) => el.id) } } : {}),
      },
    })

    const users = await prisma.users.count({
      where: {
        createdAt: { equals: theDate },
      },
    })

    const revenu = await prisma.orders.aggregate({
      where: {
        createdAt: { equals: theDate },
        ...(role !== 'manager' ? { restaurantId: { equals: idRestaurant } } : {}),
      },
      _sum: {
        totalPrice: true,
      },
    })
    return response.status(200).json({
      orders: orders.length,
      deliveries: deliveries,
      users: users,
      revenue: revenu._sum.totalPrice,
    })
  }
}
