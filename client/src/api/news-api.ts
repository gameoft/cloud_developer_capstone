import { apiEndpoint } from '../config'
import { News } from '../types/News'
import { CreateNewsRequest } from '../types/CreateNewsRequest'
import Axios from 'axios'
import { UpdateNewsRequest } from '../types/UpdateNewsRequest'

export async function getAllNews(idToken: string): Promise<News[]> {
  console.log('Fetching News')

  const response = await Axios.get(`${apiEndpoint}/news`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('News:', response.data)
  return response.data.items
}

export async function createNews(
  idToken: string,
  newNewsItem: CreateNewsRequest
): Promise<News> {
  const response = await Axios.post(
    `${apiEndpoint}/news`,
    JSON.stringify(newNewsItem),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchNews(
  idToken: string,
  todoId: string,
  updatedNews: UpdateNewsRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/news/${todoId}`,
    JSON.stringify(updatedNews),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteNews(
  idToken: string,
  newsId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/news/${newsId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  newsId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/news/${newsId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
