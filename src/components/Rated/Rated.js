import React, { Component } from 'react'
import { Alert } from 'antd'

import { movieDBService } from '../../MovieDBService/MovieDBService'
import MovieList from '../MovieList/MovieList'
import Spinner from '../MovieApp/Spinner'
import './Rated.css'
import PaginationRenderer from '../PaginationRenderer/PaginationRenderer'

class Rated extends Component {
  constructor() {
    super()
    this.state = {
      totalResults: null,
      currentPage: 1,
      noContentAlert: false,
    }
  }
  componentDidMount() {
    this.renderRatedMovies()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.renderRatedMovies()
    }
  }

  renderRatedMovies = () => {
    const { getRatedMovies } = movieDBService
    const { sessionId, renderRatedMovies, setLoading, setError } = this.props
    const { currentPage } = this.state
    setError(false)
    setLoading(true)
    getRatedMovies(sessionId, currentPage)
      .then(({ results, total_results }) => {
        if (!results.length) {
          this.setState({
            noContentAlert: true,
          })
        }
        this.setState({
          totalResults: total_results,
        })
        renderRatedMovies(results)
      })
      .catch(() => {
        setError(true)
      })
  }

  onChangeCurrentPageHandler = (page) => {
    this.setState({
      currentPage: page,
    })
  }

  render() {
    const { dataRated, loading, sessionId, error } = this.props
    const { totalResults, currentPage, noContentAlert } = this.state
    const err = error ? (
      <Alert message="Что-то пошло не так, попробуйте повторить ваш запрос или включите VPN" type="error" />
    ) : null
    const noContent = noContentAlert ? <Alert message="Вы не оценили ни одного фильма" type="info" /> : null
    return (
      <div className="ratedWrap">
        {noContent}
        {err}
        {loading ? <Spinner /> : <MovieList movies={dataRated} sessionId={sessionId} />}
        <PaginationRenderer
          loading={loading}
          totalResults={totalResults}
          currentPage={currentPage}
          onChangeCurrentPageHandler={this.onChangeCurrentPageHandler}
        />
      </div>
    )
  }
}

export default Rated
