const OREDR_CREATED_QUEUE = 'marketing.order.created'
const DELIVERY_DELIVERED_QUEUE = 'marketing.delivery.delivered'
const USER_CREATED_QUEUE = 'marketing.user.created'

import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import { validator, schema } from '@ioc:Adonis/Core/Validator'
import { prisma } from '@ioc:Adonis/Addons/Prisma'
import { formatDate } from 'App/Utils'

const OrderCreationSchema = schema.create({
  orderId: schema.string(),
  totalPrice: schema.number(),
  createdAt: schema.string(),
  restaurantId: schema.string(),
  userId: schema.string(),
})

const DeliveryCreationSchema = schema.create({
  deliveryId: schema.string(),
  orderId: schema.string(),
  createdAt: schema.string(),
})

const UserCreationSchema = schema.create({
  userId: schema.string(),
  createdAt: schema.string(),
})

async function listenOrderCreated() {
  console.log('marketing.order.created queue started')
  await Rabbit.assertQueue(OREDR_CREATED_QUEUE)
  await Rabbit.consumeFrom(OREDR_CREATED_QUEUE, async (message) => {
    try {
      const payload = await validator.validate({
        schema: OrderCreationSchema,
        data: JSON.parse(message.content),
      })
      const order = await prisma.orders.create({
        data: {
          id: payload.orderId,
          createdAt: formatDate(new Date(payload.createdAt)),
          totalPrice: payload.totalPrice,
          restaurantId: payload.restaurantId,
          userId: payload.userId,
        },
      })
      console.log(`a new order with id=${order.id} has been created`)
    } catch (e) {
      console.log('marketing.order.created payload not valid', e.message)
    }
    message.ack()
  })
}

async function listenDeliveryDelivered() {
  console.log('marketing.delivery.delivered queue started')
  await Rabbit.assertQueue(DELIVERY_DELIVERED_QUEUE)
  await Rabbit.consumeFrom(DELIVERY_DELIVERED_QUEUE, async (message) => {
    try {
      const payload = await validator.validate({
        schema: DeliveryCreationSchema,
        data: JSON.parse(message.content),
      })
      const order = await prisma.deliveries.create({
        data: {
          id: payload.deliveryId,
          orderId: payload.orderId,
          createdAt: formatDate(new Date(payload.createdAt)),
        },
      })
      console.log(`a delivery with id=${order.id} has been delivered`)
    } catch (e) {
      console.log('marketing.delivery.delivered payload not valid', e.message)
    }
    message.ack()
  })
}
async function listenUserCreated() {
  console.log('marketing.user.created queue started')
  await Rabbit.assertQueue(USER_CREATED_QUEUE)
  await Rabbit.consumeFrom(USER_CREATED_QUEUE, async (message) => {
    try {
      const payload = await validator.validate({
        schema: UserCreationSchema,
        data: JSON.parse(message.content),
      })
      console.log(payload.createdAt)
      const order = await prisma.users.create({
        data: {
          id: payload.userId,
          createdAt: formatDate(new Date(payload.createdAt)),
        },
      })
      console.log(`a new user with id=${order.id} has been created`)
    } catch (e) {
      console.log('marketing.user.created payload not valid', e.message)
    }
    message.ack()
  })
}
listenOrderCreated()
listenDeliveryDelivered()
listenUserCreated()
