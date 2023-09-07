import { Helmet } from "react-helmet-async";
import { onlyText } from "react-children-utilities";

export default function PageTitle({children}) {
    return <>
        <h1>{children}</h1>
        <Helmet>
            <title>{onlyText(children)} | BTD6 Index</title>
        </Helmet>
    </>;
}