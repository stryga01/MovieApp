import React, { Component } from 'react'
import './MovieList.css'

import { Consumer } from '../../context/GenresContext'
import MovieCard from '../MovieCard/MovieCard'

class MovieList extends Component {
  render() {
    const { movies, sessionId, setLoading } = this.props
    const elements = movies.map((movie) => {
      const { id } = movie
      const rating = Number(localStorage.getItem(String(id)))
      return (
        <li key={movie.id}>
          <Consumer>
            {(genres) => {
              return (
                <MovieCard
                  movie={movie}
                  sessionId={sessionId}
                  rating={rating}
                  genres={genres}
                  setLoading={setLoading}
                />
              )
            }}
          </Consumer>
        </li>
      )
    })
    return <ul className="movie-list">{elements}</ul>
  }
}
export default MovieList
