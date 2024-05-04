import { Fragment, useEffect, useState } from "react";
import PageTitle from "../../util/PageTitle";
import { towerTypeToOptions } from "../../util/selectOptions";
import selectStyle from "../../util/selectStyle";
import Select from "react-select";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";

/**
 * 
 * @param {object} params
 * @param {string} params.tower
 * @param {object[]} params.balanceChanges
 */
function TowerBalanceChanges({tower, balanceChanges}) {
    const versionToBalanceChange = Object.groupBy(balanceChanges, ({version}) => version)
    return <>
        <h2>{tower}</h2>
        {Object.entries(versionToBalanceChange).map(([version, subChanges]) => {
            return <Fragment key={version}>
                <h3>{version}</h3>
                <ul>
                    {subChanges.map(change => <li key={change.uuid}>{change.change}</li>)}
                </ul>
            </Fragment>
        })}
    </>
}

/**
 * 
 * @param {object} params
 * @param {string} params.version
 * @param {object[]} params.balanceChanges
 */
function VersionBalanceChanges({version, balanceChanges}) {
    const towerToBalanceChange = Object.groupBy(balanceChanges, ({tower}) => tower);
    return <>
        <h2>{version}</h2>
        {Object.entries(towerToBalanceChange).map(([tower, subChanges]) => {
            return <Fragment key={tower}>
                <h3>{tower}</h3>
                <ul>
                    {subChanges.map(change => <li key={change.uuid}>{change.change}</li>)}
                </ul>
            </Fragment>
        })}
    </>;
}

export default function BalanceChanges() {
    const [tower, setTower] = useState(undefined);
    const [version, setVersion] = useState("");
    const [balanceChanges, setBalanceChanges] = useState([]);
    const isAdmin = useCheckIfAdmin();

    useEffect(() => {
        let searchParams = {}
        if (tower) searchParams.tower = tower;
        if (version) searchParams.version = version;
        fetch('/fetch-balance-changes?' + new URLSearchParams(searchParams)).then(async (response) => {
            const responseJson = await response.json();
            if ('error' in responseJson) {
                throw new Error(responseJson.error);
            } else if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            } else {
                setBalanceChanges(responseJson.results);
            }
        });
    }, [tower, version]);

    let balanceChangeInfo = <></>;

    if (tower) {
        balanceChangeInfo = <TowerBalanceChanges tower={tower} balanceChanges={balanceChanges} />
    } else if (version) {
        balanceChangeInfo = <VersionBalanceChanges version={version} balanceChanges={balanceChanges} />
    }

    return <>
        <PageTitle>Balance Changes</PageTitle>
        {isAdmin && <p><a href="/modify-balance-changes">Edit Balance Changes</a></p>}
        <Select id="tower" options={[...towerTypeToOptions.values()]}
                    styles={selectStyle} placeholder="Tower" isClearable
                    defaultValue={towerTypeToOptions.get(tower) ?? undefined}
                    onChange={val => setTower(val?.value ?? undefined)} />
        <br />
        <input type="text" id="version" autoComplete="off" placeholder="Version" onChange={val => setVersion(val?.target?.value ?? "")} />
        <button type="button">Latest Version</button>
        <br />
        {balanceChangeInfo}
    </>
}
