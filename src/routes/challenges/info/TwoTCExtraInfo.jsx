import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageTitle from "../../../util/PageTitle";

export default function TwoTCExtraInfo() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        fetch('/fetch-2tc-og-info?' + params)
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
            <PageTitle>Error getting OG 2TC info</PageTitle>
            <p>{error}</p>
            <p><a href="/2tc">Back to 2TCs</a></p>
        </>;
    } if (info === null) {
        return <></>;
    }
    return <>
        <PageTitle>Additional Info for OG 2TC</PageTitle>
        <h2>{info.tower1} ({info.upgrade1}) and {info.tower2} ({info.upgrade2})</h2>
        <p>Update: {info.version}</p>
        <p>Date of completion (yyyy-mm-dd): {info.date}</p>
        <p><a href={info.link ?? `https://media.btd6index.win/${info.filekey}`}>Link to completion</a></p>
        <p><a href="/2tc">Back to 2TCs</a></p>
    </>
};