import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import File from 'App/Models/File'
import User from 'App/Models/User'
import fs from 'fs'
export default class UpdateAvatarUsersController {
  public async store({ request, auth, response }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const user = await User.findOrFail(auth.user.id)

    if (user.fileId) {
      await user.preload('avatar')

      const filePath = Application.tmpPath(`uploads/${user.avatar.file}`)

      try {
        await fs.promises.stat(filePath)
      } catch {
        return
      }

      const existFile = await File.findOrFail(user.fileId)

      await fs.promises.unlink(filePath)

      await existFile.delete()
    }

    const upload = request.file('file', {
      size: '2mb',
    })

    if (!upload) {
      return 'Please upload file'
    }

    if (upload.hasErrors) {
      return upload.errors
    }

    const filename = `${Date.now()}.${upload.subtype}`

    await upload.move(Application.tmpPath('uploads'), {
      name: filename,
    })

    const file = await File.create({
      file: filename,
      name: upload.clientName,
      type: upload.type,
      subtype: upload.subtype,
    })

    user.fileId = file.id

    await user.save()
    await user.preload('avatar')

    return user
  }
}
