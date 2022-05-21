const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }])


module.exports = cpUpload