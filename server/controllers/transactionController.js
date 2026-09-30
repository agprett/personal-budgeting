import { Op, Sequelize } from "sequelize"
import connectToDB from "../db/db.js"

import { Budget, Debttransaction, Savingtransaction, Transaction } from "../db/models.js";

const db = await connectToDB(process.env.CONNECTION_STRING)

const transactionFunctions = {
  getTransactions: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    if(req.query.all) {
      const results = await db.query(`
        SELECT * FROM (
          SELECT transaction_id, tx.budget_id, tx.name, bud.name AS category, tx.type, tx.amount, date, 'budget' as txcat FROM transactions AS tx
          JOIN budgets AS bud ON bud.budget_id = tx.budget_id
          UNION ALL
          SELECT saving_transaction_id, stx.saving_id, CONCAT(savings.name, '-', stx.type) AS name, savings.name AS category, type, amount, date, 'saving' AS txcat FROM savingtransactions stx
          JOIN savings ON savings.saving_id = stx.saving_id
          UNION ALL
          SELECT debt_transaction_id, dtx.debt_id, CONCAT(debts.name, '-', dtx.type) AS name, debts.name AS category, type, amount, date, 'debt' AS txcat FROM debttransactions as dtx
          JOIN debts ON debts.debt_id = dtx.debt_id
        ) AS all_tx
        ORDER BY date DESC;
      `)

      if(results[0].length > 0) {
        res.status(200).send(results[0])
      } else {
        res.status(200).send([])
      }
    } else {
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
    }

  },

  createTransaction: async (req, res) => {
    let data = req.body

    if(data.type ===  'Expense' || data.type === 'Withdrawl' || data.type === 'Charge') {
      data.amount = -(Math.abs(data.amount))
    }

    if(data.type === 'Income' || data.type === 'Expense') {
      const transaction = await Transaction.create(data)
    } else if(data.type === 'Charge' || data.type === 'Payment') {
      const transaction = await Debttransaction.create({...data, debt_id: data.budget_id})
    } else {
      const transaction = await Savingtransaction.create({...data, saving_id: data.budget_id})
    }

    res.status(200).send('Transaction added')
  },

  updateTransaction: async (req, res) => {
    const {transaction_id, name, type, amount, date, id, txcat} = req.body

    console.log(req.body)

    let transaction

    if(txcat === 'budget'){
      transaction = await Transaction.findByPk(transaction_id)
    } else if(txcat === 'saving') {
      transaction = await Savingtransaction.findByPk(transaction_id)
    } else {
      transaction = await Debttransaction.findByPk(transaction_id)
    }

    if(name) {
      transaction.name = name
    }

    if(amount) {
      transaction.amount = +amount
    }

    if(date) {
      transaction.date = date
    }

    if(type) {
      transaction.type = type
    }

    if(id) {
      transaction[`${txcat}_id`] = +id
    }

    await transaction.save()

    res.status(200).send('Updated')
  },

  deleteTransaction: async (req, res) => {
    const {id} = req.params
    const {type} = req.query

    let transaction

    if(type === 'budget'){
      transaction = await Transaction.findByPk(id)
    } else if(type === 'saving') {
      transaction = await Savingtransaction.findByPk(id)
    } else if(type === 'debt') {
      transaction = await Debttransaction.findByPk(id)
    }

    await transaction.destroy()

    res.status(200).send('Deleted')
  }
}

export default transactionFunctions