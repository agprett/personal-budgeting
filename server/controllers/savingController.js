import { DataTypes, Op, Sequelize } from "sequelize";
import { Saving, Savingtransaction } from "../db/models.js";


const savingFunctions = {
  getSavings: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    let response = await Saving.findAll({
      attributes: [
        'saving_id',
        'name',
        'target',
        'deadline',
        [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('allTx.amount')), 0), 'current'],
        // [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('monthTx.amount')), 0), 'change'],
      ],
      include: [
        // {
        //   model: Savingtransaction,
        //   as: 'monthTx',
        //   attributes: [],
        //   where: {
        //     date: {
        //       [Op.gte]: startOfMonth
        //     }
        //   },
        //   required: false,
        // },
        {
          model: Savingtransaction,
          as: 'allTx',
          attributes: []
        }
      ],
      where: {
        name: {
          [Op.ne]: 'Overall'
        }
      },
      group:[Sequelize.col('Saving.saving_id')]
    })

    console.log(response)

    res.status(200).send(response)
  },

  createSaving: async (req, res) => {
    let data = req.body

    const {current} = data

    const saving = await Saving.create(data)

    if(current > 0) {
      const transaction = {
        amount: current,
        date: new Date().toISOString().slice(0, 10),
        type: 'Deposit',
        saving_id: saving.saving_id
      }

      const firstTx = await Savingtransaction.create(transaction)
    }

    res.status(200).send('Saving created')
  },

  updateSaving: async (req, res) => {
    const {saving_id, name, target, deadline} = req.body

    const saving = await Saving.findByPk(saving_id)

    if(name) {
      saving.name = name
    }

    if(target) {
      saving.target = +target
    }

    if(deadline) {
      saving.deadline = deadline
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

    const savingsTotal = await Savingtransaction.sum('amount')
    const savingsTarget = await Saving.sum('target', {
      where: {
        name: {
          [Op.ne]: 'Overall'
        }
      }
    })

    const overallSaving = await Saving.findOne({
      where:{
        name: 'Overall'
      }
    })

    const overall = await Savingtransaction.sum('amount', {
      where: {
        saving_id: overallSaving.saving_id
      }
    })

    const savingsTransactionsTotal = await Savingtransaction.sum('amount', {
      where: {
        date: {
          [Op.gte]: startOfMonth
        }
      },
    })

    res.status(200).send({savingsTarget, savingsTotal, overall, savingsTransactionsTotal})
  }
}

export default savingFunctions