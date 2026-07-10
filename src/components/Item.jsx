

const Item = (prop) => {

    return (
        <tr className="mt-1.5" data-value={JSON.stringify(prop.o)} onClick={prop.onClick}>
            <th>{prop.o.name}</th>
            <th>{prop.o.range}</th>
            <th>{prop.o.classes.map(o => o.name).join(', ')}</th>
            <th>{prop.o.duration}</th>
            <th>{prop.o.damage_roll}</th>
        </tr>
    );
}

export default Item;