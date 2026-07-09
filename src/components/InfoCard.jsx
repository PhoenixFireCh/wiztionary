import './InfoCard.css' 

const InfoCard = ({description, data, spName}) => {

    return (
        <div className='InfoCard' >
            <h3 className='text-center p-1'>{description}</h3>
            <h3>{data}</h3>
            <p>{spName}</p>
        </div>
    );
};

export default InfoCard;