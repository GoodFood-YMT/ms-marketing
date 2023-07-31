import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class OrdersController {
  public async index({ response }: HttpContextContract) {
    const orders = await prisma.order.findMany()
    return response.status(200).json(orders)
  }

  public async store({ response }: HttpContextContract) {
    const order = await prisma.order.create({
      data: {
        id: '1',
        status: 'En Cours',
        created_at: new Date(),
        updated_at: null,
      },
    })
    return response.status(200).json(order)
  }
}
