const Item = ({name, range, build, duration, damage}) => {

    return (
        <tr>
            <th>{name}</th>
            <th>{range}</th>
            <th>{build}</th>
            <th>{duration}</th>
            <th>{damage}</th>
        </tr>
    );
}

export default Item;