import { Op, Sequelize } from "sequelize";

import connectToDB from "../db/db.js";
import { Budget, Debt, Debttransaction, Saving, Savingtransaction, Transaction } from "../db/models.js"

const db = await connectToDB(process.env.CONNECTION_STRING)

const summaryFunctions=  {

  getSummary: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const planned = await Budget.sum('amount', {
      where: {
        name: {
          [Op.not]: 'Income'
        }
      }
    })


    const transactions = await Transaction.findAll({
      where: {
        date: {
          [Op.gte]: startOfMonth
        },
        type: {
          [Op.not]: 'Income'
        }
      },
      include: {
        model: Budget,
        attributes: ['name'],
      }
    })

    let actual = 0

    transactions.forEach(transaction => {
      actual += transaction.amount
    })


    res.status(200).send({planned, actual})
  },

  getCategoryOptions: async (req, res) => {
    let categories = {}

    if(req.query.budget) {
      const budgets = await Budget.findAll({
        attributes: [
          'budget_id',
          'name'
        ]
      })

      categories.budgets = budgets
    }

    if(req.query.saving) {
      const savings = await Saving.findAll({
        attributes: [
          'saving_id',
          'name'
        ]
      })

      categories.savings = savings
    }

    if(req.query.debt) {
      const debts = await Debt.findAll({
        attributes: [
          'debt_id',
          'name'
        ]
      })

      categories.debts = debts
    }

    res.status(200).send(categories)
  },

  getDashboard: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    let data = {cashFlow: {total: 0, breakdown: {income: [], expense: []}}, budgetUsed: {used: 0, budgeted: 0}, totalSaved: 0, activeGoals: 0, totalDebt: 0, debtAccounts: 0, budgets: [], savings: [], debts: [], transactions: []}

    const flow = await Transaction.sum('amount', {
      where: {
        date: {
          [Op.gte]: startOfMonth
        }
      }
    })
    if(flow) {
      data.cashFlow.total = flow
    }

    const used = await Transaction.sum('amount', {
      where: {
        type: {
          [Op.ne]: 'Income'
        }
      }
    })
    if(used) {
      data.budgetUsed.used = Math.abs(used)
    }
    const budgetted = await Budget.sum('amount', {
      where: {
        name: {
          [Op.ne]: 'Income'
        }
      }
    })
    if(budgetted) {
      data.budgetUsed.budgeted = budgetted
    }

    const saved = await Savingtransaction.sum('amount')
    if(saved) {
      data.totalSaved = saved
    }

    const goals = await Saving.count()
    if(goals) {
      data.activeGoals = goals
    }

    const debtTotal = await Debt.sum('total')
    const debtPaid = await Debttransaction.sum('amount')

    data.totalDebt = debtTotal - debtPaid

    const debtAcc = await Debt.count()
    if(debtAcc) {
      data.debtAccounts = debtAcc
    }

    let budgets = await db.query(`
      SELECT budgets.name, budgets.amount allocated, COALESCE(SUM(transactions.amount), 0)::int spent FROM budgets
      LEFT JOIN transactions ON transactions.budget_id = budgets.budget_id
      AND transactions.date >= DATE_TRUNC('month', CURRENT_DATE)
      AND transactions.type != 'Income'
      WHERE budgets.name != 'Income'
      GROUP BY budgets.budget_id
      ORDER BY budgets.name;
    `)

    console.log(budgets[0])
    if(budgets[0][0]) {
      data.budgets = budgets[0]
    }

    let savingAcc = await Saving.findAll({
      attributes: [
        'saving_id',
        'name',
        [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('allTx.amount')), 0), 'amount']
      ],
      include: {
        model: Savingtransaction,
        as: 'allTx',
        attributes: []
      },
      group:[Sequelize.col('Saving.saving_id')]
    })

    if(savingAcc[0]) {
      data.savings = savingAcc
    }


    let debtSums = await Debt.findAll({
      attributes: [
        'name',
        'total',
        [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('Debttransactions.amount')), 0), 'paid'],
        [Sequelize.literal('total - COALESCE((SELECT SUM(amount) FROM debttransactions JOIN debts AS Debt ON debttransactions.debt_id = Debt.debt_id), 0)'), 'remaining']
      ],
      include: {
        model: Debttransaction,
        attributes: [],
        required: false
      },
      group: [Sequelize.col('Debt.debt_id')]
    })

    if(debtSums[0]) {
      data.debts = debtSums
    }

    let recentTransactions = await db.query(`
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
      ORDER BY date DESC
      LIMIT 5;  
    `)

    if(recentTransactions[0]) {
      data.transactions = recentTransactions[0]
    }

    // console.log(data)

    res.status(200).send(data)
  }
}

export default summaryFunctions