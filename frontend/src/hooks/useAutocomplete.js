import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

/**
 * Custom hook for debounced autocomplete suggestions
 *
 * @param {string} query - The search query
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms)
 * @returns {Object} - { suggestions, loading, error }
 */
export function useAutocomplete(query, delay = 300) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    // Don't search if query is empty or too short
    if (!query || query.trim().length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setLoading(true)
    setError(null)

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/autocomplete', {
          params: { q: query.trim() },
          signal: abortControllerRef.current.signal
        })

        setSuggestions(response.data)
        setLoading(false)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Autocomplete error:', err)
          setError(err.message)
          setSuggestions([])
        }
        setLoading(false)
      }
    }, delay)

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query, delay])

  return { suggestions, loading, error }
}
