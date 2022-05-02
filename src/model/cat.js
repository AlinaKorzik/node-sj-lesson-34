const { createReadStream, writeFile } = require('fs')
const path = require('path')

const dbJsonPath = path.resolve(process.cwd(), 'src/services/db_cats.json')
const dbJsonPathUsers = path.resolve(process.cwd(), 'src/services/db_user.json')

const readJSONAsync = (path) => new Promise((resolve) => {
    const readStream = createReadStream(path)
    let result = ''
    readStream
        .on('data', (chunk) => {
            result += chunk.toString()
        })
        .on('end', (chunk) => {
            if (!result) {
                resolve([])
            } else {
                resolve(JSON.parse(result))
            }
        })
})

const writeJSONAsync = (path, data) => new Promise((resolve, reject) => {
    const buff = Buffer.from(JSON.stringify(data, null, 4))
    writeFile(path, buff, (err) => {
        err ? reject(err) : resolve()
    })
})

exports.fetchAllCats = async() => {
    return await readJSONAsync(dbJsonPath)
}

exports.fetchAllUsers = async() => {
    return await readJSONAsync(dbJsonPathUsers)
}

exports.fetchCatById = async (id) => {
    const cats = await readJSONAsync(dbJsonPath)
    return cats.find((cat) => cat.id === id)
}

exports.fetchUserById = async (id) => {
    const users = await readJSONAsync(dbJsonPathUsers)
    return users.find((user) => user.id === id)
}

exports.addNewCat = async (data) => {
    const cats = await readJSONAsync(dbJsonPath)
    cats.push(data)
    await writeJSONAsync(dbJsonPath, cats)
}

exports.addNewUser = async (data) => {
    const users = await readJSONAsync(dbJsonPathUsers)
    users.push(data)
    await writeJSONAsync(dbJsonPathUsers, users)
}

exports.update = async (dataOfNewCat) => {
    const cats = await readJSONAsync(dbJsonPath)
    const foundCatIndex = cats.findIndex(cat => cat.id === dataOfNewCat.id)
    if (foundCatIndex === -1) {
        return false
    }
    cats[foundCatIndex] = dataOfNewCat
    await writeJSONAsync(dbJsonPath, cats)
    return true
}

exports.updateUser = async (dataOfNewUser) => {
    const users = await readJSONAsync(dbJsonPathUsers)
    const foundUserIndex = users.findIndex(user => user.id === dataOfNewUser.id)
    if (foundUserIndex === -1) {
        return false
    }
    users[foundUserIndex] = dataOfNewUser
    await writeJSONAsync(dbJsonPathUsers, users)
    return true
}

exports.delete = async (id) => {
    // 1 взять всех котов
    const cats = await readJSONAsync(dbJsonPath)
    // 2 удалить кота по id
    let catBeenFound = false
    const filteredCats = cats.filter(cat => {
        if (cat.id !== id) {
            return true
        }
        catBeenFound = true
        return false
    })
    if (catBeenFound) {
        // 3 сохранить обновленный масив котов
        await writeJSONAsync(dbJsonPath, filteredCats)
        return true
    }
    return false
}

exports.deleteUser = async (id) => {
    const users = await readJSONAsync(dbJsonPathUsers)
    let userBeenFound = false
    const filteredUsers = users.filter(user => {
        if (user.id !== id) {
            return true
        }
        userBeenFound = true
        return false
    })
    if (userBeenFound) {
        const cats = await readJSONAsync(dbJsonPath)
        cats.forEach((cat) => {
            if(id === cat.ownerId) {
                cat.ownerId = null
            }
        })
        console.log(filteredUsers)
        await writeJSONAsync(dbJsonPathUsers, filteredUsers)
        await writeJSONAsync(dbJsonPath, cats)
        return true
    }
    return false
}
