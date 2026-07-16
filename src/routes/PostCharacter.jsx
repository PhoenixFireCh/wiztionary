import { useState, useEffect } from 'react'
import { Filters } from '../Filters.js'
import { Navigate, useNavigate  } from 'react-router';
import './PostCharacter.css';

function PostCharacter() {
    // Global Lists
    const [spells, setSpells] = useState([]);
    const [species, setSpecies] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);


    return (
        <div className='wrapper'>
            <div className='buttons'>
                <button> Create! </button>
            </div>
            <form className='postCharacterForm mt-5'>
                <div className='mainStats'>
                    <h2>Main Stats</h2>
                    <label>Name</label>
                    <input name='name' type='text' className='text'></input>
                    <label>Species</label>
                    <select name='species' className='select'>
                        {/* map everything here */}
                    </select>
                    <label>Level</label>
                    <input name='level' type='range' className='range' min='0' max='20' defaultValue='0' ></input>
                    <label>Class</label>
                    <select name='class' className='select' >
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
                    <input name='background' type='text' className='text'></input>
                    <label>Alignment</label>
                    <select name='alignment' className='select' >
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
                <div className='rightPanel'>
                    <div className='abilityScoreContainer'>
                        <h2>Base Ability Score</h2>
                        <div className='abilityScore'>
                            <div className='ability'>
                                <h3>Available Points</h3>
                                <h3>0</h3>
                            </div>
                            <div className='ability'>
                                <label>Strength</label>
                                <input name='strength' className='number' type='number'></input>
                            </div>
                            <div className='ability'>
                                <label>Dexterity</label>
                                <input name='dexterity' className='number' type='number'></input>
                            </div>
                            <div className='ability'>
                                <label>Constitution</label>
                                <input name='constitution' className='number' type='number'></input>
                            </div>
                            <div className='ability'>
                                <label>Intelligence</label>
                                <input name='intelligence' className='number' type='number'></input>
                            </div>
                            <div className='ability'>
                                <label>Wisdom</label>
                                <input name='wisdom' className='number' type='number'></input>
                            </div>
                            <div className='ability'> 
                                <label>Charisma</label>
                                <input name='charisma' className='number' type='number'></input>
                            </div>
                        </div>
                    </div>
                    <div className='lowerPanel mt-5'>
                        <div className='spells mt-5'>
                            <div className='spellList'>
                                <h3>Spell List</h3>
                                <input name='search' type='text' className='text' placeholder='Search spells'></input>
                                <table>
                                    <tbody>

                                    </tbody>
                                </table>
                                <h3>Added Spells</h3>
                                <table>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='descriptionEditor mt-5'>
                            <h2>Description</h2>
                            <textarea name='desc' className='text' ></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PostCharacter