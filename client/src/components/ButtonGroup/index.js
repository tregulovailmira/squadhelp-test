import React, { useState } from 'react'
import Button from './Button';

export default function ButtonGroup() {

    const [checkedValue, setCheckedValue] = useState('');

    const handleClick = value => {
        setCheckedValue(value);
    };

    return (
        <div>
            <Button value='match name' checkedValue={checkedValue} handleClick={handleClick} iconText='yes'>
                The Domain should exactly match the name
            </Button>
            <Button value='yes' checkedValue={checkedValue} handleClick={handleClick} iconText='yes'>
                But minor variations are allowed (Recommended)
            </Button>
            <Button value='no' checkedValue={checkedValue} handleClick={handleClick} iconText='no'>
                I am only looking for a name, not a Domain
            </Button>
        </div>
    )
}
