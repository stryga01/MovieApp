import React, { Component } from 'react'
import { Alert, Input } from 'antd'

import Spinner from '../Spinner/Spinner'
import MovieList from '../MovieList/MovieList'
import Pagination from '../Pagination/Pagination'

export default class SearchTab extends Component {
  componentDidMount() {
    const { query, currentPage } = this.props
    this.props.getMoviesDebounce(query, currentPage)
  }

  componentDidUpdate(prevProps) {
    const { disconnect, setPage, setError, setLoading, query, getMoviesDebounce, currentPage } = this.props
    if (disconnect) return
    if (prevProps.query !== this.props.query) {
      setError(false)
      setLoading(true)
      setPage(1)
      getMoviesDebounce(query, currentPage)
    } else if (prevProps.currentPage !== this.props.currentPage) {
      setLoading(true)
      getMoviesDebounce(query, currentPage)
    }
  }

  onChangeQueryHandler = (e) => {
    this.props.setQuery(e.target.value)
  }

  onChangeCurrentPageHandler = (page) => {
    this.props.setPage(page)
  }

  render() {
    const { loading, dataMovies, totalResults, error, query, currentPage, sessionId, setLoading } = this.props
    const spinner = loading ? <Spinner /> : null
    const content = !loading ? <MovieList movies={dataMovies} sessionId={sessionId} setLoading={setLoading} /> : null
    const NotFound =
      !dataMovies.length && !loading ? <Alert message="По вашему запросу ничего не нашлось" type="info" /> : null
    const err = error ? (
      <Alert message="Что-то пошло не так, попробуйте повторить ваш запрос или включите VPN" type="error" />
    ) : null
    return (
      <div className="tabWrap">
        <Input placeholder="Type to search..." value={query} size="large" onChange={this.onChangeQueryHandler} />
        <div className="contentWrap">
          {err}
          {NotFound}
          {content}
          {spinner}
          <Pagination
            loading={loading}
            totalResults={totalResults}
            currentPage={currentPage}
            onChangeCurrentPageHandler={this.onChangeCurrentPageHandler}
          />
        </div>
      </div>
    )
  }
}
