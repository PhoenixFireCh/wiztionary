import './InfoPage.css'

const InfoPage = ({o}) => {

    return (
        <div className='InfoPage'>
            <h3 className='text-center p-1'>{o.name}</h3>
            <div className="statBar">
                <p>Range: {o.range}</p>
                <p>Duration: {o.duration}</p>
                <p>Targets: {o.target_type}</p>
                <p>Usable by: {o.classes.map(o => o.name).join(' ,')}</p>
            </div>
            <p className="mt-3">{o.desc}</p>
        </div>
    );
};

export default InfoPage;