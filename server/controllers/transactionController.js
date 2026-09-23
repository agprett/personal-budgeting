import { Op } from "sequelize";
import { Budget, Transaction } from "../db/models.js";

const transactionFunctions = {
  getTransactions: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    let response = await Transaction.findAll({
      where: {
        date: {
          [Op.gte]: startOfMonth
        }
      },
      order: [
        ['date', 'DESC']
      ],
      include: {
        model: Budget,
        attributes: ['name', 'budget_id']
      }
    })

    res.status(200).send(response)
  },

  createTransaction: async (req, res) => {
    let data = req.body

    const transaction = await Transaction.create(data)

    res.status(200).send('Transaction added')
  },

  updateTransaction: async (req, res) => {
    const {transaction_id, name, amount, date, budget} = req.body

    const transaction = await Transaction.findByPk(transaction_id)

    if(name) {
      transaction.name = name
    }

    if(amount) {
      transaction.amount = +amount
    }

    if(date) {
      transaction.date = date
    }

    if(budget) {
      transaction.budget_id = +budget
    }

    await transaction.save()

    res.status(200).send('Updated')
  },

  deleteTransaction: async (req, res) => {
    const {id} = req.params

    const transaction = await Transaction.findByPk(id)

    await transaction.destroy()

    res.status(200).send('Deleted')
  }
}

export default transactionFunctions