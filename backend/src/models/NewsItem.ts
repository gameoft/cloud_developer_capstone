export interface NewsItem {
  userId: string
  newsId: string
  createdAt: string
  description: string
  priority: boolean
  attachmentUrl?: string
}
