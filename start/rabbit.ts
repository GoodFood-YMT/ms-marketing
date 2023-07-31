const QUEUE_NAME = 'marketing.order.created'

import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import { validator, schema } from '@ioc:Adonis/Core/Validator'

const OrderCreationSchema = schema.create({
  orderId: schema.string(),
  totalPrice: schema.string(),
  createdAt: schema.string(),
})

async function listen() {
  console.log('marketing.order.created queue started')

  await Rabbit.assertQueue(QUEUE_NAME)

  await Rabbit.consumeFrom(QUEUE_NAME, async (message) => {
    try {
      console.log(JSON.parse(message.content))
      const payload = await validator.validate({
        schema: OrderCreationSchema,
        data: JSON.parse(message.content),
      })
      console.log(payload)
    } catch (e) {
      console.log('SendMail payload not valid', e.message)
    }

    message.ack()
  })
}

listen()
