const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongojs = require('mongojs')
const db = mongojs('shoppingcart_db', ['items'])

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripe = require('stripe')(stripeSecretKey)

app.use(morgan('short'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('./client'))


app.get('/', (req, res) => {

    db.items.find((err, data) => {
        if (err) {
            console.log("Error fetching data...")
        } else {
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: data
            })
        }
    })
})

app.get('/modify', (req,res) => {
    db.items.find((err, data) => {
        if (err) {
            console.log('Error populating dropdown list...')
        } else {
            res.render('modify_merch.ejs', {dropdownVals: data})
        }      
    })
})

// item object
function store_item(name, price, img) {
    this.name = name;
    this.price = price;
    this.img = img;
}

app.post('/addItem', (req, res) => {
    console.log('adding a new item...')
    var itemNew = new store_item(req.body.add_name, req.body.add_price, req.body.add_img)
    db.items.save(itemNew, (err, savedItem) => {
        if (err) {
            console.log('Error saving data...')
        } else {
            console.log('item: ' + savedItem.name + ' saved')
        }
    })
    res.redirect('/modify')
})

app.post('/removeItem', (req, res) => {
    const itemRemove = req.body.itemsRemoveList
    db.items.remove({name: itemRemove})
    console.log('Removing Item: ' + itemRemove)
    res.redirect('/modify')
})

app.post('/removeAll', (req, res) => {
    db.items.remove( { } )
    console.log('Removing all merchandise...')
    res.redirect('/modify')
})

app.post('/purchase', (req, res) => {
    res.end()
})

app.listen(3000, () => {
    console.log('Server is running on port 3000...')
})
