import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class TransactionsController {
  public async index({ auth, response, request }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const { page } = request.get()

    const transactions = await Transaction.query()
      .where('user_id', auth.user.id)
      .preload('category')
      .paginate(page || 1, 12)

    return transactions
  }

  public async store({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const data = request.only(['title', 'value', 'type', 'category'])

    const validatorSchema = schema.create({
      title: schema.string({}, [rules.required()]),
      value: schema.number([rules.required()]),
      type: schema.string({}, [rules.required()]),
      category: schema.string({}, [rules.required()]),
    })

    await validator.validate({
      schema: validatorSchema,
      data,
    })

    const { category, title, type, value } = data

    let existCategory = await Category.findBy('name', category)

    if (!existCategory) {
      existCategory = await Category.create({
        name: category,
        userId: auth.user.id,
      })
    }

    const transaction = await Transaction.create({
      title,
      type,
      value,
      userId: auth.user.id,
      categoryId: existCategory.id,
    })

    await transaction.preload('category')

    return transaction
  }

  public async show({ auth, response, params }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const transaction = await Transaction.findOrFail(params.id)

    await transaction.preload('category')

    return transaction
  }

  public async update({ auth, response, params, request }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const transaction = await Transaction.findOrFail(params.id)

    const data = request.only(['title', 'value', 'type', 'category'])

    let existCategory = await Category.findBy('name', data.category)

    if (!existCategory) {
      existCategory = await Category.create({
        name: data.category,
        userId: auth.user.id,
      })
    }

    delete data.category

    transaction.merge({ ...data, categoryId: existCategory.id })

    await transaction.save()

    await transaction.preload('category')

    return transaction
  }
  public async destroy({ params }: HttpContextContract) {
    const transaction = await Transaction.findOrFail(params.id)

    await transaction.delete()
  }
}
