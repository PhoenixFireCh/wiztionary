import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './routes/Home.jsx'
import SpellDetail from './routes/SpellDetail.jsx'
import CharacterDetail from './routes/CharacterDetail.jsx'
import PostCharacter from './routes/PostCharacter.jsx'
import EditCharacter from './routes/EditCharacter.jsx'
import ReadCharacters from './routes/ReadCharacters.jsx'
import { BrowserRouter, Route, Routes } from "react-router"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}>
        <Route index element={<Home/>}/>
        <Route path='/spelldetail/:name' element={<SpellDetail/>}/>
        <Route path='/characterdetail/:id' element ={<CharacterDetail/>}/>
        <Route path='/postcharacter' element={<PostCharacter/>}/>
        <Route path='/editcharacter/:id' element={<EditCharacter/>}/>
        <Route path='/readcharacter' element={<ReadCharacters/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)
