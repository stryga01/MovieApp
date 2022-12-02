import React, { Component } from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'

import { Cut } from '../../utils/Cut'
import { movieDBService } from '../../MovieDBService/MovieDBService'
import Rating from '../Rating/Rating'
import './MovieCard.css'
import { Poster } from '../Poster/Poster'

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
        totalHeight > 150 ? 0 : totalHeight > 135 ? 70 : totalHeight > 105 ? 100 : totalHeight > 75 ? 130 : 180,
    })
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
    const { title, overview, release_date, vote_average, genre_ids } = movie
    const genresElements = genre_ids.map((id) => {
      return (
        <li key={id} className="card__categories-item">
          {genres.filter((el) => el.id === id)[0].name}
        </li>
      )
    })
    return (
      <div className="card">
        <div className="image__wrap">
          <Poster movie={movie} />
        </div>
        <div className="card__info">
          <h3 className="card__title" ref={this.titleRef}>
            {Cut(title, 40)}
          </h3>
          <Rating vote_average={vote_average} />
          <p className="card__date">{release_date ? format(new Date(release_date), 'MMMM i, yyyy') : undefined}</p>
          <ul className="card__categories-list" ref={this.genresRef}>
            {genresElements}
          </ul>
          <div className="card__description">{Cut(overview, this.state.countSymbols)}</div>
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
