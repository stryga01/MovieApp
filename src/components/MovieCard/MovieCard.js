import React, { Component } from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'

import { movieDBService } from '../../MovieDBService/MovieDBService'
import noPoster from '../../img/no-poster.webp'

import './MovieCard.css'

export default class MovieCard extends Component {
  constructor() {
    super()
    this.state = {
      countSymbols: 100,
    }
    this.genresRef = React.createRef()
    this.titleRef = React.createRef()
  }

  componentDidMount() {
    const totalHeight = this.titleRef.current.offsetHeight + this.genresRef.current.offsetHeight
    this.setState({
      countSymbols:
        totalHeight > 150 ? 0 : totalHeight > 135 ? 70 : totalHeight > 105 ? 110 : totalHeight > 75 ? 130 : 180,
    })
  }

  cut(string, countSymbols) {
    let strArr = string.split('')
    if (!countSymbols) return ''
    if (strArr.length <= countSymbols) return string
    while (strArr.length > countSymbols) {
      strArr = strArr.join('').split(' ').slice(0, -1).join(' ').split('')
    }
    return `${strArr.join('')}...`
  }

  setRatingHandler = (value) => {
    const { setRating } = movieDBService
    const { sessionId, movie } = this.props
    const { id } = movie
    localStorage.setItem(String(id), String(value))
    setRating(id, sessionId, value)
  }

  render() {
    const { movie, rating, genres } = this.props
    const { title, overview, release_date, poster_path, vote_average, genre_ids } = movie
    const genresElements = genre_ids.map((id) => {
      return (
        <li key={id} className="card__categories-item">
          {genres.filter((el) => el.id === id)[0].name}
        </li>
      )
    })
    const ratingAverageColor =
      vote_average > 7 ? '#66E900' : vote_average > 5 ? '#E9D100' : vote_average > 3 ? '#E97E00' : '#E90000'
    return (
      <div className="card">
        <div className="image__wrap">
          <img
            className="card__img"
            src={poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : noPoster}
            alt="12"
          />
        </div>
        <div className="card__info">
          <h3 className="card__title" ref={this.titleRef}>
            {this.cut(title, 40)}
          </h3>
          <span className="card__rating" style={{ borderColor: ratingAverageColor }}>
            {vote_average.toFixed(1)}
          </span>
          <p className="card__date">{release_date ? format(new Date(release_date), 'MMMM i, yyyy') : undefined}</p>
          <ul className="card__categories-list" ref={this.genresRef}>
            {genresElements}
          </ul>
          <div className="card__description">{this.cut(overview, this.state.countSymbols)}</div>
          <Rate
            count={10}
            className="card__rate"
            defaultValue={rating}
            onChange={(value) => this.setRatingHandler(value)}
          />
        </div>
      </div>
    )
  }
}
