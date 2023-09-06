import { Helmet } from "react-helmet-async";

export default function PageTitle({children}) {
    return <>
        <h1>{children}</h1>
        <Helmet>
            <title>{children} | BTD6 Index</title>
        </Helmet>
    </>;
}