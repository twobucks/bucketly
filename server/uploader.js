const Promise = require('bluebird')
const fs = require('fs')
const AWS = require('aws-sdk')
const utils = require('./utils')
const s3publicUrl = require('s3-public-url')

class ArgumentError extends Error {}

class Uploader {
  constructor (args) {
    if (!args.accessKey) {
      throw new ArgumentError('accessKey is missing from arguments')
    }

    if (!args.secretKey) {
      throw new ArgumentError('secretKey is missing from arguments')
    }

    if (!args.bucketName) {
      throw new ArgumentError('bucketName is missing from arguments')
    }

    this.bucketName = args.bucketName
    this.s3 = new AWS.S3({
      accessKeyId: args.accessKey,
      secretAccessKey: args.secretKey
    })
    this.policy = utils.getPublicReadPolicy(args.bucketName)
    Promise.promisifyAll(Object.getPrototypeOf(this.s3))
  }

  async upload (args) {
    if (!args.path) {
      throw new ArgumentError('path is missing from arguments')
    }

    if (!args.key) {
      throw new ArgumentError('key is missing from arguments')
    }

    await this.s3.createBucketAsync({ Bucket: this.bucketName })
    await this.s3.putBucketPolicyAsync({ Bucket: this.bucketName,
      Policy: JSON.stringify(this.policy) })
    await this.s3.putObjectAsync({
      Bucket: this.bucketName,
      Key: args.key,
      Body: fs.createReadStream(args.path)
    })

    const { locationConstraint } = await this.s3.getBucketLocationAsync({ Bucket: this.bucketName })
    return s3publicUrl.getHttps(this.bucketName, args.key, locationConstraint)
  }

  async delete (args) {
    if (!args.key) {
      throw new ArgumentError('key is missing from arguments')
    }

    return this.s3.deleteObjectAsync({
      Bucket: this.bucketName,
      Key: args.key
    })
  }
}

module.exports = Uploader
