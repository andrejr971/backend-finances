import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index() {
    const users = await User.all()

    return users
  }

  public async store({ request }: HttpContextContract) {
    const validatorSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.required(), rules.minLength(6)]),
    })

    const data = request.only(['name', 'last_name', 'email', 'password'])

    await validator.validate({
      schema: validatorSchema,
      data,
    })

    const user = await User.create(data)

    return user
  }

  public async show({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const user = await User.find(auth.user.id)

    return user
  }

  public async update({ auth, response, request }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const data = request.only(['name', 'last_name', 'email', 'password'])

    const user = await User.findOrFail(auth.user.id)

    user.merge(data)

    await user.save()

    await user.preload('avatar')

    return user
  }
}
