const AWS = require('aws-sdk');
const digester = require('digest-stream');

const handleRequestFunc = async (event, _context, callback) => {
  generateDigest(event.bucket, event.key)
    .then((digest) => callback(null, digest));
}

const generateDigest = (bucket, key) => {
  return new Promise((resolve, reject) => {
    let s3Stream = new AWS.S3()
      .getObject({ Bucket: bucket, Key: key })
      .createReadStream();

    let digestStream = digester('sha256', 'hex', (digest, _length) => { resolve(digest); });

    let fileDump = fs
      .createWriteStream('/dev/null')
      .on("error", err => reject(err));

    s3Stream.pipe(digestStream).pipe(fileDump);
  })
}

module.exports = {handleRequestFunc, generateDigest};