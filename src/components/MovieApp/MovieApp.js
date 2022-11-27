import React, { Component } from 'react'
import { Alert, Tabs } from 'antd'
import { Offline } from 'react-detect-offline'

import { movieDBService } from '../../MovieDBService/MovieDBService'
import { Provider } from '../GenresContext'
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
      notFound: false,
      sessionId: null,
    }
  }

  componentDidMount() {
    const { createGuestSession, getGenres } = movieDBService
    getGenres().then(({ genres }) => {
      this.setState({
        genres: [...genres],
      })
    })
    if (localStorage.getItem('sessionId')) {
      this.setState({
        sessionId: localStorage.getItem('sessionId'),
      })
      return
    }
    createGuestSession()
      .then(({ guest_session_id: sessionId }) => {
        window.localStorage.setItem('sessionId', sessionId)
        this.setState({
          sessionId: localStorage.getItem('sessionId'),
        })
      })
      .catch(() => {
        this.setError()
      })
  }

  renderRatedMovies = (result) => {
    this.setState({
      loading: false,
      dataRated: [...result],
    })
  }

  getMovies = () => {
    const { query, currentPage } = this.state
    const { setError, setData } = this
    const { searchMovies } = movieDBService
    if (!query) {
      this.setState({
        dataMovies: [],
        totalResults: null,
        loading: false,
      })
      return
    }
    searchMovies(query, currentPage)
      .then(({ results, total_results }) => {
        if (!results.length) this.setNotFound(true)
        setData(results, total_results)
      })
      .catch(() => {
        setError(true)
      })
  }

  setError = (bool) => {
    this.setState({
      loading: false,
      error: bool,
    })
  }

  setNotFound = (bool) => {
    this.setState({ notFound: bool })
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
  }

  setLoading = (bool) => {
    this.setState({
      loading: bool,
    })
  }

  render() {
    const {
      disconnect,
      dataMovies,
      query,
      currentPage,
      loading,
      totalResults,
      notFound,
      error,
      sessionId,
      dataRated,
      genres,
    } = this.state
    const { setError, setData, getMovies, setQuery, setPage, setLoading, setNotFound, renderRatedMovies } = this
    return (
      <Provider value={genres}>
        <Offline>
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
                    notFound={notFound}
                    error={error}
                    totalResults={totalResults}
                    loading={loading}
                    setError={setError}
                    setNotFound={setNotFound}
                    setData={setData}
                    getMovies={getMovies}
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
