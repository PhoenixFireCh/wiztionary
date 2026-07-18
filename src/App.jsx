//NOTE: THIS PROJECT USES TAILWINDCSS
//Used for minor corrections of items to not clutter stylesheet
import './App.css'
import { Link, Outlet } from "react-router"


function App() {

  return (
    <>
      <div className='App'>
        <div className='headerContainer'> 
          <header>
            <div className='logo'>
              <h1 className='ml-5'>
              Wiz-tionary
              </h1>
              <div className='icon ml-1'></div>
            </div>
            <div className='links mr-5'>
              <Link to="/">Home</Link>
              <Link to="/postcharacter">Character Creator</Link>
              <Link to="/readcharacter">Character Gallery</Link>
              <a href='https://github.com/PhoenixFireCh/wictionary'>Github Repository</a>
              <a href='https://open5e.com/api-docs'>Api Used</a>
            </div>
          </header>
        </div>
        <div className='main mt-5'>
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default App
