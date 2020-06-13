import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateNewsRequest } from '../../requests/CreateNewsRequest'

import { createNews } from '../../businessLogic/news'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newNewsItem: CreateNewsRequest = JSON.parse(event.body)

  console.log('Create news: ', newNewsItem)

  if (newNewsItem.description == '') {
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

  // Implement creating a new TODO item
  //return undefined

  const item = await createNews(event, newNewsItem)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item })
  }
}
