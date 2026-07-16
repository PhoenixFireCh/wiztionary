import { useState, useEffect } from 'react'
import { Filters } from '../Filters.js'
import { Navigate, useNavigate  } from 'react-router';
import './ReadCharacters.css'

function ReadCharacters() {
    const [items, setItems] = useState([]);

    return (
        <div className='characterList'>
            

        </div>
    );
}

export default ReadCharacters