if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const AWS = require('aws-sdk')

const { AWS_S3_ACCESSKEY, AWS_S3_SECRET_ACCESS_KEY } = process.env

const s3 = new AWS.S3({
    accessKeyId: AWS_S3_ACCESSKEY,
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
})

module.exports = s3
