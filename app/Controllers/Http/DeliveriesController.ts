import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class DeliveriesController {
  public async index({ request, response }: HttpContextContract) {
    // const idRestaurant = request.input('RestaurantID')
    // const role = request.input('Role')

    const theDate: Date = new Date()
    theDate.setDate(theDate.getDate() - 30)

    console.log(theDate)
    const deliveries = await prisma.deliveries.groupBy({
      by: ['created_at'],
      _count: { _all: true },
      where: {
        created_at: { gte: theDate },
        // ...(role !== 'manager' ? { restaurant_id: idRestaurant } : {}),
      },
      orderBy: { created_at: 'asc' },
    })

    return response.status(200).json(deliveries)
  }
}
