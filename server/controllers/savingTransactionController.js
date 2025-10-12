import { Op } from "sequelize";
import { Savingtransaction, Saving } from "../db/models.js";

const savingTransactionFunctions = {
  getSavingTransactions: async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    let response = await Savingtransaction.findAll({
      where: {
        date: {
          [Op.gte]: startOfMonth
        }
      },
      include: {
        model: Saving,
        attributes: ['name', 'saving_id']
      },
      order: [
        ['date', 'DESC']
      ]
    })

    res.status(200).send(response)
  },

  createSavingTransaction: async (req, res) => {
    let data = req.body

    if(data.type === 'Withdrawl') {
      if(data.amount > 0) {
        data.amount = -data.amount
      }
    } else if(data.type === 'Deposit') {
      if(data.amount < 0) {
        data.amount = Math.abs(data.amount)
      }
    }

    const transaction = await Savingtransaction.create(data)

    const account = await Saving.findByPk(data.saving_id)

    if(data.type === 'Withdrawl') {
      account.amount -= +data.amount
    } else if(data.type === 'Deposit') {
      account.amount += +data.amount
    }

    await account.save()

    res.status(200).send('Transaction added')
  },

  updateSavingTransaction: async (req, res) => {
    let {saving_transaction_id, type, amount, date, saving} = req.body

    const transaction = await Savingtransaction.findByPk(saving_transaction_id)

    const account = await Saving.findByPk(transaction.saving_id)

    if(type === 'Withdrawl') {
      if(amount > 0) {
        amount = -amount
      }
    } else if(type === 'Deposit') {
      if(amount < 0) {
        amount = Math.abs(amount)
      }
    }

    if(type && type !== transaction.type) {
      if(type === 'Deposit') {
        transaction.amount = Math.abs(transaction.amount)
      } else if(type === 'Withdrawl') {
        transaction.amount = -transaction.amount
      }
      account.amount += (transaction.amount * 2)
        
      transaction.type = type
    }

    if(amount) {
      account.amount += -transaction.amount + +amount

      transaction.amount = +amount
    }

    if(date) {
      transaction.date = date
    }

    if(saving) {
      const newAccount = await Saving.findByPk(saving)

      account.amount -= transaction.amount

      newAccount.amount += transaction.amount

      transaction.saving_id = +saving

      await newAccount.save()
    }

    await account.save()

    await transaction.save()

    res.status(200).send('Updated')
  },

  deleteSavingTransaction: async (req, res) => {
    const {id} = req.params

    const transaction = await Savingtransaction.findByPk(id)

    const account = await Saving.findByPk(transaction.saving_id)

    account.amount += transaction.amount

    await account.save()

    await transaction.destroy()

    res.status(200).send('Deleted')
  }
}

export default savingTransactionFunctions