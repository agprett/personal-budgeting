import { Budget, Debt, Saving } from "../db/models.js"

const summaryFunctions=  {
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
  }
}

export default summaryFunctions