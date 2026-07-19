import { useLocation, useParams } from 'react-router';
import { useEffect } from 'react'
import './Detail.css'

function SpellDetail() {
    const { name } = useParams();
    const { state } = useLocation();
    const storageKey = `spell:${name}`;
    let object = state?.object ?? null;
    if (!object) {
        try { object = JSON.parse(sessionStorage.getItem(storageKey)) } catch { object = null }
    }

    useEffect(() => {
        if (state?.object) {
            try { sessionStorage.setItem(storageKey, JSON.stringify(state.object)) } catch { /* storage full/disabled */ }
        }
    }, [state, storageKey]);

    if (!object) {
        return (
            <div className='Detail'>
                <h1>{name}</h1>
                <p className="mt-3">Spell data unavailable — open this spell from the dashboard.</p>
            </div>
        )
    }

    return (
        <div className='Detail'>
            <h1>{name}</h1>
            <div className='statBar'>
                <p>Range: {object.range}</p>
                <p>School: {object.school.name}</p>
                <p>Duration: {object.duration}</p>
                <p>Targets: {object.target_type}</p>
                <p>Usable by: {object.classes.map(o => o.name).join(', ')}</p>
            </div>
            <p className="mt-3">{object.desc}</p>
        </div>
    )

}

export default SpellDetail