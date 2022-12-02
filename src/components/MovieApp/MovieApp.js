import React, { Component } from 'react'
import { Alert, Tabs } from 'antd'
import { debounce } from 'lodash'
import { Offline } from 'react-detect-offline'

import { movieDBService } from '../../MovieDBService/MovieDBService'
import { Provider } from '../../context/GenresContext'
import SearchTab from '../SearchTab/SearchTab'
import Rated from '../Rated/Rated'
import './MovieApp.css'

export default class MovieApp extends Component {
  constructor() {
    super()
    this.state = {
      dataMovies: [],
      dataRated: [],
      genres: [],
      loading: false,
      totalResults: null,
      error: false,
      disconnect: false,
      query: '',
      currentPage: 1,
      sessionId: null,
    }
    this.getMoviesDebounce = debounce(this.getMovies, 1000, { leading: false, trailing: true })
  }

  componentDidMount() {
    const { createGuestSession, getGenres } = movieDBService
    this.setLoading(true)
    getGenres().then(({ genres }) => {
      this.setState({
        genres: [...genres],
      })
    })

    this.setState({
      sessionId:
        localStorage.getItem('sessionId') ||
        createGuestSession().then((sessionID) => {
          localStorage.setItem('sessionId', sessionID)
          this.setState({ sessionId: sessionID })
        }),
    })
  }

  renderRatedMovies = (result) => {
    this.setState({
      loading: false,
      dataRated: [...result],
    })
  }

  renderPopularMovies = (currentPage) => {
    const { getPopularMovies } = movieDBService
    const { setError, setData } = this
    getPopularMovies(currentPage)
      .then(({ results, total_results }) => {
        setData(results, total_results)
      })
      .catch(() => setError(true))
  }

  getMovies = (query, currentPage) => {
    const { setError, setData, renderPopularMovies, setLoading } = this
    const { searchMovies } = movieDBService
    if (!query) {
      renderPopularMovies(currentPage)
      return
    }
    searchMovies(query, currentPage)
      .then(({ results, total_results }) => {
        setData(results, total_results)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  setError = (bool) => {
    this.setState({
      error: bool,
    })
  }

  setQuery = (query) => {
    this.setState({ query })
  }

  setPage = (currentPage) => {
    this.setState({ currentPage })
  }

  setData = (results, total_results) => {
    this.setError(false)
    this.setState({
      dataMovies: [...results],
      totalResults: total_results,
    })
    this.setLoading(false)
  }

  setLoading = (bool) => {
    this.setState({
      loading: bool,
    })
  }

  render() {
    const { disconnect, dataMovies, query, currentPage, loading, totalResults, error, sessionId, dataRated, genres } =
      this.state
    const { setError, setData, setQuery, setPage, renderRatedMovies, setLoading, getMoviesDebounce } = this
    return (
      <Provider value={genres}>
        <Offline polling={{ enabled: false }}>
          <Alert type="error" message="Вы не подключениы к интернету" />
        </Offline>
        <div className="container">
          <Tabs
            size="large"
            defaultActiveKey="search"
            centered
            destroyInactiveTabPane="false"
            tabBarStyle={{ width: '115px', margin: '0 auto' }}
            tabBarGutter={20}
            items={[
              {
                label: 'Search',
                key: 'search',
                children: (
                  <SearchTab
                    disconnect={disconnect}
                    sessionId={sessionId}
                    dataMovies={dataMovies}
                    query={query}
                    currentPage={currentPage}
                    error={error}
                    totalResults={totalResults}
                    loading={loading}
                    setError={setError}
                    setData={setData}
                    getMoviesDebounce={getMoviesDebounce}
                    setQuery={(query) => setQuery(query)}
                    setPage={(page) => setPage(page)}
                    setLoading={setLoading}
                  />
                ),
              },
              {
                label: 'Rated',
                key: 'rated',
                children: (
                  <Rated
                    dataRated={dataRated}
                    sessionId={sessionId}
                    loading={loading}
                    error={error}
                    setError={setError}
                    setLoading={setLoading}
                    renderRatedMovies={(result) => renderRatedMovies(result)}
                  />
                ),
              },
            ]}
          />
        </div>
      </Provider>
    )
  }
}
