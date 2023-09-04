import CHIMPS_STARTS from './chimps-starts.yml';
import { useSearchParams } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import MapSelect from "../../util/MapSelect";

export default function ChimpsStarts() {
    const [searchParams, setSearchParams] = useSearchParams();

    return <>
        <h1>CHIMPS Starts</h1>
        <p>Select a map in the dropdown below to view useful CHIMPS earlygames. (WIP)</p>
        <MapSelect
            mapValue={searchParams.get('map')}
            onChange={val => setSearchParams({map: val.value})}
        />
        { 
            searchParams.get('map') && <>
                <h2>Starts for {searchParams.get('map')}</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {CHIMPS_STARTS[searchParams.get('map')] ?? `No CHIMPS starts for ${searchParams.get('map')} found`}
                </ReactMarkdown>
            </>
        }
    </>;
}