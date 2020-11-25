import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserToken from 'App/Models/UserToken'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { v4 as uuid } from 'uuid'

export default class ForgotPasswordsController {
  public async store({ request }: HttpContextContract) {
    const email = request.input('email')

    const schemaValidator = schema.create({
      email: schema.string({}, [rules.email(), rules.required()]),
    })

    await validator.validate({
      schema: schemaValidator,
      data: {
        email,
      },
      messages: {
        'email.required': 'Email is required',
      },
    })

    const user = await User.findByOrFail('email', email)

    const token = uuid()

    await UserToken.create({
      token,
      userId: user.id,
    })

    await Mail.send((message) => {
      message
        .from('contato@andrejr.online', '[Equipe Finances]')
        .to(email)
        .subject('Recuperação de senha')
        .htmlView('emails/forgot_password', {
          name: user.name,
          link: `http://localhost:3000/reset-password?token=${token}`,
        })
    })
  }
}
