const router = require('find-my-way')()
const catController = require('../controller/cat')

router.on('GET', '/cat', async (req, res) => {
    const result = await catController.getCats()
    res.end(JSON.stringify(result))
})

router.on('GET', '/user', async (req, res) => {
    const result = await catController.getUsers()
    res.end(JSON.stringify(result))
})

router.on('GET', '/cat/:catId', async (req, res, params) => {
    const result = await catController.getCatById(res, params.catId)
    res.end(JSON.stringify(result))
})

router.on('GET', '/user/:userId', async (req, res, params) => {
    const result = await catController.getUserById(res, params.userId)
    res.end(JSON.stringify(result))
})

router.on('POST', '/cat', async (req, res) => {
    const result = await catController.createCat(req)
    res.end(JSON.stringify(result))
})

router.on('POST', '/user', async (req, res) => {
    const result = await catController.createUser(req)
    res.end(JSON.stringify(result))
})

router.on('PUT', '/cat/:catId', async (req, res, { catId }) => {
    const result = await catController.updateCatById(req, res, catId)
    res.end(JSON.stringify(result))
})

router.on('PUT', '/user/:userId', async (req, res, { userId }) => {
    const result = await catController.updateUserById(req, res, userId)
    res.end(JSON.stringify(result))
})

router.on('DELETE', '/cat/:catId', async (req, res, { catId }) => {
    const result = await catController.deleteCatById(res, catId)
    res.end(JSON.stringify(result))
})


router.on('DELETE', '/user/:userId', async (req, res, { userId }) => {
    const result = await catController.deleteUserById(res, userId)
    res.end(JSON.stringify(result))
})

module.exports = router
