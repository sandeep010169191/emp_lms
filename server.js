require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
    {
        username: 'Sandeep',
        title: 'Emp 1'
    },
    {
        username: 'Suman',
        title: 'Emp 2'
    },
    {
        username: 'Rounak',
        title: 'Manager'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    //Authenticate User
    const username = req.body.username
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})

app.post('/api/applyLeave', authenticateToken, (req, res) => {
    res.json(
        {
            message: "Apply for Leave",
            user: posts.filter(post => post.username === req.user.name)
        }
    )  
})

app.post('/api/approveLeave', authenticateToken, (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decodedValue = JSON.parse(atob(token.split('.')[1]))

    if (decodedValue.name == "Rounak") {
        res.json({ message: "Approved" })
    } else {
        res.json({ message: "Not Approved" })
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)