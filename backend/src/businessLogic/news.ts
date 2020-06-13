import * as uuid from 'uuid'

import { APIGatewayProxyEvent } from 'aws-lambda'

import { NewsItem } from '../models/NewsItem'
import { NewsItemAccess, getPresignedUploadURL } from '../dataLayer/newsAccess'

import { CreateNewsRequest } from '../requests/CreateNewsRequest'
import { UpdateNewsRequest } from '../requests/UpdateNewsRequest'

import { createLogger } from '../utils/logger'
import { getUserId } from '../lambda/utils'

const newsItemAccess = new NewsItemAccess()
const logger = createLogger('businessLogic')
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllNews(
  event: APIGatewayProxyEvent
): Promise<NewsItem[]> {
  const userId = getUserId(event)
  logger.info('Call getAllNews userId= ', userId)

  return await newsItemAccess.getAllNews(userId)
}

export async function createNews(
  event: APIGatewayProxyEvent,
  createNewsRequest: CreateNewsRequest
): Promise<NewsItem> {
  const createdAt = new Date(Date.now()).toISOString()
  const userId = getUserId(event)
  const newsId = uuid.v4()

  const newNewsItem = {
    userId,
    newsId,
    createdAt,
    priority: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${newsId}`,
    ...createNewsRequest
  }

  logger.info('Call createNews', newNewsItem)
  await newsItemAccess.createNews(newNewsItem)

  return newNewsItem
}

export async function deleteNews(event: APIGatewayProxyEvent) {
  const newsId = event.pathParameters.newsId

  console.log('Delete news item: ', newsId)

  const userId = getUserId(event)
  console.log('userId= ', userId)

  if (!(await newsItemAccess.getNews(userId, newsId))) {
    return false
  }
  await newsItemAccess.deleteNews(userId, newsId)

  return
}

export async function updateNews(
  event: APIGatewayProxyEvent,
  updateNewsRequest: UpdateNewsRequest
) {
  const newsId = event.pathParameters.newsId
  console.log('Update News: ', newsId)
  const userId = getUserId(event)
  console.log('userId= ', userId)
  if (!(await newsItemAccess.getNews(userId, newsId))) {
    return false
  }
  await newsItemAccess.updateNews(userId, newsId, updateNewsRequest)
  logger.info('Updated News')

  return
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
  const newsId = event.pathParameters.newsId
  logger.info('Call getUserId newsId, ', newsId)
  const userId = getUserId(event)
  logger.info('userId=', userId)
  logger.info('call getPresignedUploadURL')
  return getPresignedUploadURL(userId, newsId)
}
