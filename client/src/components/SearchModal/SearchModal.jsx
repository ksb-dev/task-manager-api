/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

// context
import { useTaskivityContext } from '../../context/context'

// hooks
import { useSearchAll } from '../../hooks/useSearch'

const SearchModal = () => {
  const token = localStorage.getItem('token')

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [progress, setProgress] = useState('all')

  const { mode, searchRef, searchModalRef, searchModalInnerRef } =
    useTaskivityContext()

  const {
    getSearchResults,
    getIncompletedSearchResults,
    getCompletedSearchResults
  } = useSearchAll()

  useEffect(() => {
    if (query !== '') {
      if (progress === 'all') {
        getSearchResults(query, token, setSearchResults)
      }
      if (progress === 'incomplete') {
        getIncompletedSearchResults(query, token, setSearchResults)
      }
      if (progress === 'complete') {
        getCompletedSearchResults(query, token, setSearchResults)
      }
    } else {
      setSearchResults([])
    }
  }, [query])

  useEffect(() => {
    const showHideSearchModal = e => {
      if (
        searchRef &&
        searchRef.current &&
        searchRef.current.contains(e.target)
      ) {
        return
      }

      if (
        searchModalRef &&
        searchModalRef.current &&
        searchModalRef.current.contains(e.target) &&
        searchModalInnerRef &&
        searchModalInnerRef.current &&
        !searchModalInnerRef.current.contains(e.target)
      ) {
        searchModalRef.current.style.transform = 'scaleY(0)'
        setQuery('')
      }
    }

    document.body.addEventListener('click', showHideSearchModal)

    return () => document.body.removeEventListener('click', showHideSearchModal)
  }, [])

  const getPriorityColor = priority => {
    if (priority === 'low') {
      return 'lowPriority'
    }
    if (priority === 'medium') {
      return 'mediumPriority'
    }
    if (priority === 'high') {
      return 'highPriority'
    }
  }

  return (
    <div
      className={
        'search-modal ' +
        (mode ? 'lightAlpha darkColor' : 'darkAlpha lightColor')
      }
      ref={searchModalRef}
    >
      <div
        className={'search-modal-inner ' + (mode ? 'lightBg2' : 'darkBg1')}
        ref={searchModalInnerRef}
      >
        <div className='search-options'>
          <p
            onClick={() => {
              setQuery('')
              setProgress('all')
            }}
          >
            <span
              className={
                progress === 'all'
                  ? 'active'
                  : mode
                  ? 'darkCheckBorder'
                  : 'lightCheckBorder'
              }
            ></span>
            All
          </p>
          <p
            onClick={() => {
              setQuery('')
              setProgress('incomplete')
            }}
          >
            <span
              className={
                progress === 'incomplete'
                  ? 'highActive'
                  : mode
                  ? 'darkCheckBorder'
                  : 'lightCheckBorder'
              }
            ></span>
            Incomplete
          </p>
          <p
            onClick={() => {
              setQuery('')
              setProgress('complete')
            }}
          >
            <span
              className={
                progress === 'complete'
                  ? 'lowActive'
                  : mode
                  ? 'darkCheckBorder'
                  : 'lightCheckBorder'
              }
            ></span>
            Complete
          </p>
        </div>
        <input
          type='text'
          placeholder='Enter title'
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={mode ? 'lightBg1' : 'darkBg2'}
        />

        {searchResults?.length > 0 && (
          <div className={'search-results ' + (mode ? 'lightBg1' : 'darkBg2')}>
            {searchResults.map(task => (
              <span
                className={`${getPriorityColor(task.priority)}`}
                key={task._id}
              >
                {task.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchModal
