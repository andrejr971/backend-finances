import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Database from '@ioc:Adonis/Lucid/Database'
import Transaction from 'App/Models/Transaction'
import { format } from 'date-fns'

interface ConvertData {
  user_id: number
  year: number
  type: string
}

interface Dataset {
  data: number[]
  backgroundColor: string
  label?: string
}

export default class ChartsController {
  public async convertData({ user_id, year, type }: ConvertData) {
    const labels: string[] = []
    const data: number[] = []
    const datasets: Dataset[] = []

    // for (const transaction of transactions) {
    //   const month = format(new Date(`${transaction.month}`), 'MMM')
    //   data.push(Number(transaction.total))
    //   labels.push(month)
    // }

    const month = new Date().getMonth() + 1

    for (let index = 1; index <= month; index++) {
      const transaction = await Transaction.query()
        .where('user_id', user_id)
        .where('type', type)
        .sum('value')
        .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [index])
        .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
        .first()

      data.push(Number(transaction.sum))
      labels.push(format(new Date(`${index}`), 'MMM'))
    }

    datasets.push({
      data,
      backgroundColor: type === 'income' ? '#1eb14f' : '#c53030',
      label: type === 'income' ? 'Entrada' : 'Saída',
    })

    return { labels, datasets }
  }

  public async index({ auth, response, request }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const { year = new Date().getFullYear() } = request.get()

    // const dataIncome: number[] = []
    // const labelsIncome: string[] = []

    // for (let index = 1; index <= month; index++) {
    //   const transaction = await Transaction.query()
    //     .where('user_id', auth.user.id)
    //     .where('type', 'income')
    //     .sum('value')
    //     .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [index])
    //     .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
    //     .first()

    //   dataIncome.push(Number(transaction.sum))
    //   labelsIncome.push(format(new Date(`${index}`), 'MMM'))
    // }

    // const totalIncomeForMonth = await Database.rawQuery(
    //   "SELECT EXTRACT(MONTH FROM created_at) AS month, sum(value) as total FROM transactions WHERE user_id = ? AND type = 'income' AND EXTRACT(YEAR FROM created_at) = ? GROUP BY month, type ORDER BY month ASC",
    //   [auth.user.id, year]
    // )

    // const totalOutcomeForMonth = await Database.rawQuery(
    //   "SELECT EXTRACT(MONTH FROM created_at) AS month, sum(value) as total FROM transactions WHERE user_id = ? AND type = 'outcome' AND EXTRACT(YEAR FROM created_at) = ? GROUP BY month, type ORDER BY month ASC",
    //   [auth.user.id, year]
    // )

    // const income = await this.convertData(totalIncomeForMonth.rows)
    // const outcome = await this.convertData(totalOutcomeForMonth.rows)

    const income = await this.convertData({
      user_id: auth.user.id,
      year,
      type: 'income',
    })

    const outcome = await this.convertData({
      user_id: auth.user.id,
      year,
      type: 'outcome',
    })

    return {
      income,
      outcome,
    }
  }
}
