import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function TwoTCCExtraInfo() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        fetch('/fetch-2tcc-og-info?' + params)
        .then(async (response) => {
            let json = await response.json();
            if ('error' in json) {
                setError(json.error);
            } else {
                setInfo(json.result);
            }
        });
    }, [params]);
    if (error !== null) {
        return <>
            <h1>Error getting OG 2TCC info</h1>
            <p>{error}</p>
            <p><a href="/2tcc">Back to 2TCCs</a></p>
        </>;
    } if (info === null) {
        return <></>;
    }
    return <>
        <h1>Additional Info for OG 2TCC</h1>
        <h2>{info.tower1} ({info.upgrade1}) and {info.tower2} ({info.upgrade2})</h2>
        <p>Starting cash: {info.money}</p>
        <p>Update: {info.version}</p>
        <p>Date of completion (yyyy-mm-dd): {info.date}</p>
        <p><a href={info.link}>Link to completion</a></p>
        <p><a href="/2tcc">Back to 2TCCs</a></p>
    </>
};