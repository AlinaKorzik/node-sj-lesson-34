const catModel = require('../model/cat')
const { v4: uuid } = require('uuid')

const getNotFoundResponse = (res) => {
    res.writeHead(404)
    return {
        error: {
            message: "Not found",
            code: 404
        }
    }
}

const parseJsonBody = (request) => new Promise((resolve, reject) => {
    let rawJson = ''
    request
        .on('data', (chunk) => {
            rawJson += chunk
        })
        .on('end', () => {
            try {
                if (rawJson) {
                    const requestBody = JSON.parse(rawJson)
                    resolve(requestBody)
                } else {
                    resolve(null)
                }
            } catch (err) {
                reject(err)
            }
        })
        .on('error', reject)
})

const createCache = () => {
    let cache = {}

    setInterval(() => {
        cache = {}
        console.log('Cache clear!')
    }, 60000)

    return async (key, cb, res) => {
        if (cache[key]) {
            res.setHeader('X-Cached-Key', key)
            return cache[key]
        }
        const data = await cb(key)
        cache[key] = data
        return data
    }
}

const cache = createCache()

exports.getCats = async () => {
    const cats = await catModel.fetchAllCats()
    if (!cats.lenght) {
        return getNotFoundResponse(res)
    }
    return cats
}

exports.getUsers = async () => {
    const users = await catModel.fetchAllUsers()
    if (!users.lenght) {
        return getNotFoundResponse(res)
    }
    return users
}

exports.getCatById = async (res, catId) => {
    const cat = await cache(catId, catModel.fetchCatById, res)
    if (!cat) {
        return getNotFoundResponse(res)
    }
    return cat
}

exports.getUserById = async (res, userId) => {
    const user = await cache(userId, catModel.fetchUserById, res)
    const cats = await catModel.fetchAllCats()
    const pets = user.pets.split(', ')
    let arrOfPets = [];
    cats.forEach((cat) => {
        if(pets.includes(cat.id)) {
            arrOfPets.push(cat)
       }
    })
    user.arrOfPets = arrOfPets
    
    if(!user) {
        return getNotFoundResponse(res)
    }
    return user
}

exports.createCat = async (req) => {
    const catData = await parseJsonBody(req)
    catData.id = uuid()
    catData.ownerId = null
    await catModel.addNewCat(catData)
    return {
        catData
    }
}

exports.createUser = async (req) => {
    const userData = await parseJsonBody(req)
    userData.id = uuid()
    const cats = await catModel.fetchAllCats()
    const pets = userData.pets.split(', ')
    cats.forEach((cat) => {
        if(pets.includes(cat.id)) {
            cat.ownerId = userData.id
       }
    })
    await catModel.addNewUser(userData)
    return {
        userData
    }
}

exports.updateCatById = async (req, res, catId) => {
    const updateData = await parseJsonBody(req)
    const cat = await catModel.fetchCatById(catId)
    const updatedCat = { ...cat, ...updateData }
    const updateResult = await catModel.update(updatedCat)
    if (!updateResult) {
        return getNotFoundResponse(res)
    }
    return updatedCat
}

exports.updateUserById = async (req, res, userId) => {
    const updateData = await parseJsonBody(req)
    const user = await catModel.fetchUserById(userId)
    const updatedUser = { ...user, ...updateData }
    const updateResult = await catModel.updateUser(updatedUser)
    if (!updateResult) {
        return getNotFoundResponse(res)
    }
    return updatedUser
}

exports.deleteCatById = async (res, catId) => {
    const updateResult = await catModel.delete(catId)
    if (!updateResult) {
        return getNotFoundResponse(res)
    }
    return {
        id: catId
    }
}

exports.deleteUserById = async (res, userId) => {
    const updateResult = await catModel.deleteUser(userId)
    if (!updateResult) {
        return getNotFoundResponse(res)
    }
    return {
        id: userId
    }
}