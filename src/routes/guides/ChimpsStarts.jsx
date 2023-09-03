import Select from "react-select";
import { mapToOptions } from "../../util/selectOptions";
import CHIMPS_STARTS from './chimps-starts.yml';
import { useSearchParams } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import selectStyle from "../../util/selectStyle";

export default function ChimpsStarts() {
    const [searchParams, setSearchParams] = useSearchParams();

    console.log(CHIMPS_STARTS[searchParams.get('map')] ?? `No CHIMPS starts for ${searchParams.get('map')} found`);

    return <>
        <h1>CHIMPS Starts</h1>
        <p>Select a map in the dropdown below to view useful CHIMPS earlygames. (WIP)</p>
        <Select
            options={[...mapToOptions.values()]}
            value={mapToOptions.get(searchParams.get('map')) ?? null}
            onChange={val => setSearchParams({map: val.value})}
            styles={selectStyle}
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