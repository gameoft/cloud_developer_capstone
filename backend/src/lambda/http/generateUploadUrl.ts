import 'source-map-support/register'
import { generateUploadUrl } from '../../businessLogic/news'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newsId = event.pathParameters.newsId
  console.log('Call generateUploadUrl: ', newsId)
  console.log('event: ', event)

  const signedUrl = await generateUploadUrl(event)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}
