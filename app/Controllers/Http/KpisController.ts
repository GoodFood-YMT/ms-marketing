import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import { Exception } from '@adonisjs/core/build/standalone'

export default class KpisController {
  public async index({ request, response }: HttpContextContract) {
    const theDate = new Date(request.input('date'))
    if (!(theDate instanceof Date) || !isFinite(+theDate)) {
      throw new Exception('Invalid Date')
    }
    const orders = await prisma.orders.count({
      where: {
        created_at: { equals: theDate },
      },
    })
    const deliveries = await prisma.deliveries.count({
      where: {
        created_at: { equals: theDate },
      },
    })
    const users = await prisma.users.count({
      where: {
        created_at: { equals: theDate },
      },
    })
    const revenue = await prisma.orders.aggregate({
      where: {
        created_at: { equals: theDate },
      },
      _sum: {
        totalPrice: true,
      },
    })
    return response.status(200).json({
      orders: orders,
      deliveries: deliveries,
      users: users,
      revenue: revenue._sum.totalPrice,
    })
  }
}
