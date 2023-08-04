import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const theDate: Date = new Date()
    theDate.setDate(theDate.getDate() - 30)

    const users = await prisma.users.groupBy({
      by: ['created_at'],
      _count: { _all: true },
      where: {
        created_at: { gte: theDate },
      },
    })

    return response.status(200).json(users)
  }
}
