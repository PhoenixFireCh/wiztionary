//NOTE: THIS PROJECT USES TAILWINDCSS
//Used for minor corrections of items to not clutter stylesheet
import { useState, useEffect } from 'react'
import InfoCard from './components/InfoCard'
import Item from './components/Item'
import './App.css'

function App() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({search:"", level:0, class:''}); //search, level, class

  useEffect(() => {
    const fetchData = async () => {
      //https://api.open5e.com/v2/spells/?fields=key,name,level,classes,damage_roll,range&document__fields=name,key&classes__fields=name&school__fields=name,key&name__contains=&level=0&classes__name__in=
      const response = await fetch("https://api.open5e.com/v2/spells/?fields=name,level,classes,damage_roll,range,duration&format=json&document__fields=name,key&classes__fields=name&school__fields=name,key&name__contains=" + filters.search + "&level=" + filters.level + "&classes__name__in=" + filters.class);
      const json = await response.json();
      console.log(json)
      setItems(json.results);
    }
    fetchData().catch(console.error)
  },[filters]) 

  const handleChange = (e) => {
    const {name, value} = e.target;
    
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <div className='App'>
        <div className='headerContainer'> 
          <header>
            <h1 className='ml-5'>
              Wiz-tionary 🧙‍♂️
            </h1>
          </header>
        </div>
        <div className='main'>
          <div className='navBarContainer mt-5'>
            <nav>
              <h2 className='mt-5'>Filters</h2>
              <form>
                <label>Spell Name</label>
                <input name='search' type='text' className='text' onChange={handleChange}></input>
                <label>Level (0-9)</label>
                <input name='level' type='range' min='0' max='9' defaultValue='0' onChange={handleChange}></input>
                <label>Class</label>
                <select name='class' onChange={handleChange}>
                  <option value=''>--</option>
                  <option value='bard'>Bard</option>
                  <option value='cleric'>Cleric</option>
                  <option value='druid'>Druid</option>
                  <option value='ranger'>Ranger</option>
                  <option value='paladin'>Paladin</option>
                  <option value='sorcerer'>Sorcerer</option>
                  <option value='warlock'>Warlock</option>
                  <option value='wizard'>Wizard</option>
                </select>
              </form>
            </nav>
          </div>
          <div className='contentBox mt-5'>
            <div className='cardBox mt-5'>
              <InfoCard description='range' data='30ft' spName='firebal' />
              <InfoCard description='range' data='30ft' spName='firebal' />
              <InfoCard description='range' data='30ft' spName='firebal' />
            </div>
            <table className='itemBox mt-5'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Range</th>
                  <th>Class</th>
                  <th>Duration</th>
                  <th>Damage</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => {
                  return <Item key={o.name} name={o.name} range={o.range} 
                              build={o.classes.map(o => o.name).join(' ,')} 
                              duration={o.duration} damage={o.damage} 
                          />
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
