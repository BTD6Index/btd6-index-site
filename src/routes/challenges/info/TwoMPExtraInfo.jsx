import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function TwoMPExtraInfo() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        fetch('/fetch-2mp-og-info?' + params)
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
            <h1>Error getting OG 2MP info</h1>
            <p>{error}</p>
            <p><a href="/2mp">Back to 2MPs</a></p>
        </>;
    } if (info === null) {
        return <></>;
    }
    return <>
        <h1>Additional Info for OG 2MP</h1>
        <h2>Tower: {info.entity} ({info.upgrade})</h2>
        <p>Update: {info.version}</p>
        <p>Date of completion (yyyy-mm-dd): {info.date}</p>
        <p><a href={info.link ?? `https://media.btd6index.win/${info.filekey}`}>Link to completion</a></p>
        <p><a href="/2mp">Back to 2MPs</a></p>
    </>
};