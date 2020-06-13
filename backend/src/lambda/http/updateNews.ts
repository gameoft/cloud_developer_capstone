import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { updateNews } from '../../businessLogic/news'

import { UpdateNewsRequest } from '../../requests/UpdateNewsRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newsId = event.pathParameters.newsId
  const updatedNews: UpdateNewsRequest = JSON.parse(event.body)
  console.log('Update news: ', newsId, updatedNews)

  if (updatedNews.description == '') {
    const errmessage = 'Please insert a description for News item.'

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ errmessage })
    }
  }

  const item = await updateNews(event, updatedNews)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(item)
  }
}
