import fs from 'fs'
import path from 'path'


const read = dir => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'model', dir)))

const write = (dir, data) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path.join(process.cwd(), 'model', dir))) {
            return reject(new Error("Path does not exists"))
        }

        fs.writeFile(path.join(process.cwd(), 'model', dir), JSON.stringify(data, null, 4), err =>{
            if (err) reject(err)

            resolve(data.at(-1))
        })
    })
}

export {
    read,
    write
}