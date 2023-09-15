const s3 = require('../config/aws');

const uploadPromise = (params) => new Promise((resolve, reject) => {
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('s3 upload err', err.stack);
      return reject(err.stack);
    }
    console.warn('Bucket created successfully', data.Location);
    return resolve(data.Location);
  });
});

module.exports = { uploadPromise };
