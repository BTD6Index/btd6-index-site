import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageTitle from "../../../util/PageTitle";

export default function LTOExtraInfo() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        fetch('/fetch-lto-og-info?' + params)
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
            <PageTitle>Error getting OG LTO info</PageTitle>
            <p>{error}</p>
            <p><a href="/fttc">Back to LTOs</a></p>
        </>;
    } if (info === null) {
        return <></>;
    }
    return <>
        <PageTitle>Additional Info for OG LTO</PageTitle>
        <p>Update: {info.version}</p>
        <p>Date of completion (yyyy-mm-dd): {info.date}</p>
        <p><a href={info.link ?? `https://media.btd6index.win/${info.filekey}`}>Link to completion</a></p>
        <p><a href="/lto">Back to LTOs</a></p>
    </>
};