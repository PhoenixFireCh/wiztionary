import { useLocation, useParams, Navigate, useNavigate } from 'react-router';
import { useEffect } from 'react'
import SpellLong from '../components/SpellLong';
import './Detail.css'
import './CharacterDetail.css'

function CharacterDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const storageKey = `character:${id}`;
    let object = state?.object ?? null;
    //Session storage, allows for errors to be caught upon reload and allows for memory of the item.
    if (!object) {
        try { object = JSON.parse(sessionStorage.getItem(storageKey)) } catch { object = null }
    }

    useEffect(() => {
        if (state?.object) {
            try { sessionStorage.setItem(storageKey, JSON.stringify(state.object)) } catch { /* storage full/disabled */ }
        }
    }, [state, storageKey]);

    const changePage = (e) => {
        const o = object.spells.find(item => item.key === e.currentTarget.dataset.value)
        navigate(`/spelldetail/${o.name}`, {state: {object: o}});
    }

    const jumpToEdit = (e) => {
        navigate(`/editcharacter/${id}`, {state: {object: object}});
    }

    if (!object) {
        return (
            <div className='CharacterDetail Detail'>
                <h1>Character unavailable</h1>
                <p className="mt-3">Open this character from the Character Gallery.</p>
            </div>
        )
    }

    return (
        <div className='CharacterDetail Detail'>
            <div className='basicStats'>
                <div className='topBar'>
                    <h1>{object.name}</h1>
                    <button className='editButton ml-5' onClick={jumpToEdit}>Edit</button>
                </div>
                <h2>——————————————————</h2>
                <div className='statBar'>
                    <div className='information'>
                        <h3>Species: {object.species}</h3>
                        <h3>Class: {object.class}</h3>
                        <h3>Background: {object.background}</h3>
                        <h3>Alignment: {object.alignment}</h3>
                    </div>
                    <div className='level'>
                            <h2>lvl</h2>
                            <h2>{object.level}</h2>
                    </div>
                </div>
                <div className='abilityScoreBar'>
                    <div className="ability">
                        <h2>Str</h2>
                        <h2>{object.abilityScore.strength}</h2>
                    </div>
                    <div className="ability">
                        <h2>Dex</h2>
                        <h2>{object.abilityScore.dexterity}</h2>
                    </div>
                    <div className="ability">
                        <h2>Con</h2>
                        <h2>{object.abilityScore.constitution}</h2>
                    </div>
                    <div className="ability">
                        <h2>Int</h2>
                        <h2>{object.abilityScore.intelligence}</h2>
                    </div>
                    <div className="ability">
                        <h2>Wis</h2>
                        <h2>{object.abilityScore.wisdom}</h2>
                    </div>
                    <div className="ability">
                        <h2>Cha</h2>
                        <h2>{object.abilityScore.charisma}</h2>
                    </div>
                </div>
            </div>
            <div className='advancedStats'>
                <div className='tableContainer mt-2'>
                    <h2>Spells</h2>
                    <table>
                        <tbody>
                            {object.spells.map((o) => {
                                return <SpellLong key={o.key} o={o} onClick={changePage}/>
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='description mt-2'>
                    <h2>Description</h2>
                    <p>{object.desc}</p>
                </div>
            </div>
        </div>
    )
}

export default CharacterDetail