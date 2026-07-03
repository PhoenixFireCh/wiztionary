//NOTE: THIS PROJECT USES TAILWINDCSS
//Used for minor corrections of items to not clutter stylesheet
import { useState, useEffect } from 'react'
import InfoCard from './components/InfoCard'
import InfoPage from './components/InfoPage'
import Item from './components/Item'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './App.css'

function App() {
  const time = new Date();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({search:"", level:0, class:'', ordering:'name'}); //search, level, class, ordering
  const [highestDmg, setHighestDmg] = useState({dmg: '', name: ''});
  const [longestRange, setLongestRange] = useState({range: 0, name: ''});
  const [hoveredValue, setHovered] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.open5e.com/v2/spells/?limit=500&ordering="+filters.ordering+"&fields=name,level,classes,damage_roll,range,duration,desc,target_type&format=json&document__fields=name,key&classes__fields=name&school__fields=name,key&name__contains=" + filters.search + "&level=" + filters.level + "&classes__name__in=" + filters.class);
      const json = await response.json();
      setItems(json.results);
      findHighestDmg(json.results);
      findLongestRange(json.results);
    }
    const timeout = setTimeout(() => {
      fetchData().catch(console.error)
    }, 500);
    return () => clearTimeout(timeout)
  },[filters]) 

  const handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const findHighestDmg = (list) => {
    const filtered = list.map(o => ({dmg: o.damage_roll, name: o.name}));
    let longest = {dmg: '', name: ''};
    let longestTotal = 0;
    for (const item of filtered) {
      if (item.dmg.length > 0) {
        const [count, sides] = item.dmg.split("d").map(Number);
        if ((count * sides) > longestTotal) {
          longest = {dmg: item.dmg, name: item.name};
          longestTotal = count * sides;
        }
      }
    }
    setHighestDmg(longest);
  }

  const findLongestRange = (list) => {
    const filtered = list.map(o => ({range: o.range, name: o.name}));
    filtered.sort((a,b) => b.range - a.range); 
    if (filtered.length > 0) {
      setLongestRange({range: filtered[0].range, name: filtered[0].name});
    }
  }

  const setHovering = (e) => {
    e.preventDefault();
    setHovered(JSON.parse(e.currentTarget.dataset.value));
  }

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
            <div className='links'>
              <a href='https://github.com/PhoenixFireCh/wictionary'>Github Repository</a>
              <a href='https://open5e.com/api-docs'>Api Used</a>
            </div>
          </header>
        </div>
        <div className='main mt-5'>
          <div className='navBarContainer mt-5'>
            <nav>
              <h2>Filters</h2>
              <form>
                <label>Spell Name</label>
                <input name='search' type='text' className='text' onChange={handleChange} placeholder='Search Item Here'></input>
                <label>Level (0-9)</label>
                <input name='level' type='range' className='range' min='0' max='9' defaultValue='0' onChange={handleChange}></input>
                <label>Class</label>
                <select name='class' className='select' onChange={handleChange}>
                  <option value=''>--</option>
                  <option value='Bard'>Bard</option>
                  <option value='Cleric'>Cleric</option>
                  <option value='Druid'>Druid</option>
                  <option value='Ranger'>Ranger</option>
                  <option value='Paladin'>Paladin</option>
                  <option value='Sorcerer'>Sorcerer</option>
                  <option value='Warlock'>Warlock</option>
                  <option value='Wizard'>Wizard</option>
                </select>
                <Tippy content="For two comparisons that end in a tie, the tie is broken via the ordering of the content. 
                    ie: two items with equal damage rolls will either be broken by the item first in name or has the largest range.">
                  <label>Ordering (affects equal comparisons ℹ️)</label>
                </Tippy>
                <select name='ordering' className='select' onChange={handleChange}>
                  <option value='name'>Name ▼</option>
                  <option value='-name'>Name ▲</option>
                  <option value='range'>Range ▼</option>
                  <option value='-range'>Range ▲</option>
                </select>
              </form>
              <h2 className='mt-5'>Spell Information</h2> 
              {
                (hoveredValue == null)
                ? <p>Hover over a spell to get started!</p>
                : <InfoPage o={hoveredValue} />
              }
            </nav>
          </div>
          <div className='contentBox mt-5 mb-5'>
            <div className='cardBox mt-5'>
              <InfoCard description='Level' data={filters.level} spName='' />
              <InfoCard description='Longest Range' data={longestRange.range + 'ft'} spName={longestRange.name} />
              <InfoCard description='Highest Damage' data={highestDmg.dmg} spName={highestDmg.name} />
            </div>
            <table className='itemBox mt-5 pl-2 pr-2 pb-2'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Range (ft)</th>
                  <th>Class</th>
                  <th>Duration</th>
                  <th>Damage</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => {
                  return <Item key={crypto.randomUUID()} o={o} onHover={setHovering}/>
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
