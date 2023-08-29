import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import { getDates, removeDays } from 'App/Utils'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const page = Number(request.input('page') ?? 1)
    const pageSize = Number(request.input('pageSize') ?? 10)

    const dates = getDates(removeDays(new Date(), 30), new Date())

    const users = await prisma.users.groupBy({
      by: ['createdAt'],
      _count: { _all: true },
      where: {
        createdAt: { in: dates },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return response.status(200).json({
      data: users.map((el) => ({
        createdAt: el.createdAt,
        count: el._count._all,
      })),
    })
  }
}
