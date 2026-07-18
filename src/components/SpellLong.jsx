

const SpellLong = ({o, onClick}) => {

    return (
        <tr className="mt-1.5" data-value={o.key} onClick={onClick}>
            <th>{o.name}</th>
            <th>{o.range}</th>
            <th>{o.classes.map(o => o.name).join(', ')}</th>
            <th>{o.duration}</th>
            <th>{o.damage_roll}</th>
        </tr>
    );
}

export default SpellLong;