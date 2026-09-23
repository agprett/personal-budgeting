import { Op, Sequelize } from "sequelize";
import { Debt, Debttransaction } from "../db/models.js";


const debtFunctions = {
  getDebts: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    let response = await Debt.findAll({
      attributes: [
        'debt_id',
        'name',
        'total',
        ['interest_rate', 'interestRate'],
        ['min_payment', 'minPayment'],
        ['due_date', 'dueDate'],
        [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('Debttransactions.amount')), 0), 'paid'],
      ],
      include: {
        model: Debttransaction,
        attributes: [],
        required: false
      },
      group: [Sequelize.col('Debt.debt_id')]
    })

    res.status(200).send(response)
  },

  createDebt: async (req, res) => {
    let {name, total, interestRate, minPayment, remaining} = req.body

    const debtData = {
      name,
      total,
      interest_rate: interestRate,
      min_payment: minPayment
    }

    console.log(debtData)

    const debt = await Debt.create(debtData)

    if(remaining > 0) {
      const transaction = {
        debt_id: debt.debt_id,
        type: 'Payment',
        amount: total - remaining,
        date: new Date().toISOString().slice(0, 10)
      }

      const firstTx = await Debttransaction.create(transaction)

      console.log(firstTx)
    }

    res.status(200).send('Debt created')
  },

  updateDebt: async (req, res) => {
    const {debt_id, name, interestRate, dueDate, total, minPayment} = req.body
    
    const debt = await Debt.findByPk(debt_id)

    if(name) {
      debt.name = name
    }

    if(interestRate) {
      debt.interest_rate = interestRate
    }

    if(total) {
      debt.total = total
    }

    if(dueDate){
      debt.due_date = dueDate
    }

    if(minPayment) {
      debt.min_payment = minPayment
    }

    await debt.save()

    res.status(200).send('Updated')
  },

  deleteDebt: async (req, res) => {
    const {id} = req.params
    
    const debt = await Debt.findByPk(id)
    console.log(debt)

    await debt.destroy()

    res.status(200).send('Deleted')
  },

  getDebtSummary: async (req, res) => {
    const debtTotal = await Debt.sum('total')

    const debtPaid = await Debttransaction.sum('amount')

    const minPayment = await Debt.sum('min_payment')

    const debtRemaining = debtTotal - debtPaid

    res.status(200).send({debtRemaining, debtPaid, minPayment})
  }
}

export default debtFunctions