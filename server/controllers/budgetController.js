import { Op } from "sequelize";
import { Budget, Transaction } from "../db/models.js";

import connectToDB from "../db/db.js"

const db = await connectToDB(process.env.CONNECTION_STRING)

const budgetFunctions = {
  getBudgets: async (req, res) => {
    let data = []
    if(req.query.group) {
      data = await db.query(`
        SELECT budgets.budget_id, budgets.name, budgets.amount, SUM(transactions.amount) actual FROM budgets
        LEFT JOIN transactions ON transactions.budget_id = budgets.budget_id
        AND transactions.date >= DATE_TRUNC('month', CURRENT_DATE)
        AND transactions.type != 'Income'
        GROUP BY budgets.budget_id
        ORDER BY budgets.name;
      `)
    } else {
      data = await Budget.findAll()
    }

    res.status(200).send(data)
  },

  createBudget: async (req, res) => {
    let data = req.body

    const budget = await Budget.create(data)

    res.status(200).send(budget)
  },

  updateBudget: async (req, res) => {
    const {budget_id, name, amount} = req.body

    const budget = await Budget.findByPk(budget_id)

    if(name) {
      budget.name = name
    }

    if(amount) {
      budget.amount = amount
    }

    await budget.save()

    res.status(200).send('Updated')
  },

  deleteBudget: async (req, res) => {
    const {id} = req.params

    const budget = await Budget.findByPk(id)

    await budget.destroy()

    res.status(200).send('Budget deleted')
  },

  getSummary: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const planned = await Budget.sum('amount')


    const transactions = await Transaction.findAll({
      where: {
        date: {
          [Op.gte]: startOfMonth
        },
      },
      include: {
        model: Budget,
        attributes: ['name']
      }
    })

    let actual = 0

    transactions.forEach(transaction => {
      actual += transaction.amount
    })


    res.status(200).send({planned, actual})
  }
}

export default budgetFunctions