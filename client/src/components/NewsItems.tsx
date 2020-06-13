import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  TextArea,
  Table,
  Icon,
  Input,
  Image,
  Form,
  Loader
} from 'semantic-ui-react'

import { createNews, deleteNews, getAllNews, patchNews } from '../api/news-api'
import Auth from '../auth/Auth'
import { News } from '../types/News'

interface NewsProps {
  auth: Auth
  history: History
}

interface NewsState {
  news: News[]
  newNewsDescription: string
  loadingNews: boolean
}

export class NewsItems extends React.PureComponent<NewsProps, NewsState> {
  state: NewsState = {
    news: [],
    newNewsDescription: '',
    loadingNews: true
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newNewsDescription: event.target.value })
  }

  onEditButtonClick = (newsId: string) => {
    this.props.history.push(`/news/${newsId}/edit`)
  }

  onNewsCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      //const dueDate = this.calculateDueDate()
      const newNewsItem = await createNews(this.props.auth.getIdToken(), {
        description: this.state.newNewsDescription
      })
      this.setState({
        news: [...this.state.news, newNewsItem],
        newNewsDescription: ''
      })
    } catch {
      alert('News item creation failed')
    }
  }

  onNewsDelete = async (newsId: string) => {
    try {
      await deleteNews(this.props.auth.getIdToken(), newsId)
      this.setState({
        news: this.state.news.filter((news) => news.newsId != newsId)
      })
    } catch {
      alert('News deletion failed')
    }
  }

  onNewsCheck = async (pos: number) => {
    try {
      const news = this.state.news[pos]
      await patchNews(this.props.auth.getIdToken(), news.newsId, {
        description: news.description,
        priority: !news.priority
      })
      this.setState({
        news: update(this.state.news, {
          [pos]: { priority: { $set: !news.priority } }
        })
      })
    } catch {
      alert('News Check failed')
    }
  }

  async componentDidMount() {
    try {
      const news = await getAllNews(this.props.auth.getIdToken())
      this.setState({
        news,
        loadingNews: false
      })
    } catch (e) {
      alert(`Failed to fetch news items: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">URL MEMORIZER</Header>

        {this.renderCreateNewsInput()}

        {/* <Header as='h3' block> Block Header </Header> */}
        {this.renderNews()}
      </div>
    )
  }

  renderCreateNewsInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New url',
              onClick: this.onNewsCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Discounted smartphone URL..."
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderNews() {
    if (this.state.loadingNews) {
      return this.renderLoading()
    }

    return this.renderNewsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading NEWS items
        </Loader>
      </Grid.Row>
    )
  }

  renderNewsList() {
    return (
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell singleLine>priority</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Images</Table.HeaderCell>
            <Table.HeaderCell>URL</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.news.map((news, pos) => {
            return (
              <Table.Row key={news.newsId}>
                <Table.Cell width={1} textAlign="center">
                  <Checkbox
                    onChange={() => this.onNewsCheck(pos)}
                    checked={news.priority}
                  />
                </Table.Cell>
                <Table.Cell singleLine>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(news.newsId)}
                  >
                    <Icon name="pencil" />
                  </Button>

                  <Button
                    icon
                    color="red"
                    onClick={() => this.onNewsDelete(news.newsId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {news.attachmentUrl && (
                    <Image
                      style={{ 'font-size': 48 }}
                      avatar
                      src={news.attachmentUrl}
                      //size=""
                      wrapped
                    />
                  )}
                </Table.Cell>
                <Table.Cell width={13} textAlign="left">
                  {' '}
                  {news.description}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>

      // <Grid padded>
      //   {this.state.news.map((news, pos) => {
      //     return (
      //       <Grid.Row key={news.newsId}>
      //         <Grid.Column width={1} verticalAlign="middle">
      //           <Checkbox
      //             onChange={() => this.onNewsCheck(pos)}
      //             checked={news.priority}
      //           />
      //         </Grid.Column>
      //         <Grid.Column width={1} floated="left">
      //           <Button
      //             icon
      //             color="blue"
      //             onClick={() => this.onEditButtonClick(news.newsId)}
      //           >
      //             <Icon name="pencil" />
      //           </Button>
      //         </Grid.Column>
      //         <Grid.Column width={1} floated="left">
      //           <Button
      //             icon
      //             color="red"
      //             onClick={() => this.onNewsDelete(news.newsId)}
      //           >
      //             <Icon name="delete" />
      //           </Button>
      //         </Grid.Column>

      //         {/* <Form>
      //           <TextArea width={13}> {news.description} </TextArea>
      //         </Form> */}

      //         <Grid.Column width={13} verticalAlign="middle" wrapped>
      //           {news.description}
      //         </Grid.Column>
      //         {/* <Grid.Column width={3} floated="right">
      //           {todo.dueDate}
      //         </Grid.Column> */}

      //         {news.attachmentUrl && (
      //           <Image src={news.attachmentUrl} size="small" wrapped />
      //         )}
      //         <Grid.Column width={16}>
      //           <Divider />
      //         </Grid.Column>
      //       </Grid.Row>
      //     )
      //   })}
      // </Grid>
    )
  }

  // calculateDueDate(): string {
  //   const date = new Date()
  //   date.setDate(date.getDate() + 7)

  //   return dateFormat(date, 'yyyy-mm-dd') as string
  // }
}
