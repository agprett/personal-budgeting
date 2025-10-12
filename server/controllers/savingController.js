import { Op, Sequelize } from "sequelize";
import { Saving, Savingtransaction } from "../db/models.js";
import savingTransactionFunctions from "./savingTransactionController.js";


const savingFunctions = {
  getSavings: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    let response = await Saving.findAll({
      attributes: [
        'saving_id',
        'name',
        'amount',
        [Sequelize.fn('SUM', Sequelize.col('Savingtransactions.amount')), 'change']
      ],
      include: {
        model: Savingtransaction,
        attributes: [],
        where: {
          date: {
            [Op.gte]: startOfMonth
          }
        },
        required: false,
      },
      group: [Sequelize.col('Saving.saving_id')]
    })

    res.status(200).send(response)
  },

  createSaving: async (req, res) => {
    let data = req.body

    const saving = await Saving.create(data)

    res.status(200).send('Saving created')
  },

  updateSaving: async (req, res) => {
    const {saving_id, name, amount} = req.body

    const saving = await Saving.findByPk(saving_id)

    if(name) {
      saving.name = name
    }

    if(amount) {
      saving.amount = +amount
    }

    await saving.save()

    res.status(200).send('Updated')
  },

  deleteSaving: async (req, res) => {
    const {id} = req.params

    const saving = await Saving.findByPk(id)

    await saving.destroy()

    res.status(200).send('Deleted')
  },

  getSavingsSummary: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const savingsTotal = await Saving.sum('amount')

    const savingsTransactionsTotal = await Savingtransaction.sum('amount', {
      where: {
        date: {
          [Op.gte]: startOfMonth
        }
      },
    })

    res.status(200).send({savingsTotal, savingsTransactionsTotal})
  }
}

export default savingFunctions