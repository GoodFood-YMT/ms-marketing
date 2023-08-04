import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class MarketingsController {
  public async index({ request, response }: HttpContextContract) {
    const idRestaurant = request.input('RestaurantID')
    const role = request.input('Role')

    const theDate: Date = new Date()
    theDate.setDate(theDate.getDate() - 30)

    const turnover = await prisma.orders.groupBy({
      by: ['created_at', 'restaurant_id'],
      where: {
        created_at: { gte: theDate },
        ...(role !== 'manager' ? { restaurant_id: idRestaurant } : {}),
      },
      _sum: {
        totalPrice: true,
      },
      orderBy: { created_at: 'asc' },
    })

    return response.status(200).json(turnover)
  }
}
