import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FTTCExtraInfo() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        fetch('/fetch-fttc-og-info?' + params)
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
            <h1>Error getting OG FTTC info</h1>
            <p>{error}</p>
            <p><a href="/fttc">Back to FTTCs</a></p>
        </>;
    } if (info === null) {
        return <></>;
    }
    return <>
        <h1>Additional Info for OG FTTC</h1>
        <p>Update: {info.version}</p>
        <p>Date of completion (yyyy-mm-dd): {info.date}</p>
        <p><a href={info.link ?? `https://media.btd6index.win/${info.filekey}`}>Link to completion</a></p>
        <p><a href="/fttc">Back to FTTCs</a></p>
    </>
};