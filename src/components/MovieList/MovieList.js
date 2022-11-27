import React from 'react'
import './MovieList.css'

import { Consumer } from '../GenresContext'
import MovieCard from '../MovieCard/MovieCard'

const MovieList = (props) => {
  const { movies, sessionId } = props
  const elements = movies.map((movie) => {
    const { id } = movie
    const rating = Number(localStorage.getItem(String(id)))
    return (
      <li key={movie.id}>
        <Consumer>
          {(genres) => {
            return <MovieCard movie={movie} sessionId={sessionId} rating={rating} genres={genres} />
          }}
        </Consumer>
      </li>
    )
  })
  return <ul className="movie-list">{elements}</ul>
}
export default MovieList
