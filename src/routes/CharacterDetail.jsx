import { useLocation, useParams, Navigate, useNavigate } from 'react-router';
import SpellLong from '../components/SpellLong';
import './Detail.css'
import './CharacterDetail.css'

function CharacterDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const object = state?.object;

    const changePage = (e) => {
        const o = object.spells.find(item => item.key === e.currentTarget.dataset.value)
        navigate(`/spelldetail/${o.name}`, {state: {object: o}});
    }

    const jumpToEdit = (e) => {
        navigate(`/editcharacter/${id}`, {state: {object: object}});
    }

    return ( 
        <div className='CharacterDetail Detail'>
            <div className='topBar'>
                <h1>{object.name}</h1>
                <button className='editButton ml-5' onClick={jumpToEdit}>Edit</button>
            </div>
            <h2>——————————————————</h2>
            <div className='basicStats'>
                <div className='statBar'>
                    <h3>Range: {object.species}</h3>
                    <h3>School: {object.class}</h3>
                    <h3>Duration: {object.background}</h3>
                    <h3>Targets: {object.alignment}</h3>
                </div>
                <div className='level'>
                    <h2>lvl</h2>
                    <h2>{object.level}</h2>
                </div>
                <div className='abilityScoreBar'>
                    <div className="ability">
                        <h2>Str</h2>
                        <h2>{object.abilityScore.strength}</h2>
                    </div>
                    <div className="ability">
                        <h2>Dex</h2>
                        <h2>{object.abilityScore.strength}</h2>
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
            <div className='advancedStats mt-5'>
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