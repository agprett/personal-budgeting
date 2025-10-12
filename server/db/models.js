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
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
    validate: {
      isIn: [['Withdrawl', 'Deposit']]
    }
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

Budget.hasMany(Transaction, {foreignKey: 'budget_id', onDelete: 'SET NULL'})
Transaction.belongsTo(Budget, {foreignKey: 'budget_id'})

Saving.hasMany(Savingtransaction, {foreignKey: 'saving_id', onDelete: 'SET NULL'})
Savingtransaction.belongsTo(Saving, {foreignKey: 'saving_id'})


// await db.sync()

export default db
export { Budget, Transaction, Saving, Savingtransaction }