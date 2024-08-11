import { useState, useEffect } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';

export default function TripleToggleSwitch( { title, lock, getData, old, data, setData } ) {
    let a = (old === false || old === "false") ? 'left' : (old === true || old === "true") ? 'right' : 'center';
    let b;
    if(old !== false || old !== "false" || old !== true || old !== "true" || old !== 'center') b = old
    const [alignment, setAlignment] = useState(a);
    const [text, setText] = useState(b);
    const [/* restriction */, setRestriction] = useState('');

  const handleAlignment = (event, newAlignment) => {
    console.log(event)
    setAlignment(newAlignment);
  };

  const handleText = (event) => {
    setText(event.target.value)
  }

  useEffect(() => {
    if(alignment === 'center'){
        setRestriction(text)
        getData(text, lock, data, setData)
    } else {
        setRestriction(alignment)
        getData(alignment, lock, data, setData)
    }
  }, [alignment, data, getData, lock, setData, text])

  return (
    <div className="tripleToggleContainer">
        <h5 className="title">{title}</h5>
        <ToggleButtonGroup
            value={alignment}
            color='primary'
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
        >
            <ToggleButton value="left" aria-label="left aligned"><CancelIcon /></ToggleButton>
            <ToggleButton value="center" aria-label="centered"><EditNoteIcon /></ToggleButton>
            <ToggleButton value="right" aria-label="right aligned"><CheckCircleIcon /></ToggleButton>
        </ToggleButtonGroup>
        {alignment === 'center' && <div>
            <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                variant="filled"
                defaultValue={text.toString().replaceAll('"','')}
                onChange={handleText}
                size="small"
            />
        </div>}
    </div>
  );
}