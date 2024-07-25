import { useState } from "react";
import "./tripleToggle.css";

export default function TripleToggleSwitch( { title, lock, getData, old, data, setData } ) {
    let a = (old === false || old === "false") ? 'left' : (old === true || old === "true") ? 'right' : 'center';
    const [switchPosition, setSwitchPosition] = useState(a);
    const [animation, setAnimation] = useState(null);

    const getSwitchAnimation = (value) => {
        if (value === "center" && switchPosition === "left") setAnimation("left-to-center")
        if (value === "right" && switchPosition === "center") setAnimation("center-to-right")
        if (value === "center" && switchPosition === "right") setAnimation("right-to-center")
        if (value === "left" && switchPosition === "center") setAnimation("center-to-left")
        if (value === "right" && switchPosition === "left") setAnimation("left-to-right")
        if (value === "left" && switchPosition === "right") setAnimation("right-to-left")
    };

    const change = (value) => {
        getData(value, lock, data, setData);
        setSwitchPosition(value);
        getSwitchAnimation(value);
    }
    console.log(old)
    return (
		<span className={`tripleToggleContainer ${lock}`}>
			<h5 className="title">{title}</h5>
			<div className='main-container'>
				<div className={`switch ${animation} ${switchPosition}-position ${lock}`}></div>

				<input name={title} id={`left-${title}-${lock}`} className="left" type='radio' value='left'
					    onChange={e => change(e.target.value)} checked={old === false} />
				<label className='left-label' htmlFor={`left-${title}-${lock}`}>⛔</label>

				<input name={title} id={`center-${title}-${lock}`} className="center" type='radio' value='center'
					    onChange={e => change(e.target.value)} checked={old === ''} />
				<label className='center-label' htmlFor={`center-${title}-${lock}`}>📝</label>

				<input name={title} id={`right-${title}-${lock}`} className="right" type='radio' value='right'
					    onChange={e => change(e.target.value)} checked={old === true} />
				<label className='right-label' htmlFor={`right-${title}-${lock}`}>✅</label>
			</div>
			{switchPosition === "center" && (
				<input
					className={`restrictions ${lock}`} type='text'
                    value={old} onChange={e => change(e.target.value)}
				/>
			)}
		</span>
	);
}