import React, { Component } from 'react'
import { Spin } from 'antd'

import { movieDBService } from '../../MovieDBService/MovieDBService'
import noPoster from '../../assets/img/no-poster.webp'

export class Poster extends Component {
  constructor() {
    super()
    this.state = {
      imageUrl: null,
    }
  }

  componentDidMount() {
    const { getPoster } = movieDBService
    const { poster_path } = this.props.movie
    if (poster_path) {
      getPoster(poster_path).then((img) => {
        this.setState({
          imageUrl: URL.createObjectURL(img),
        })
      })
    } else {
      this.setState({
        imageUrl: noPoster,
      })
    }
  }

  render() {
    const { title } = this.props.movie
    const { imageUrl } = this.state
    const poster =
      imageUrl === noPoster ? (
        <img className="card__img" src={noPoster} alt={title} />
      ) : !imageUrl ? (
        <Spin size="large" />
      ) : (
        <img className="card__img" src={imageUrl} alt={title} />
      )
    return <>{poster}</>
  }
}
