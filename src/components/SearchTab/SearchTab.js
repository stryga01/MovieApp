import React, { Component } from 'react'
import { Alert, Input } from 'antd'
import { debounce } from 'lodash'

import Spinner from '../MovieApp/Spinner'
import MovieList from '../MovieList/MovieList'
import PaginationRenderer from '../PaginationRenderer/PaginationRenderer'

export default class SearchTab extends Component {
  componentDidMount() {
    this.moviesDebounce = debounce(this.props.getMovies, 1000, { leading: false, trailing: true })
    this.props.setError(false)
    this.moviesDebounce()
  }

  componentDidUpdate(prevProps) {
    const { disconnect, setLoading, setPage, setNotFound, setError } = this.props
    if (disconnect) return
    if (prevProps.query !== this.props.query) {
      setError(false)
      setLoading(true)
      setNotFound(false)
      setPage(1)
      this.moviesDebounce()
    } else if (prevProps.currentPage !== this.props.currentPage) {
      setLoading(true)
      this.moviesDebounce()
    }
  }

  onChangeQueryHandler = (e) => {
    this.props.setQuery(e.target.value)
  }

  onChangeCurrentPageHandler = (page) => {
    this.props.setPage(page)
  }

  render() {
    const { loading, dataMovies, totalResults, notFound, error, query, currentPage, sessionId } = this.props
    const spinner = loading ? <Spinner /> : null
    const content = !loading ? <MovieList movies={dataMovies} sessionId={sessionId} /> : null
    const NotFound = notFound ? <Alert message="По вашему запросу ничего не нашлось" type="info" /> : null
    const err = error ? (
      <Alert message="Что-то пошло не так, попробуйте повторить ваш запрос или включите VPN" type="error" />
    ) : null
    return (
      <div className="tabWrap">
        <Input placeholder="Type to search..." value={query} size="large" onChange={this.onChangeQueryHandler} />
        <div className="contentWrap">
          {err}
          {content}
          {spinner}
          {NotFound}
          <PaginationRenderer
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
