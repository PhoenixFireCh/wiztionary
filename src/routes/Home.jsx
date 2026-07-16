//NOTE: THIS PROJECT USES TAILWINDCSS
//Used for minor corrections of items to not clutter stylesheet
import { useState, useEffect } from 'react'
import InfoCard from '../components/InfoCard'
import SpellLong from '../components/SpellLong'
import './Home.css'
import { Filters } from '../Filters.js'
import { Tooltip as TippyTooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import {ScatterChart, Scatter, XAxis, YAxis, ZAxis, Legend, BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { Navigate, useNavigate  } from 'react-router';

function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFiltered] = useState([]);
  const [filters, setFilters] = useState({search:"", level:0, class:'', ordering:'name'}); //search, level, class, ordering
  const [highestDmg, setHighestDmg] = useState({dmg: '', name: ''});
  const [longestRange, setLongestRange] = useState({range: 0, name: ''});
  const [graphRange, setGraphRange] = useState([]);
  const [graphDmg, setGraphDmg] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.open5e.com/v2/spells/?limit=10000&fields=name,level,classes,damage_roll,range,duration,desc,target_type,school");
      let json = await response.json();
      json = json.results.map(item => ({
        ...item,
        id: crypto.randomUUID()
      }));
      json = json.filter(item => item.range <= 10000); //Filters certain spells with comically ridiculous range (they break my graphs)
      setItems(json);
      updateVars(json); // Update vars as soon as it loads
    }
    fetchData().catch(console.error);
  },[]) 

  useEffect(() => {
    updateVars();
  },[filters])

  const handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const updateVars = (list) => {
    let filtered;
    if (list != null) {
      filtered = Filters.sortItems(list, filters);
    } else {
      filtered = Filters.sortItems(items, filters)
    }
    setFiltered(filtered);
    setLongestRange(Filters.findLongestRange(filtered));
    setHighestDmg(Filters.findHighestDmg(filtered));
    setGraphRange(Filters.graphSchoolRange(filtered));
    setGraphDmg(Filters.graphSchoolDamage(filtered));
  }

  const changePage = (e) => {
    // e.preventDefault();
    const object = JSON.parse(e.currentTarget.dataset.value)
    navigate(`/detail/${object.name}`, {state: {object: object}});
  }

  return (
    <>
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
                <TippyTooltip className='mt-5' title='For two comparisons that end in a tie, the tie is broken via the ordering of the content. 
                    ie: two items with equal damage rolls will either be broken by the item first in name or has the largest range.'
                    position="bottom"
                    trigger="mouseenter">
                    <label>Ordering (ℹ️)</label>
                </TippyTooltip>
                <select name='ordering' className='select' onChange={handleChange}>
                    <option value='name'>Name ▼</option>
                    <option value='-name'>Name ▲</option>
                    <option value='range'>Range ▼</option>
                    <option value='-range'>Range ▲</option>
                </select>
              </form>
              <h2 className='mt-5'>How to use</h2> 
              <p>Use the filters to filter through specific spells based on their levels and classes. The graphs on the right shows the aggregated data of each individual spell level and will change based on the filtering. Click on a spell to show more details about them.</p>
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
              {filteredItems.map((o) => {
                  return <SpellLong key={o.id} o={o} onClick={changePage}/>
              })}
              </tbody>
          </table>
          </div>
          <div className='chartContainer mt-5'>
          <div className='charts'>
              <div className='chart'>
              <h2 className='text-center'>Max Range by School</h2>
              <div className='chartWrapper'>
                  <ResponsiveContainer width="100%" height={225}>
                    <BarChart responsive data={graphRange} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <XAxis name='schools' dataKey="school" axisLine={{ stroke: "#fcd34d" }} tick={{ fill: "#fcd34d", fontSize: 14 }} tickFormatter={(name) => name.slice(0, 3)}/>
                        <YAxis axisLine={{ stroke: "#fcd34d" }} tick={{ fill: "#fcd34d", fontSize: 14 }} />
                        <Legend />
                        <Tooltip contentStyle={{
                            backgroundColor: "#1f2937",
                            borderRadius: "8px",
                            border: "none",
                            color: "#fcd34d"         
                        }}
                        labelStyle={{ color: "#fcd34d"}}  
                        itemStyle={{ color: "#fcd34d" }}
                        />
                        <Bar dataKey="range" fill="rgb(107, 45, 45)" activeBar={{ fill: 'pink', stroke: 'yellow' }} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
              </div>
              <div className='chart'>
              <h2 className='text-center'>Max Damage Roll by School</h2>
              <div className='chartWrapper'>
                  <ResponsiveContainer width="100%" height={225}>
                    <BarChart responsive data={graphDmg} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <XAxis name='schools' dataKey="school" axisLine={{ stroke: "#fcd34d" }} tick={{ fill: "#fcd34d", fontSize: 14 }} tickFormatter={(name) => name.slice(0, 3)}/>
                        <YAxis axisLine={{ stroke: "#fcd34d" }} tick={{ fill: "#fcd34d", fontSize: 14 }} />
                        <Legend />
                        <Tooltip contentStyle={{
                            backgroundColor: "#1f2937",
                            borderRadius: "8px",
                            border: "none",
                            color: "#fcd34d"         
                        }}
                        labelStyle={{ color: "#fcd34d"}}  
                        itemStyle={{ color: "#fcd34d" }}
                        />
                        <Bar dataKey="dmg" fill="rgb(107, 45, 45)" activeBar={{ fill: 'pink', stroke: 'yellow' }} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </div>
        </div>
        </div>
    </>
  )
}

export default Home