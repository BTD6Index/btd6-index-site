import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useCallback, useEffect, useRef } from "react";
import useAccessToken from "../../../util/useAccessToken";
import PageTitle from "../../../util/PageTitle";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import heroNames from '../../../util/heroes.json'
import towerNames from '../../../../functions/tower-names.json'
import TripleToggleSwitch from "../../../util/tripleToggle";
import filterNewTowers from "../../../util/filterNewTowers";

function ManipOdyssey() {
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();
    const formRef = useRef();
    const [searchParams, setSearchParams] = useSearchParams();
    const [oldOdysseyInfo, setOldOdysseyInfo] = useState(null);
    const [heroes, setHeroes] = useState(Object.keys(heroNames));
    const [towers, setTowers] = useState(Object.keys(towerNames));
    const [heroInfo, setHeroInfo] = useState(new Array(heroes.length).fill(false));
    const [primaryInfo, setPrimaryInfo] = useState(new Array(towers.slice(0, towers.indexOf("Sniper Monkey")).length).fill(false));
    const [militaryInfo, setMilitaryInfo] = useState(new Array(towers.slice(towers.indexOf("Sniper Monkey"), towers.indexOf("Wizard Monkey")).length).fill(false));
    const [magicInfo, setMagicInfo] = useState(new Array(towers.slice(towers.indexOf("Wizard Monkey"), towers.indexOf("Banana Farm")).length).fill(false));
    const [supportInfo, setSupportInfo] = useState(new Array(towers.slice(towers.indexOf("Banana Farm")).length).fill(false));
    const [sDate, setSDate] = useState('2018-06-18');
    const [eDate, setEDate] = useState('2018-06-23');

    const onSubmitCallback = useCallback(async (event) => {
        try {
            event.preventDefault();
            const formData = new FormData(formRef.current);
            const token = await getToken({
                authorizationParams: {
                    audience: 'https://btd6index.win/',
                    scope: 'openid email profile offline_access'
                }
            });
            const res = await fetch(formRef.current.action, {
                body: formData,
                method: 'post',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const resJson = await res.json();
            if ('error' in resJson) {
                throw new Error(resJson.error);
            }
            alert(`Successfully ${searchParams.get('odysseyName') ? 'edited' : 'added'} Odyssey.`);
            if (searchParams.get('odysseyName')) {
                setSearchParams({odysseyName: formData.get('odysseyName')});
            }
        } catch (e) {
            alert(`Error adding Odyssey: ${e.message}`);
        }
    }, [formRef, getToken, searchParams, setSearchParams]);

    useEffect(() => {
        if (searchParams.has('odysseyName')) {
            setOldOdysseyInfo(null);
            fetch(`/fetch-odyssey-info?${new URLSearchParams({odysseyName: searchParams.get('odysseyName')})}`).then(async (result) => {
                const resJson = await result.json();
                if ('error' in resJson) {
                    throw new Error(resJson.error);
                }
                setOldOdysseyInfo(resJson);
                setHeroInfo(resJson.heroes.split(' | '));
                setPrimaryInfo(resJson.primaryTowers.split(' | '));
                setMilitaryInfo(resJson.militaryTowers.split(' | '));
                setMagicInfo(resJson.magicTowers.split(' | '));
                setSupportInfo(resJson.supportTowers.split(' | '));
                setSDate(resJson.startDate);
                setEDate(resJson.endDate);
            });
        }
    }, [searchParams]);

    useEffect(() =>{
        let adjustedSSDate = new Date(new Date(sDate).getTime() + (10 * 60 * 60 * 1000));
        let adjustedEEDate = new Date(adjustedSSDate.getTime() + (5 * 24 * 60 * 60 * 1000));
        setHeroes(filterNewTowers(sDate, 'heroes'));
        setTowers(filterNewTowers(sDate, 'towers'));
        
        let y = adjustedEEDate.getFullYear().toString(), m = (adjustedEEDate.getMonth() + 1).toString(), d = adjustedEEDate.getDate().toString();

        if(m.length === 1) m = '0' + m;
        if(d.length === 1) d = '0' + d;

        setEDate(`${y}-${m}-${d}`)
    }, [sDate])

    const getData = (value, i, data, setData) => {
        let tmp = (value === 'left') ? true : (value === 'right') ? false : (value === 'center') ? '' : value;
        console.log(tmp)
        setData(data.map((_, idx) => {return idx === i ? data[idx] = tmp : data[idx]}))
    }

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>{searchParams.get('odysseyName') ? 'Edit Odyssey' : 'Add Odyssey'}</PageTitle>
        <p><a href='/odysseys'>Back to Odysseys</a></p>
        {(!searchParams.has('odysseyName') || oldOdysseyInfo) && <form action="/admin/add-new-odyssey" method="post" ref={formRef} onSubmit={onSubmitCallback}>
            <br />
            <span className="formLine">
                <label htmlFor="odysseyName">Odyssey Name</label>
                <input name='odysseyName' id='odysseyName' type='text' size="50" defaultValue={oldOdysseyInfo?.odysseyName} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="startDate">Start Date</label>
                <input onChange={e => setSDate(e.target.value)}name='startDate' id='startDate' type='date' value={sDate ? sDate : oldOdysseyInfo?.startDate} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="endDate">End Date</label>
                <input onChange={e => setEDate(e.target.value)} name='endDate' id='endDate' type='date' value={eDate ? eDate : oldOdysseyInfo?.endDate} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="isExtreme">Is Extreme?</label>
                <input type="checkbox" id="isExtreme" name="isExtreme" defaultChecked={oldOdysseyInfo?.isExtreme}/>
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandOne">Island One Info</label>
                <input name='islandOne' id='islandOne' type='text' size="50" defaultValue={oldOdysseyInfo?.islandOne} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandTwo">Island Two Info</label>
                <input name='islandTwo' id='islandTwo' type='text' size="50" defaultValue={oldOdysseyInfo?.islandTwo} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandThree">Island Three Info</label>
                <input name='islandThree' id='islandThree' type='text' size="50" defaultValue={oldOdysseyInfo?.islandThree} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandFour">Island Four Info</label>
                <input name='islandFour' id='islandFour' type='text' size="50" defaultValue={oldOdysseyInfo?.islandFour} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandFive">Island Five Info</label>
                <input name='islandFive' id='islandFive' type='text' size="50" defaultValue={oldOdysseyInfo?.islandFive} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="seats">Number of Seats</label>
                <input name='seats' id='seats' type='number' defaultValue={oldOdysseyInfo?.seats} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="towers">Number of Towers</label>
                <input name='towers' id='towers' type='number' defaultValue={oldOdysseyInfo?.towers} required />
            </span>
            <br />
            <span>
                <label>Hero Info</label>
                <span className="formLine" style={{display: 'flex', flexFlow: 'row wrap'}}>
                    {heroes.map((e, i) => {
                        return(<TripleToggleSwitch key={i} title={e} lock={i} getData={getData} old={heroInfo[i]} data={heroInfo} setData={setHeroInfo}/>)
                    })}
                </span>
                <input type="hidden" name="heroes" value={JSON.stringify(heroInfo)?.slice(1, -1).replaceAll(',', ' | ')}></input>
            </span>
            <br />
{/*             <span>
                <label>Primary Tower Info</label>
                <span className="formLine" style={{display: 'flex', flexFlow: 'row wrap'}}>
                    {towers.slice(0, towers.indexOf("Sniper Monkey")).map((e, i) => {
                        return(<TripleToggleSwitch key={i} title={e} lock={i} getData={getData} old={primaryInfo[i]} data={primaryInfo} setData={setPrimaryInfo}/>)
                    })}
                </span>
                <input type="hidden" name="primaryTowers" value={JSON.stringify(primaryInfo)?.slice(1, -1).replaceAll(',', ' | ')}></input>
            </span>
            <br />
            <span>
                <label>Military Tower Info</label>
                <span className="formLine" style={{display: 'flex', flexFlow: 'row wrap'}}>
                    {towers.slice(towers.indexOf("Sniper Monkey"), towers.indexOf("Wizard Monkey")).map((e, i) => {
                        return(<TripleToggleSwitch key={i} title={e} lock={i} getData={getData} old={militaryInfo[i]} data={militaryInfo} setData={setMilitaryInfo}/>)
                    })}
                </span>
                <input type="hidden" name="militaryTowers" value={JSON.stringify(militaryInfo)?.slice(1, -1).replaceAll(',', ' | ')}></input>
            </span>
            <br />
            <span>
                <label>Magic Tower Info</label>
                <span className="formLine" style={{display: 'flex', flexFlow: 'row wrap'}}>
                    {towers.slice(towers.indexOf("Wizard Monkey"), towers.indexOf("Banana Farm")).map((e, i) => {
                        return(<TripleToggleSwitch key={i} title={e} lock={i} getData={getData} old={magicInfo[i]} data={magicInfo} setData={setMagicInfo}/>)
                    })}
                </span>
                <input type="hidden" name="magicTowers" value={JSON.stringify(magicInfo)?.slice(1, -1).replaceAll(',', ' | ')}></input>
            </span>
            <br />
            <span>
                <label>Support Tower Info</label>
                <span className="formLine" style={{display: 'flex', flexFlow: 'row wrap'}}>
                    {towers.slice(towers.indexOf("Banana Farm")).map((e, i) => {
                        return(<TripleToggleSwitch key={i} title={e} lock={i} getData={getData} old={supportInfo[i]} data={supportInfo} setData={setSupportInfo}/>)
                    })}
                </span>
                <input type="hidden" name="supportTowers" value={JSON.stringify(supportInfo)?.slice(1, -1).replaceAll(',', ' | ')}></input>
            </span>
            <br /> */}
            <span className="formLine">
                <label htmlFor="miscNotes">Miscellaneous Notes</label>
                <textarea id="miscNotes" name="miscNotes" cols={50} rows={5} defaultValue={oldOdysseyInfo?.miscNotes}/>
            </span>
            <br />
            {searchParams.get('odysseyName') && <input type="hidden" name="oldOdyssey" value={searchParams.get('odysseyName')} />}
            <input type="submit" value={oldOdysseyInfo ? 'Update Odyssey' : 'Add Odyssey'} />
        </form>
        }
    </>;
}

export const AddOdyssey = withAuthenticationRequired(() => {
    return <ManipOdyssey />;
});
