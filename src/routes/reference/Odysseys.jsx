import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import OdysseySelect from "../../util/OdysseySelect";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";
import useAccessToken from "../../util/useAccessToken";
import PageTitle from "../../util/PageTitle";

export default function Odysseys() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [odysseyInfo, setOdysseyInfo] = useState(null);
    const [ltos, setLtos] = useState(null);
    const [ltoError, setLtoError] = useState(null);
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();

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
        const map = searchParams.get('odysseyName');
        if (map) {
            fetch('/fetch-lto?' + new URLSearchParams({map, pending: 0, count: 100}))
            .then(async (res) => {
                let resJson = await res.json();
                if ('error' in resJson) {
                    throw new Error(resJson.error);
                } else {

                    let lto = [];
                    resJson.results.forEach(element => {
                        if(element.odysseyName === map) {lto.push(element)};
                    });
                    setLtos(lto);
                }
            })
            .catch(e => {
                setLtoError(e.message);
            });
        }
    }, [searchParams]);

    const deleteCallback = useCallback(async () => {
        if (window.confirm(`Delete odyssey ${searchParams.get('odysseyNumber')}?`)) {
            try {
                const formData = new FormData();
                formData.set('odysseyNumber', searchParams.get('odysseyNumber'));
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
                <br/><br/>{ isAdmin && <button type="button" className="dangerButton" onClick={deleteCallback}>Delete Odyssey</button> }
                <h2>Odyssey Information for {odysseyInfo.odysseyName}</h2>
                <h3 style={{color:"red"}}>{odysseyInfo.isExtreme === true ? "🔥Extreme Odyssey🔥" : ""}</h3>
                <dl>
                    <dt>Date: {odysseyInfo.startDate} - {odysseyInfo.endDate}</dt>
                    <table>
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
                                <td>{odysseyInfo.islandOne.split(" | ")[2]}</td>
                                <td>{odysseyInfo.islandTwo.split(" | ")[2]}</td>
                                <td>{odysseyInfo.islandThree.split(" | ")[2]}</td>
                                <td>{odysseyInfo.islandFour.split(" | ")[2]}</td>
                                <td>{odysseyInfo.islandFive.split(" | ")[2]}</td>
                            </tr>
                        </tbody>
                    </table>
                    <dt>Hero Information</dt>
                    <table>
                        <thead>
                            <tr>
                                <th>Quincy</th><th>Gwen</th><th>Striker</th><th>Obyn</th><th>Church</th><th>Ben</th><th>Ezili</th><th>Pat</th><th>Adora</th><th>Brickell</th><th>Etienne</th><th>Sauda</th><th>Psi</th><th>Geraldo</th><th>Corvus</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{odysseyInfo.heroes.split(" | ")[0] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[0] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[0])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[1] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[1] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[1])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[2] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[2] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[2])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[3] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[3] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[3])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[4] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[4] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[4])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[5] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[5] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[5])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[6] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[6] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[6])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[7] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[7] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[7])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[8] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[8] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[8])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[9] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[9] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[9])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[10] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[10] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[10])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[11] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[11] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[11])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[12] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[12] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[12])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[13] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[13] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[13])}</td>
                                <td>{odysseyInfo.heroes.split(" | ")[14] === "true" ? "✔️" : (odysseyInfo.heroes.split(" | ")[14] === "false" ? "❌" : odysseyInfo.heroes.split(" | ")[14])}</td>
                            </tr>
                        </tbody>
                    </table>
                    <dt>Primary Tower Information</dt>
                    <table>
                        <thead>
                            <tr>
                                <th>Dart</th><th>Boomer</th><th>Bomb</th><th>Tack</th><th>Ice</th><th>Glue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{odysseyInfo.primaryTowers.split(" | ")[0] === "true" ? "✔️" : (odysseyInfo.primaryTowers.split(" | ")[0] === "false" ? "❌" : odysseyInfo.primaryTowers.split(" | ")[0])}</td>
                                <td>{odysseyInfo.primaryTowers.split(" | ")[1] === "true" ? "✔️" : (odysseyInfo.primaryTowers.split(" | ")[1] === "false" ? "❌" : odysseyInfo.primaryTowers.split(" | ")[1])}</td>
                                <td>{odysseyInfo.primaryTowers.split(" | ")[2] === "true" ? "✔️" : (odysseyInfo.primaryTowers.split(" | ")[2] === "false" ? "❌" : odysseyInfo.primaryTowers.split(" | ")[2])}</td>
                                <td>{odysseyInfo.primaryTowers.split(" | ")[3] === "true" ? "✔️" : (odysseyInfo.primaryTowers.split(" | ")[3] === "false" ? "❌" : odysseyInfo.primaryTowers.split(" | ")[3])}</td>
                                <td>{odysseyInfo.primaryTowers.split(" | ")[4] === "true" ? "✔️" : (odysseyInfo.primaryTowers.split(" | ")[4] === "false" ? "❌" : odysseyInfo.primaryTowers.split(" | ")[4])}</td>
                                <td>{odysseyInfo.primaryTowers.split(" | ")[5] === "true" ? "✔️" : (odysseyInfo.primaryTowers.split(" | ")[5] === "false" ? "❌" : odysseyInfo.primaryTowers.split(" | ")[5])}</td>
                            </tr>
                        </tbody>
                    </table>
                    <dt>Military Tower Information</dt>
                    <table>
                        <thead>
                            <tr>
                                <th>Sniper</th><th>Sub</th><th>Bucc</th><th>Ace</th><th>Heli</th><th>Mortar</th><th>Dartling</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{odysseyInfo.militaryTowers.split(" | ")[0] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[0] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[0])}</td>
                                <td>{odysseyInfo.militaryTowers.split(" | ")[1] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[1] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[1])}</td>
                                <td>{odysseyInfo.militaryTowers.split(" | ")[2] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[2] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[2])}</td>
                                <td>{odysseyInfo.militaryTowers.split(" | ")[3] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[3] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[3])}</td>
                                <td>{odysseyInfo.militaryTowers.split(" | ")[4] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[4] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[4])}</td>
                                <td>{odysseyInfo.militaryTowers.split(" | ")[5] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[5] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[5])}</td>
                                <td>{odysseyInfo.militaryTowers.split(" | ")[6] === "true" ? "✔️" : (odysseyInfo.militaryTowers.split(" | ")[6] === "false" ? "❌" : odysseyInfo.militaryTowers.split(" | ")[6])}</td>
                            </tr>
                        </tbody>
                    </table>
                    <dt>Magic Tower Information</dt>
                    <table>
                        <thead>
                            <tr>
                                <th>Wizard</th><th>Super</th><th>Ninja</th><th>Alch</th><th>Druid</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{odysseyInfo.magicTowers.split(" | ")[0] === "true" ? "✔️" : (odysseyInfo.magicTowers.split(" | ")[0] === "false" ? "❌" : odysseyInfo.magicTowers.split(" | ")[0])}</td>
                                <td>{odysseyInfo.magicTowers.split(" | ")[1] === "true" ? "✔️" : (odysseyInfo.magicTowers.split(" | ")[1] === "false" ? "❌" : odysseyInfo.magicTowers.split(" | ")[1])}</td>
                                <td>{odysseyInfo.magicTowers.split(" | ")[2] === "true" ? "✔️" : (odysseyInfo.magicTowers.split(" | ")[2] === "false" ? "❌" : odysseyInfo.magicTowers.split(" | ")[2])}</td>
                                <td>{odysseyInfo.magicTowers.split(" | ")[3] === "true" ? "✔️" : (odysseyInfo.magicTowers.split(" | ")[3] === "false" ? "❌" : odysseyInfo.magicTowers.split(" | ")[3])}</td>
                                <td>{odysseyInfo.magicTowers.split(" | ")[4] === "true" ? "✔️" : (odysseyInfo.magicTowers.split(" | ")[4] === "false" ? "❌" : odysseyInfo.magicTowers.split(" | ")[4])}</td>
                            </tr>
                        </tbody>
                    </table>
                    <dt>Support Tower Information</dt>
                    <table>
                        <thead>
                            <tr>
                                <th>Farm</th><th>Spac</th><th>Engi</th><th>Village</th><th>Beast</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{odysseyInfo.supportTowers.split(" | ")[0] === "true" ? "✔️" : (odysseyInfo.supportTowers.split(" | ")[0] === "false" ? "❌" : odysseyInfo.supportTowers.split(" | ")[0])}</td>
                                <td>{odysseyInfo.supportTowers.split(" | ")[1] === "true" ? "✔️" : (odysseyInfo.supportTowers.split(" | ")[1] === "false" ? "❌" : odysseyInfo.supportTowers.split(" | ")[1])}</td>
                                <td>{odysseyInfo.supportTowers.split(" | ")[2] === "true" ? "✔️" : (odysseyInfo.supportTowers.split(" | ")[2] === "false" ? "❌" : odysseyInfo.supportTowers.split(" | ")[2])}</td>
                                <td>{odysseyInfo.supportTowers.split(" | ")[3] === "true" ? "✔️" : (odysseyInfo.supportTowers.split(" | ")[3] === "false" ? "❌" : odysseyInfo.supportTowers.split(" | ")[3])}</td>
                                <td>{odysseyInfo.supportTowers.split(" | ")[4] === "true" ? "✔️" : (odysseyInfo.supportTowers.split(" | ")[4] === "false" ? "❌" : odysseyInfo.supportTowers.split(" | ")[4])}</td>
                            </tr>
                        </tbody>
                    </table>
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