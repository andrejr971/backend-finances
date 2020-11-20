import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import DeviceDetector from 'node-device-detector'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import User from 'App/Models/User'

export default class SessionsController {
  public async store({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const sessionSchema = schema.create({
      email: schema.string({}, [rules.required()]),
      password: schema.string({}, [rules.required()]),
    })

    await validator.validate({
      schema: sessionSchema,
      data: {
        email,
        password,
      },
      messages: {
        'email.required': 'email is required to sign in',
        'password.required': 'Password is required to sign in',
      },
    })

    try {
      const token = await auth.use('api').attempt(email, password)

      const detector = new DeviceDetector()
      const userAgent = request.headers()['user-agent']

      if (userAgent) {
        const device = detector.parseClient(userAgent).name

        Mail.send((message) => {
          message
            .from('contato@andrejr.online', '[Equipe Finances]')
            .to(email)
            .subject('Novo acesso à sua conta')
            .htmlView('emails/access_new', {
              name: auth.user?.name,
              link: `http://localhost:3000/forgot-password`,
              device,
              email: auth.user?.email,
              time: format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                locale: pt,
              }),
            })
        })
      }

      if (!auth.user) {
        return response.status(401).send({
          error: {
            message: 'User no unathorization',
          },
        })
      }

      const relations = await User.findOrFail(auth.user.id)

      await relations.preload('avatar')

      return {
        user: relations,
        token: token.toJSON().token,
      }
    } catch (err) {
      if (err.code === 'E_INVALID_AUTH_UID') {
        return response.status(401).send({
          error: {
            message: 'E-mail or password incorret',
          },
        })
      }

      if (err.code === 'E_INVALID_AUTH_PASSWORD') {
        return response.status(401).send({
          error: {
            message: 'E-mail or password incorret',
          },
        })
      }
    }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.use('api').logout()
  }
}
