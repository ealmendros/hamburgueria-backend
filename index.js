const express = require('express')
const uuid = require('uuid')

const app = express()
const port = 3000
app.use(express.json())


const orders = []
const orderUpdate = []

// MEU MIDDLEWARE

const checkerUseId = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {

        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex = index
    request.userId = id


    next()

    const metodo = request.method
    const url = request.url

    console.log([metodo], url)

}

// MEU MIDDLEWARE

const checkConsole = (request, response, next) => {

    const metodo = request.method
    const url = request.url


    console.log([metodo], url)

    next()

}



// LISTA TODOS OS PEDIDOS
app.get('/order', checkConsole, (request, response) => {

    //const metodo = request.method
    //const url = request.url

    //console.log([metodo], url)


    return response.json(orders)


})

// CRIAR O PEDIDO
app.post('/order', checkConsole, (request, response) => {


    const { order, clientName, price, status } = request.body

    const order_ = { id: uuid.v4(), order, clientName, price, status }

    orders.push(order_)


    return response.status(201).json(order_)


})

// ALTERAR UM PEDIDO
app.put('/order/:id', checkConsole, checkerUseId, (request, response) => {

    const index = request.userIndex
    const id = request.userId


    const { order, clientName, price, status } = request.body

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder


    return response.json(updateOrder)

})



// LISTA PEDIDOS ESPECÍFICOS PELO ID

app.get('/order/:id', checkConsole, checkerUseId, (request, response) => {

    const id = request.userId

    /*
        const {id} = request.params // funcionou

        const index = orders.findIndex( order => order.id === id)

        if (index < 0) {

            return response.status(404).json({message:"User not found"})
        }
        */

    const orderFilter = orders.find(order => order.id === id)

    return response.json(orderFilter)

})


// DELETAR UM PEDIDO PELO ID

app.delete('/order/:id', checkConsole, checkerUseId, (request, response) => {

    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json()

})


// MUDAR O STATUS DO PEDIDO PELO ID

app.patch('/order/:id', checkConsole, checkerUseId, (request, response) => {

    const id = request.userId

    const order = orders.find(order => order.id === id)

    const orderAct = {
        ...order,
        ...request.body
    }

    orderUpdate.push(orderAct)

    return response.json(orderAct)

})


// LISTA TODOS OS PEDIDOS ATUALIZADOS
app.get('/order/:id', checkConsole, (request, response) => {



    return response.json(orderUpdate)





})





app.listen(port, () => {

    console.log(`💿 Server started on port ${port}`)

})