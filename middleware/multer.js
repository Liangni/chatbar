const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({
    dest: 'temp/',
    storage
})
const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }])

module.exports = cpUpload
