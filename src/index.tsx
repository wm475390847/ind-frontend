import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './routes/login'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

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


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

export default App
