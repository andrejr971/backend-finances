import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const categories = await Category.query().where('user_id', auth.user.id)

    return categories
  }

  public async store({ auth, response, request }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const name = request.input('name')

    const category = await Category.create({
      name,
      userId: auth.user.id,
    })

    return category
  }

  public async show({ auth, response, params }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const category = await Category.query().where('id', params.id).where('user_id', auth.user.id)

    return category
  }

  public async update({ auth, response, params, request }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const category = await Category.findOrFail(params.id)

    const name = request.input('name')

    category.name = name

    await category.save()

    return category
  }
}
