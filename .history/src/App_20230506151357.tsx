import { Suspense, useState } from 'react'
import reactLogo from './assets/svg/react.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './routes/login'

const App = () => {


  return (
    <Suspense fallback={<div />}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={(
            <PageLayout routes={routes} />
          )}>
            {routeList}
          </Route> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<div>NotFound</div>} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
