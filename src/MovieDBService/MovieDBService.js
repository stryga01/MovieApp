export default class MovieDBService {
  constructor() {
    this._basUrl = 'https://api.themoviedb.org/3'
    this.apiKey = '1291b7d4b65f07f78d6e60dd8001db4a'
  }

  getResourсe = async (url) => {
    const res = await fetch(`${this._basUrl}${url}api_key=${this.apiKey}`)
    if (!res.ok) {
      throw new Error('could not fetch')
    }
    return await res.json()
  }

  getPopularMovies = async (currentPage = 1) => {
    const res = await this.getResourсe(`/movie/popular?page=${currentPage}&`)
    return res
  }

  searchMovies = async (query = '', page = 1) => {
    const res = await this.getResourсe(`/search/movie?query=${query}&page=${page}&`)
    return res
  }

  createGuestSession = async () => {
    const res = await this.getResourсe('/authentication/guest_session/new?')
    return await res.guest_session_id
  }

  getRatedMovies = async (sessionId, page) => {
    const res = await this.getResourсe(`/guest_session/${sessionId}/rated/movies?page=${page}&`)
    return await res
  }

  setRating = async (id, sessionId, rating) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?guest_session_id=${sessionId}&api_key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: rating }),
      }
    )
    if (!res.ok) throw new Error('could not fetch')
    return await res.json()
  }

  getGenres = async () => {
    const res = await this.getResourсe('/genre/movie/list?')
    return await res
  }

  getPoster = async (path) => {
    const res = await fetch(`https://image.tmdb.org/t/p/original${path}`)
    if (!res.ok) {
      throw new Error('could not fetch')
    }
    return await res.blob()
  }
}

export const movieDBService = new MovieDBService()
