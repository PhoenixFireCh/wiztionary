

const SpellShort = ({o, bodyClick, buttonClick, type}) => {

    return (
        <tr className="mt-1.5" data-value={o.key} onClick={bodyClick}>
            <th>{o.name}</th>
            <th>lvl: {o.level}</th>
            <th><button className="self-center" value={o.key} onClick={buttonClick}>{type}</button></th>
        </tr>
    );
}

export default SpellShort;