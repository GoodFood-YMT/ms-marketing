import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import { getDates, removeDays } from 'App/Utils'

export default class TurnoversController {
  public async index({ request, response }: HttpContextContract) {
    const idRestaurant = request.header('RestaurantID')
    const role = request.header('Role')

    const dates = getDates(removeDays(new Date(), 30), new Date())

    const page = Number(request.input('page') ?? 1)
    const pageSize = Number(request.input('pageSize') ?? 10)

    const turnover = await prisma.orders.groupBy({
      by: ['createdAt', 'restaurantId'],
      where: {
        createdAt: { in: dates },
        ...(role === 'manager' ? { restaurantId: idRestaurant } : {}),
      },
      _sum: {
        totalPrice: true,
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return response.status(200).json({
      data: turnover.map((el) => ({
        createdAt: el.createdAt,
        restaurantId: el.restaurantId,
        sum: el._sum.totalPrice,
      })),
    })
  }
}
