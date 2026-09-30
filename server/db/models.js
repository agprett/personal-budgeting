import { DataTypes, Model } from "sequelize"
import util from 'util'
import connectToDB from "./db.js"

const db = await connectToDB(process.env.CONNECTION_STRING)

class Budget extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Budget.init({
  budget_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement:true
  },
  name: {
    type: DataTypes.STRING
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  type: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['expense', 'income']]
    }
  }
}, {
  sequelize: db,
  indexes: [
    {
      name: 'unique_name_type',
      unique: true,
      fields: ['name', 'type']
    }
  ]
})


class Transaction extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Transaction.init({
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  budget_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Expense',
    // validate: {
    //   isIn: [['Expense', 'Income']]
    // }
  }
}, {
  sequelize: db
})

class Saving extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Saving.init({
  saving_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New Savings'
  },
  target: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  deadline: {
    type: DataTypes.DATEONLY
  }
}, {
  sequelize:db
})

class Savingtransaction extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Savingtransaction.init({
  saving_transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  saving_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Withdrawl',
    // validate: {
    //   isIn: [['Withdrawl', 'Deposit']]
    // }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize:db
})

class Debt extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Debt.init({
  debt_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New Debt'
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000
  },
  interest_rate: {
    type: DataTypes.DECIMAL(6, 3),
    allowNull: false,
    defaultValue: 7.99
  },
  min_payment: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  due_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize: db
})

class Debttransaction extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Debttransaction.init({
  debt_transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  debt_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Charge',
    // validate: {
    //   isIn: [['Charge', 'Payment']]
    // }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize:db
})


Budget.hasMany(Transaction, {foreignKey: 'budget_id', onDelete: 'CASCADE'})
Transaction.belongsTo(Budget, {foreignKey: 'budget_id'})

Saving.hasMany(Savingtransaction, {foreignKey: 'saving_id', onDelete: 'CASCADE', as: 'monthTx'})
Savingtransaction.belongsTo(Saving, {foreignKey: 'saving_id', as: 'monthTx'})
Saving.hasMany(Savingtransaction, {foreignKey: 'saving_id', onDelete: 'CASCADE', as: 'allTx'})
Savingtransaction.belongsTo(Saving, {foreignKey: 'saving_id', as: 'allTx'})

Debt.hasMany(Debttransaction, {foreignKey: 'debt_id', onDelete: 'CASCADE'})
Debttransaction.belongsTo(Debt, {foreignKey: 'debt_id'})

// await db.sync({force: true})

export default db
export { Budget, Transaction, Saving, Savingtransaction, Debt, Debttransaction }