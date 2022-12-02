import React, { Component } from 'react'
import { Alert } from 'antd'

import { movieDBService } from '../../MovieDBService/MovieDBService'
import MovieList from '../MovieList/MovieList'
import Spinner from '../Spinner/Spinner'
import './Rated.css'
import Pagination from '../Pagination/Pagination'

class Rated extends Component {
  constructor() {
    super()
    this.state = {
      totalResults: null,
      currentPage: 1,
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
    const { sessionId, renderRatedMovies, setError, setLoading } = this.props
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
        setLoading(false)
      })
  }

  onChangeCurrentPageHandler = (page) => {
    this.setState({
      currentPage: page,
    })
  }

  render() {
    const { dataRated, loading, sessionId, error } = this.props
    const { totalResults, currentPage } = this.state
    const err = error ? (
      <Alert message="Что-то пошло не так, попробуйте повторить ваш запрос или включите VPN" type="error" />
    ) : null
    const noContent =
      !dataRated.length && !loading ? <Alert message="Вы не оценили ни одного фильма" type="info" /> : null
    return (
      <div className="ratedWrap">
        {noContent}
        {err}
        {loading ? <Spinner /> : <MovieList movies={dataRated} sessionId={sessionId} />}
        <Pagination
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
