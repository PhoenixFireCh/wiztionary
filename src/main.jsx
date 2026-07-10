import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './routes/Home.jsx'
import Detail from './routes/Detail.jsx'
import { BrowserRouter, Route, Routes } from "react-router"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}>
        <Route index element={<Home/>}/>
        <Route path='/detail/:name' element={<Detail/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)
