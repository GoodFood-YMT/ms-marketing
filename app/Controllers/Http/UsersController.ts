import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const theDate: Date = new Date()
    theDate.setDate(theDate.getDate() - 30)

    const users = await prisma.users.groupBy({
      by: ['createdAt'],
      _count: { _all: true },
      where: {
        createdAt: { gte: theDate },
      },
    })

    return response.status(200).json(users)
  }
}
