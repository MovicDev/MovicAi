import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MovicAi from './page/MovicAi/MovicAi'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<MovicAi />} />
      </Routes>
    </>
  )
}

export default App