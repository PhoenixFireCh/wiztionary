import { useLocation, useParams } from 'react-router';
import './Detail.css'

function Detail() {
    const { name } = useParams();
    const { state } = useLocation();
    const object = state?.object;

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

export default Detail