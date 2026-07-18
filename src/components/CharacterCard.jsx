import './CharacterCard.css'


const CharacterCard = ({o, bodyClick, editButtonClick, delButtonClick}) => {

    return (
        <div className="cardBody" data-value={o.id} onClick={bodyClick}>
            <div className='topBar'>
                <h2>{o.name}</h2>
                <div className='buttons'>
                    <button className='editButton' value={o.id} onClick={editButtonClick}></button>
                    <button className='delButton ml-2' value={o.id} onClick={delButtonClick}></button>
                </div>
            </div>
            <div className='bottomBar'>
                <div className="statsLeft">
                    <h2>———————</h2>
                    <h3>{o.species}</h3>
                    <h3>{o.class}</h3>
                    <h3>{o.background}</h3>
                    <h3>{o.alignment}</h3>
                </div>
                <div className="statsRight mt-5">
                    <div className="levelBox">
                        <h3>lvl</h3>
                        <h2>{o.level}</h2>
                    </div>
                    <div className="abilityScoresBox mt-1">
                        <div className="ability">
                            <h3>Str</h3>
                            <h3>{o.abilityScore.strength}</h3>
                        </div>
                        <div className="ability">
                            <h3>Dex</h3>
                            <h3>{o.abilityScore.strength}</h3>
                        </div>
                        <div className="ability">
                            <h3>Con</h3>
                            <h3>{o.abilityScore.constitution}</h3>
                        </div>
                        <div className="ability">
                            <h3>Int</h3>
                            <h3>{o.abilityScore.intelligence}</h3>
                        </div>
                        <div className="ability">
                            <h3>Wis</h3>
                            <h3>{o.abilityScore.wisdom}</h3>
                        </div>
                        <div className="ability">
                            <h3>Cha</h3>
                            <h3>{o.abilityScore.charisma}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CharacterCard