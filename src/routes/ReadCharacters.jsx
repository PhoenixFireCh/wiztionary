import { useState, useEffect } from 'react'
import { Navigate, useNavigate  } from 'react-router';
import { supabase } from '../client'
import './ReadCharacters.css'
import CharacterCard from '../components/CharacterCard.jsx';

function ReadCharacters() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    const fetchData = async () => {
        let { data, error } = await supabase
        .from("Characters")
        .select("*");
        if (error) console.error(error);
        //Ensure data is readable
        data.forEach(cls => {
            cls.spells = JSON.parse(cls.spells),
            cls.abilityScore = JSON.parse(cls.abilityScore)
        })
        setItems(data);
    }

    useEffect(() => {
        // setItems runs after an awaited network call (not synchronous), so no cascading render
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData().catch(console.error);
    }, [])

    const delItem = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { data, error } = await supabase
        .from("Characters")
        .delete()
        .eq("id", e.target.value);
        if (error) console.error(error);
        await fetchData();
    }

    const changePageCharacter = (e) => {
        const object = items.find(item => item.id == e.currentTarget.dataset.value)
        navigate(`/characterdetail/${object.id}`, {state: {object: object}});
    }

    const jumpToEdit = (e) => {
        e.stopPropagation();
        const object = items.find(item => item.id == e.target.value);
        navigate(`/editcharacter/${e.target.value}`, {state: {object: object}});
    }


    return (
        <>  
            <div className='gallery'>
                <h1>Character Gallery</h1>
                <div className='characterList'>
                    {items.map((o) => {
                        return <CharacterCard key={o.id}  o={o} delButtonClick={delItem} bodyClick={changePageCharacter} editButtonClick={jumpToEdit}/>
                    })}
                </div>
            </div>
        </>
    );
}

export default ReadCharacters