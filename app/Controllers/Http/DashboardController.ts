import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'

interface Balance {
  income: number
  outcome: number
  total: number
}

export default class DashboardController {
  public getBalance(transactions: Transaction[]): Balance {
    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value
            break
          case 'outcome':
            accumulator.outcome += transaction.value
            break
          default:
            break
        }

        return accumulator
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      }
    )

    const total = income - outcome

    return {
      income,
      outcome,
      total,
    }
  }

  public async index({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const transactions = await Transaction.query().where('user_id', auth.user.id)

    const balance = this.getBalance(transactions)

    return balance
  }
}
