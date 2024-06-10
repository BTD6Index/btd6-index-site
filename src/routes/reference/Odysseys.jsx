import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import OdysseySelect from "../../util/OdysseySelect";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";
import useAccessToken from "../../util/useAccessToken";
import PageTitle from "../../util/PageTitle";
import filterNewTowers from "../../util/filterNewTowers.js";

export default function Odysseys() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [odysseyInfo, setOdysseyInfo] = useState(null);
    const [ltos, setLtos] = useState(null);
    const [ltoError, setLtoError] = useState(null);
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();
    const [heroList, setHeroList] = useState([]);
    const [towerList, setTowerList] = useState(null);

    useEffect(() => {
        const odysseyName = searchParams.get('odysseyName');
        if (odysseyName) {
            fetch('/fetch-odyssey-info?' + new URLSearchParams({odysseyName}))
            .then(async (res) => {
                let resJson = await res.json();
                setOdysseyInfo(resJson);
            });
        }
    }, [searchParams]);

    useEffect(() => {
        const odysseyName = searchParams.get('odysseyName');
        if (odysseyName) {
            fetch('/fetch-lto?' + new URLSearchParams({odysseyName, pending: 0, count: 100}))
            .then(async (res) => {
                let resJson = await res.json();
                if ('error' in resJson) {
                    throw new Error(resJson.error);
                } else {

                    let lto = [];
                    resJson.results.forEach(element => {
                        if(element.odysseyName === odysseyName) {lto.push(element)};
                    });
                    setLtos(lto);
                }
            })
            .catch(e => {
                setLtoError(e.message);
            });
        }
    }, [searchParams]);

    useEffect(() => {
        let date = odysseyInfo ? odysseyInfo.startDate : '2018-06-18';
        setHeroList(filterNewTowers(date, 'heroes'));
        setTowerList(filterNewTowers(date, 'towers'));
    }, [odysseyInfo])


    const deleteCallback = useCallback(async () => {
        if (window.confirm(`Delete odyssey ${searchParams.get('odysseyName')}?`)) {
            try {
                const formData = new FormData();
                formData.set('odysseyName', searchParams.get('odysseyName'));
                const token = await getToken({
                    authorizationParams: {
                        audience: 'https://btd6index.win/',
                        scope: 'openid email profile offline_access'
                    }
                });
                const res = await fetch('/admin/delete-odyssey', {
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
                alert('Successfully deleted odyssey.');
                setSearchParams({});
            } catch (e) {
                alert(`Error deleting odyssey: ${e.message}`);
            }
        }
    }, [searchParams, getToken, setSearchParams]);

    return <>
        <PageTitle>Odysseys</PageTitle>
        <p>Select an odyssey from the dropdown below to view information about that odyssey.</p>
        {isAdmin && <p><a href='/add-odyssey'>Add Odyssey</a></p>}
        <OdysseySelect
            odysseyValue={searchParams.get('odysseyName')}
            onChange={val => setSearchParams({odysseyName: val.value})}
            reloadVar={searchParams.get('odysseyName')}
        />
        {   
            searchParams.get('odysseyName') && odysseyInfo && <>
                {console.log(heroList)}
                <br/><br/>
                { isAdmin && <>
                    <a href={`/add-odyssey?${new URLSearchParams({odysseyName: searchParams.get('odysseyName')})}`}><button type="button">Edit Odyssey</button></a>
                    <button type="button" className="dangerButton" onClick={deleteCallback}>Delete Odyssey</button>
                </> }
                <h2>Odyssey Information for {odysseyInfo.odysseyName}</h2>
                <h3 style={{color:"red"}}>{odysseyInfo.isExtreme === true ? "🔥Extreme Odyssey🔥" : ""}</h3>
                <dl>
                    <dt>Date: {odysseyInfo.startDate} - {odysseyInfo.endDate}</dt>
                    <table className='odysseyMapsTable'>
                        <thead>
                            <tr>
                                <th>Map #1</th><th>Map #2</th><th>Map #3</th><th>Map #4</th><th>Map #5</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{odysseyInfo.islandOne.split(" | ")[0]}</td>
                                <td>{odysseyInfo.islandTwo.split(" | ")[0]}</td>
                                <td>{odysseyInfo.islandThree.split(" | ")[0]}</td>
                                <td>{odysseyInfo.islandFour.split(" | ")[0]}</td>
                                <td>{odysseyInfo.islandFive.split(" | ")[0]}</td>
                            </tr>
                            <tr>
                                <td>{odysseyInfo.islandOne.split(" | ")[1]}</td>
                                <td>{odysseyInfo.islandTwo.split(" | ")[1]}</td>
                                <td>{odysseyInfo.islandThree.split(" | ")[1]}</td>
                                <td>{odysseyInfo.islandFour.split(" | ")[1]}</td>
                                <td>{odysseyInfo.islandFive.split(" | ")[1]}</td>
                            </tr>
                            <tr>
                                <td>Rounds {odysseyInfo.islandOne.split(" | ")[2]}</td>
                                <td>Rounds {odysseyInfo.islandTwo.split(" | ")[2]}</td>
                                <td>Rounds {odysseyInfo.islandThree.split(" | ")[2]}</td>
                                <td>Rounds {odysseyInfo.islandFour.split(" | ")[2]}</td>
                                <td>Rounds {odysseyInfo.islandFive.split(" | ")[2]}</td>
                            </tr>
                        </tbody>
                    </table>
                    <dt>{odysseyInfo.seats} Seats, {odysseyInfo.towers} Towes Max</dt>
                    <dt>Hero Information</dt>
                    <table className='odysseyTowersTable'>
                        <thead>
                            <tr>
                                {heroList.map(hero => (<th key={hero}>{hero}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {heroList.map((hero, i) => (<td key={hero}>{odysseyInfo.heroes.split(" | ")[i] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[i] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[i])}</td>))}
                            </tr>
                        </tbody>
                    </table>
                    <dt>Primary Tower Information</dt>
                    <table className='odysseyTowersTable'>
                        <thead>
                            <tr>
                                {towerList.slice(0,towerList.indexOf('Sniper Monkey')).map(tower => <th key={tower}>{tower}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {towerList.slice(0,towerList.indexOf('Sniper Monkey')).map((tower, i) => <td key={tower}>{odysseyInfo.primaryTowers.split(" | ")[i] === "true" ? "✔️" : (odysseyInfo.primaryTowers.split(" | ")[i] === "false" ? "❌" : odysseyInfo.primaryTowers.split(" | ")[i])}</td>)}
                            </tr>
                        </tbody>
                    </table>
                    <dt>Military Tower Information</dt>
                    <table className='odysseyTowersTable'>
                        <thead>
                            <tr>
                                {towerList.slice(towerList.indexOf('Sniper Monkey'), towerList.indexOf('Wizard Monkey')).map(tower => <th key={tower}>{tower}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {towerList.slice(towerList.indexOf('Sniper Monkey'), towerList.indexOf('Wizard Monkey')).map((tower, i) => <td key={tower}>{odysseyInfo.militaryTowers.split(" | ")[i] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[i] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[i])}</td>)}
                            </tr>
                        </tbody>
                    </table>
                    <dt>Magic Tower Information</dt>
                    <table className='odysseyTowersTable'>
                        <thead>
                            <tr>
                                {towerList.slice(towerList.indexOf('Wizard Monkey'), towerList.indexOf('Banana Farm')).map(tower => <th key={tower}>{tower}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {towerList.slice(towerList.indexOf('Wizard Monkey'), towerList.indexOf('Banana Farm')).map((tower, i) => <td key={tower}>{odysseyInfo.magicTowers.split(" | ")[i] === "true" ? "✔️" : (odysseyInfo.magicTowers.split(" | ")[i] === "false" ? "❌" : odysseyInfo.magicTowers.split(" | ")[i])}</td>)}
                            </tr>
                        </tbody>
                    </table>
                    <dt>Support Tower Information</dt>
                    <table className='odysseyTowersTable'>
                        <thead>
                            <tr>
                                {towerList.slice(towerList.indexOf('Banana Farm')).map(tower => <th key={tower}>{tower}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {towerList.slice(towerList.indexOf('Banana Farm')).map((tower, i) => <td key={tower}>{odysseyInfo.supportTowers.split(" | ")[i] === "true" ? "✔️" : (odysseyInfo.supportTowers.split(" | ")[i] === "false" ? "❌" : odysseyInfo.supportTowers.split(" | ")[i])}</td>)}
                            </tr>
                        </tbody>
                    </table>
                    {
                        odysseyInfo.miscNotes && <>
                            <dt>Miscellaneous Notes</dt>
                            <dd className="multiline">{odysseyInfo.miscNotes}</dd>
                        </>
                    }
                </dl>
                <h2>LTOs for {odysseyInfo.odysseyName}</h2>
                {
                    ltoError
                    ? <p>Error fetching LTOs: {ltoError}</p>
                    : (ltos && <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Towers</th>
                                    <th>Person</th>
                                    <th>Info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ltos.map(lto => {
                                        const link = lto.link || `https://media.btd6index.win/${lto.filekey}`;

                                        return <tr key={lto.filekey}>
                                            <td>{JSON.parse(lto.towerset).join(', ')}</td>
                                            <td>{lto.person}</td>
                                            <td><a href={link}>Link</a> | <a href={'/lto/notes?' + new URLSearchParams({filekey: lto.filekey})}>Notes</a></td>
                                        </tr>;
                                    })
                                }
                            </tbody>
                        </table>
                    </>)
                }
            </>
        }
    </>
}