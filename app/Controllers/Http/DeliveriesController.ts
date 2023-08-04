import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeliveriesController {
  public async index({ response }: HttpContextContract) {
    return response.status(200).json('hello')
  }
}
