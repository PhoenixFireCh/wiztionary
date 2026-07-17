import { useState, useEffect } from 'react'
import { Filters } from '../Filters.js'
import { Navigate, useNavigate  } from 'react-router';
import SpellShort from '../components/SpellShort.jsx';
import { supabase } from '../client'
import './PostCharacter.css';

function PostCharacter() {
    const navigate = useNavigate();
    const [filteredSpells, setFiltered] = useState([]);
    const [spells, setSpells] = useState([]); 
    const [species, setSpecies] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [search, setSearch] = useState('');
    //Will be submitted to DB
    const [response, setResponse] = useState(
        {
            name:"",
            species:"",
            level:0,
            class:"",
            background: "",
            alignment: "",
            abilityScore: {
                strength: 0,
                dexterity: 0,
                constitution: 0,
                intelligence: 0,
                wisdom: 0,
                charisma: 0
            },
            spells: [],
            desc: ""
        }
    )

    useEffect(() => {
        const fetchData = async () => {
            //Fetching data
            const spellsResponse = await fetch("https://api.open5e.com/v2/spells/?limit=10000&fields=name,level,classes,damage_roll,range,duration,desc,target_type,school,key")
            const speciesResponse = await fetch("https://api.open5e.com/v2/species/?limit=200&fields=name")
            const backgroundsResponse = await fetch("https://api.open5e.com/v2/backgrounds/?limit=200&fields=name")
            let spellJson = await spellsResponse.json();
            let speciesJson = await speciesResponse.json();
            let backgroundsJson = await backgroundsResponse.json();
            
            //Minor filtering
            spellJson = Filters.addId(spellJson);
            speciesJson = Filters.addId(speciesJson);
            backgroundsJson = Filters.addId(backgroundsJson);
            spellJson = spellJson.filter(item => item.range <= 10000);
            speciesJson = Array.from(
                        new Map(speciesJson.map(item => [item.name, item])).values()
                        );
            backgroundsJson = Array.from(
                        new Map(backgroundsJson.map(item => [item.name, item])).values()
                        );
            setSpecies(speciesJson);
            setBackgrounds(backgroundsJson);
            setSpells(spellJson);
            filterLevelClass(spellJson); //sets the filtering
            setResponse(prev => ({...prev,
                background: backgroundsJson[0].name,
                species: speciesJson[0].name
            }));
            
        }
        fetchData().catch(console.error);
    }, [])

    useEffect(() => {
        filterLevelClass();
    }, [response.class, response.level]);

    useEffect(() => {
        filter();
    }, [search])

    const filterLevelClass = (list) => {
        filter(list);
        // Clear and reset function upon changing level and/or class
        setResponse((prev) => ({
            ...prev,
            spells: []
        }));
    }

    const filter = (list) => {
        let filtered;
        if (list != null) {
            filtered = Filters.sortItemsGentle(list, {...response, search: search});
        } else {
            filtered = Filters.sortItemsGentle(spells, {...response, search: search})
        }
        setFiltered(filtered);
    }

    const submitToDB = async (e) => {
        e.preventDefault();
        let responseOut = response;
        responseOut.spells = JSON.stringify(response.spells);
        responseOut.abilityScore = JSON.stringify(response.abilityScore);
        await supabase
        .from('Characters')
            .insert(responseOut)
        window.location = "/";
    }

    const addItem  = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key = e.target.value;
        const object = filteredSpells.find(item => item.key === key);
        if (!response.spells.some(item => item.key === key)) {
            setResponse((prev) => ({
                ...prev, 
                spells: [...prev.spells, object]
            }));
        }
    }

    const removeItem = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setResponse((prev) => ({
            ...prev,
            spells: prev.spells.filter(item => item.key !== e.target.value)
        }));
    }

    const changePage = (e) => {
        const object = filteredSpells.find(item => item.key === e.currentTarget.dataset.value)
        navigate(`/detail/${object.name}`, {state: {object: object}});
    }

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;

        if (name === 'search') {
            setSearch(value);
        } else if (Object.keys(response.abilityScore).includes(name)) {
            setResponse((prev) => ({
                ...prev,
                abilityScore: {
                    ...prev.abilityScore,
                    [name]: value
                }
            }))
        } else {
            setResponse((prev) => ({
                ...prev,
                [name]: value
            }))
        }  
    }
    
    return (
        <div className='wrapper'>
            <div className='buttons ml-[2%]'>
                <button className='submitButton' onClick={submitToDB}>Create!</button>
            </div>
            <form className='postCharacterForm mt-2'>
                <div className='mainStats'>
                    <h2>Main Stats</h2>
                    <label>Name</label>
                    <input name='name' type='text' className='text' onChange={handleChange}></input>
                    <label>Species</label>
                    <select name='species' className='select' onChange={handleChange}>
                        {species.map((o) => {
                            return <option key={o.id} value={o.name}>{o.name}</option>
                        })}
                    </select>
                    <label>Level</label>
                    <input name='level' type='range' className='range' min='0' max='20' defaultValue='0' onChange={handleChange}></input>
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
                    <label>Background</label>
                    <select name='background' className='select' onChange={handleChange}>
                        {backgrounds.map((o) => {
                            return <option key={o.id} value={o.name}>{o.name}</option>
                        })}
                    </select>
                    <label>Alignment</label>
                    <select name='alignment' className='select' onChange={handleChange}>
                        <option value='None'>--</option>
                        <option value='Lawful Good'>Lawful Good</option>
                        <option value='Neutral Good'>Neutral Good</option>
                        <option value='Chaotic Good'>Chaotic Good</option>
                        <option value='Lawful Neutral'>Lawful Neutral</option>
                        <option value='Neutral'>Neutral</option>
                        <option value='Chaotic Neutral'>Chaotic Neutral</option>
                        <option value='Lawful Evil'>Lawful Evil</option>
                        <option value='Neutral Evil'>Neutral Evil</option>
                        <option value='Chaotic Evil'>Chaotic Evil</option>
                    </select>
                </div>
                <div className='rightPanel' >
                    <div className='abilityScoreContainer'>
                        <h2 className='ml-2'>Base Ability Score</h2>
                        <div className='abilityScore'>
                            <div className='ability'>
                                <h3>Available Points</h3>
                                <h3>0</h3>
                            </div>
                            <div className='ability'>
                                <label>Strength</label>
                                <input name='strength' className='number' type='number' onChange={handleChange}></input>
                            </div>
                            <div className='ability'>
                                <label>Dexterity</label>
                                <input name='dexterity' className='number' type='number' onChange={handleChange}></input>
                            </div>
                            <div className='ability'>
                                <label>Constitution</label>
                                <input name='constitution' className='number' type='number' onChange={handleChange}></input>
                            </div>
                            <div className='ability'>
                                <label>Intelligence</label>
                                <input name='intelligence' className='number' type='number' onChange={handleChange}></input>
                            </div>
                            <div className='ability'>
                                <label>Wisdom</label>
                                <input name='wisdom' className='number' type='number' onChange={handleChange}></input>
                            </div>
                            <div className='ability'> 
                                <label>Charisma</label>
                                <input name='charisma' className='number' type='number' onChange={handleChange}></input>
                            </div>
                        </div>
                    </div>
                    <div className='lowerPanel mt-5'>
                        <div className='spells mt-5'>
                            <div className='spellList'>
                                <h3>Spell List</h3>
                                <input name='search' type='text' className='text' placeholder='Search spells' onChange={handleChange}></input>
                                <div className='tableContainer mt-2'>
                                    <table>
                                        <tbody>
                                            {filteredSpells.map((o) => {
                                                return <SpellShort key={o.id} o={o} type='add' bodyClick={changePage} buttonClick={addItem}/>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <h3>Added Spells</h3>
                                <div className='tableContainer mt-2'>
                                    <table>
                                        <tbody>
                                            {response.spells.map((o) => {
                                                return <SpellShort key={o.id} o={o} type='remove' bodyClick={changePage} buttonClick={removeItem}/>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='descriptionEditor mt-5'>
                            <h2 className='ml-2'>Description</h2>
                            <textarea name='desc' className='text' onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PostCharacter