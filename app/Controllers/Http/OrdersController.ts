import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import { getDates, removeDays } from 'start/rabbit'

export default class OrdersController {
  public async index({ request, response }: HttpContextContract) {
    const idRestaurant = request.header('RestaurantID')
    const role = request.header('Role')

    const dates = getDates(removeDays(new Date(), 30), new Date())

    const page = Number(request.input('page') ?? 1)
    const pageSize = Number(request.input('pageSize') ?? 10)

    const orders = await prisma.orders.groupBy({
      by: ['createdAt'],
      _count: { _all: true },
      where: {
        createdAt: { in: dates },
        ...(role !== 'manager' ? { restaurantId: idRestaurant } : {}),
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return response.status(200).json({
      data: orders.map((el) => ({
        createdAt: el.createdAt,
        count: el._count._all,
      })),
    })
  }
}
