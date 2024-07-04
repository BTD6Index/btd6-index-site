import { Fragment, useEffect, useState } from "react";
import PageTitle from "../../util/PageTitle";
import { towerTypeAndHeroToOptions } from "../../util/selectOptions";
import selectStyle from "../../util/selectStyle";
import Select from "react-select";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";
import descendingVersionOrderSort from "../../util/descendingVersionOrderSort";
import BalanceChangeDisplay from "../../util/BalanceChangeDisplay";

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
                    {subChanges.map(change => <BalanceChangeDisplay key={change.uuid} {...change} />)}
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
                    {subChanges.map(change => <BalanceChangeDisplay key={change.uuid} {...change} />)}
                </ul>
            </Fragment>
        })}
    </>;
}

export default function BalanceChanges() {
    const [tower, setTower] = useState(undefined);
    const [version, setVersion] = useState("");
    const [versionOptions, setVersionOptions] = useState([]);
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

    useEffect(() => {
        fetch('/fetch-balance-change-versions?' + new URLSearchParams(tower ? {tower} : {})).then(async (response) => {
            const resJson = await response.json();
            if ('error' in resJson) {
                throw new Error(resJson.error);
            }
            setVersionOptions(resJson.results
                .sort(descendingVersionOrderSort)
                .map(version => ({value: version, label: version})));
        });
    }, [tower]);

    let balanceChangeInfo = <></>;

    if (tower) {
        balanceChangeInfo = <TowerBalanceChanges tower={tower} balanceChanges={balanceChanges} />
    } else if (version) {
        balanceChangeInfo = <VersionBalanceChanges version={version} balanceChanges={balanceChanges} />
    }

    return <>
        <PageTitle>Balance Changes</PageTitle>
        {isAdmin && <p><a href="/modify-balance-changes">Edit Balance Changes</a></p>}
        <Select id="tower" options={[...towerTypeAndHeroToOptions.values()]}
                    styles={selectStyle} placeholder="Tower" isClearable
                    defaultValue={towerTypeAndHeroToOptions.get(tower) ?? undefined}
                    onChange={val => setTower(val?.value ?? undefined)} />
        <br />
        <Select id="version" styles={selectStyle} placeholder="Version"
            isClearable onChange={val => setVersion(val?.value ?? undefined)} options={versionOptions} />
        <br />
        {balanceChangeInfo}
    </>
}
