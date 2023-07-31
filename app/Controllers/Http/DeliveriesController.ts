import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import Rabbit from '@ioc:Adonis/Addons/Rabbit'

export default class DeliveriesController {
  public async index({ response }: HttpContextContract) {
    await Rabbit.assertQueue('order')
    await Rabbit.consumeFrom('order', (message) => {
      console.log(message.content)
    })
    const deliveries = await prisma.delivery.findMany()
    return response.status(200).json(deliveries)
  }

  public async store({ response }: HttpContextContract) {
    const delivery = await prisma.delivery.create({
      data: {
        id: '1',
        status: 'En Cours',
        address_id: '1',
        deliverer_id: '1',
        order_id: '1',
        created_at: new Date(),
        updated_at: null,
      },
    })
    return response.status(200).json(delivery)
  }
}
