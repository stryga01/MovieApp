import React from 'react'
import './Rating.css'

const Rating = (props) => {
  const { vote_average } = props
  const ratingAverageColor =
    vote_average > 7 ? 'green' : vote_average > 5 ? 'yellow' : vote_average > 3 ? 'orange' : 'red'
  return <span className={`card__rating ${ratingAverageColor}`}>{vote_average.toFixed(1)}</span>
}
export default Rating
