import { useOdysseyToOptions } from "./selectOptions";
import selectStyle from "./selectStyle";
import Select from 'react-select';

export default function OdysseySelect({odysseyValue, reloadVar, ...rest}) {
    const odysseyToOptions = useOdysseyToOptions(reloadVar);

    return <Select
        options={[...odysseyToOptions.values()]}
        value={odysseyToOptions.get(odysseyValue) ?? null}
        styles={selectStyle}
        isLoading={odysseyToOptions.size === 0}
        {...rest}
    />;
}