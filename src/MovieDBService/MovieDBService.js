export default class MovieDBService {
  constructor() {
    this._basUrl = 'https://api.themoviedb.org/3'
    this.apiKey = '1291b7d4b65f07f78d6e60dd8001db4a'
  }

  getResourse = async (url) => {
    const res = await fetch(`${this._basUrl}${url}&api_key=${this.apiKey}`)
    if (!res.ok) {
      throw new Error('could not fetch')
    }
    return await res.json()
  }

  searchMovies = async (query = 'return', page = 1) => {
    const res = await this.getResourse(`/search/movie?query=${query}&page=${page}`)
    return res
  }

  createGuestSession = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`)
    if (!res.ok) throw new Error('could not fetch')
    return await res.json()
  }

  getRatedMovies = async (sessionId, page) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?page=${page}&api_key=${this.apiKey}`
    )
    if (!res.ok) throw new Error('could not fetch')
    return await res.json()
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
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`)
    if (!res.ok) throw new Error('could not fetch')
    return await res.json()
  }
}

export const movieDBService = new MovieDBService()
