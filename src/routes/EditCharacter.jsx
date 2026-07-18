import { Navigate, useNavigate, useLocation, useParams} from 'react-router';
import { useState, useEffect, useRef } from 'react'
import { Filters } from '../Filters.js'
import SpellShort from '../components/SpellShort.jsx';
import { supabase } from '../client.js'
import './PostCharacter.css';

function EditCharacter() {
    //UNPACKING
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const unpacked = state?.object;
    const initialized = useRef(false);

    const totalAbilityPoints = 27;
    const [filteredSpells, setFiltered] = useState([]);
    const [spells, setSpells] = useState([]); 
    const [species, setSpecies] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [search, setSearch] = useState('');
    //Will be submitted to DB
    const [response, setResponse] = useState(unpacked)

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
            filter(spellJson); //Not filterLevel class as that will erase current datas
        }
        fetchData().catch(console.error);
    }, [])

    useEffect(() => {
        if (!initialized.current) { //Prevents initial run of useEffect (deletes data)
            initialized.current = true;
            return
        }; 
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
        let responseOut = structuredClone(response);
        responseOut.spells = JSON.stringify(response.spells);
        responseOut.abilityScore = JSON.stringify(response.abilityScore);
        if (Filters.checkAbilityScore(totalAbilityPoints, response.abilityScore) >= 0) {
            const { data, error } = await supabase
            .from('Characters')
                .update(responseOut)
                .eq("id", id);
            if (error) console.error(error);
            window.location = "/readcharacter";
        } else {
            alert('Invalid stats! Please check again!')
        }
    }

    const deleteFromDB = async (e) => {
        const { data, error } = await supabase
            .from("Characters")
            .delete()
            .eq("id", id);
        if (error) console.error(error);
        window.location = "/readcharacter";
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
        navigate(`/spelldetail/${object.name}`, {state: {object: object}});
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

    const reset = (e) => {
        e.preventDefault();
        setResponse(unpacked);
    }

    return (
        <div className='characterEditor'>
            <div className='buttons ml-[2%]'>
                <button className='submitButton mr-2' onClick={submitToDB}>Update!</button>
                <button className='resetButton mr-2' onClick={reset}>Reset</button>
                <button className='deleteButton mr-2' onClick={deleteFromDB}>Delete</button>
            </div>
            <form className='postCharacterForm mt-2'>
                <div className='mainStats'>
                    <h2>Main Stats</h2>
                    <label>Name</label>
                    <input name='name' type='text' className='text' onChange={handleChange} value={response.name}></input>
                    <label>Species</label>
                    <select name='species' className='select' onChange={handleChange} value={response.species}>
                        {species.map((o) => {
                            return <option key={o.id} value={o.name}>{o.name}</option>
                        })}
                    </select>
                    <label>Level</label>
                    <input name='level' type='range' className='range' min='0' max='20' onChange={handleChange} value={response.level}></input>
                    <label>Class</label>
                    <select name='class' className='select' onChange={handleChange} value={response.class}>
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
                    <select name='background' className='select' onChange={handleChange} value={response.background}>
                        {backgrounds.map((o) => {
                            return <option key={o.id} value={o.name}>{o.name}</option>
                        })}
                    </select>
                    <label>Alignment</label>
                    <select name='alignment' className='select' onChange={handleChange} value={response.alignment}>
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
                    <p className='mt-5 text-center'>
                        Add or edit characters here! Build your ideal characters using the list of attributes and spells. 
                        (Note: This is not accurate to actual DnD rules because I have to implement this in such short notice)
                    </p>
                </div>
                <div className='rightPanel' >
                    <div className='upperPanel'>
                        <div className='level'>
                            <h2>Level</h2>
                            <h1>{response.level}</h1>
                        </div>
                        <div className='abilityScoreContainer'>
                            <h2 className='ml-2'>Base Ability Score</h2>
                            <div className='abilityScore'>
                                <div className='ability'>
                                    <h3>Available Points</h3>
                                    <h3 style={{color: (Filters.checkAbilityScore(totalAbilityPoints, response.abilityScore) < 0) ? 'red' : ''}}>{Filters.checkAbilityScore(totalAbilityPoints, response.abilityScore)}</h3>
                                </div>
                                <div className='ability'>
                                    <label>Strength</label>
                                    <input name='strength' className='number' type='number' onChange={handleChange} value={response.abilityScore.strength}></input>
                                </div>
                                <div className='ability'>
                                    <label>Dexterity</label>
                                    <input name='dexterity' className='number' type='number' onChange={handleChange} value={response.abilityScore.dexterity}></input>
                                </div>
                                <div className='ability'>
                                    <label>Constitution</label>
                                    <input name='constitution' className='number' type='number' onChange={handleChange} value={response.abilityScore.constitution}></input>
                                </div>
                                <div className='ability'>
                                    <label>Intelligence</label>
                                    <input name='intelligence' className='number' type='number' onChange={handleChange} value={response.abilityScore.intelligence}></input>
                                </div>
                                <div className='ability'>
                                    <label>Wisdom</label>
                                    <input name='wisdom' className='number' type='number' onChange={handleChange} value={response.abilityScore.wisdom}></input>
                                </div>
                                <div className='ability'> 
                                    <label>Charisma</label>
                                    <input name='charisma' className='number' type='number' onChange={handleChange} value={response.abilityScore.charisma}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='lowerPanel mt-1'>
                        <div className='spells mt-5'>
                            <div className='spellList'>
                                <h3>————————— Spell List —————————</h3>
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
                                <h3>————————— Added Spells —————————</h3>
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
                            <textarea name='desc' className='text' onChange={handleChange} value={response.desc}></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditCharacter