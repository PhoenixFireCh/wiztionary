import './InfoCard.css' 

const InfoCard = ({description, data, spName}) => {

    return (
        <div className='InfoCard' >
            <h2 className='text-center p-1'>{description}</h2>
            <h2>{data}</h2>
            <p>{spName}</p>
        </div>
    );
};

export default InfoCard;