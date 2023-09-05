import { useMapToOptions } from "./selectOptions";
import selectStyle from "./selectStyle";
import Select from 'react-select';

export default function MapSelect({mapValue, reloadVar, ...rest}) {
    const mapToOptions = useMapToOptions(reloadVar);

    return <Select
        options={[...mapToOptions.values()]}
        value={mapToOptions.get(mapValue) ?? null}
        styles={selectStyle}
        isLoading={mapToOptions.size === 0}
        {...rest}
    />;
}