import express from 'express'
import path from 'path'
import cors from 'cors'
import url from 'url'

import 'dotenv/config'

const {SERVER_PORT} = process.env
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const app = express()

app.use(cors())
app.use(express.json())



import budgetFunctions from './controllers/budgetController.js'
const {getBudgets, createBudget, updateBudget, deleteBudget, getSummary} = budgetFunctions

import transactionFunctions from './controllers/transactionController.js'
const {getTransactions, createTransaction, updateTransaction, deleteTransaction} = transactionFunctions


app.get('/api/budget', getBudgets)
app.post('/api/budget', createBudget)
app.put('/api/budget', updateBudget)
app.delete('/api/budget/:id', deleteBudget)

app.get('/api/transaction', getTransactions)
app.post('/api/transaction', createTransaction)
app.put('/api/transaction', updateTransaction)
app.delete('/api/transaction/:id', deleteTransaction)

app.get('/api/summary', getSummary)


app.use(express.static(__dirname + '/../dist'))
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(SERVER_PORT, console.log(`Listening on port http://localhost:${SERVER_PORT}`))