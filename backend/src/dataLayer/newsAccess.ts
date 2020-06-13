import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { NewsItem } from '../models/NewsItem'
import { NewsUpdate } from '../models/NewsUpdate'
//import { SignedURLRequest } from '../models/SignedUrlRequest'

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export class NewsItemAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly indexName = process.env.INDEX_NAME,
    private readonly newsTable = process.env.NEWS_TABLE
  ) {}

  // async getAllGroups(): Promise<Group[]> {
  //     console.log('Getting all groups')

  //     const result = await this.docClient.scan({
  //       TableName: this.groupsTable
  //     }).promise()

  //     const items = result.Items
  //     return items as Group[]
  //   }

  async getAllNews(userId: string): Promise<NewsItem[]> {
    console.log('dataLayer: Getting all news for userId', userId)

    const result = await this.docClient
      .query({
        TableName: this.newsTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return items as NewsItem[]
  }

  async createNews(newsItem: NewsItem) {
    await this.docClient
      .put({
        TableName: this.newsTable,
        Item: newsItem
      })
      .promise()
  }

  async deleteNews(userId: string, newsId: string) {
    await this.docClient
      .delete({
        TableName: this.newsTable,
        Key: {
          userId,
          newsId
        }
      })
      .promise()
  }

  async getNews(userId: string, newsId: string) {
    console.log('dataLayer: Getting news for userId', newsId, userId)
    const result = await this.docClient
      .get({
        TableName: this.newsTable,
        Key: {
          userId,
          newsId
        }
      })
      .promise()

    return result.Item as NewsItem
  }

  async updateNews(
    userId: string,
    newsId: string,
    updatedNewsItem: NewsUpdate
  ) {
    console.log('dataLayer: Getting news for userId', newsId, userId)
    await this.docClient
      .update({
        TableName: this.newsTable,
        Key: {
          userId,
          newsId
        },
        UpdateExpression: 'set #description = :n, #priority = :d',
        ExpressionAttributeValues: {
          ':n': updatedNewsItem.description,
          ':d': updatedNewsItem.priority
        },
        ExpressionAttributeNames: {
          '#description': 'description',
          '#priority': 'priority'
        }
      })
      .promise()
  }
}

/**
 * Fields in a request to get a Signed URL request
 */
// export interface SignedURLRequest {
//     Bucket: string,
//     Key: string,
//     Expires: number
//   }

export function getPresignedUploadURL(userId: string, newsId: string) {
  console.log('userId: ', userId)

  const url = s3.getSignedUrl('putObject', {
    Bucket: process.env.IMAGES_S3_BUCKET,
    Key: newsId,
    Expires: process.env.SIGNED_URL_EXPIRATION
  })

  const newUrl = url.split('?')[0]
  console.log('newUrl: ', newUrl)

  return url
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}
