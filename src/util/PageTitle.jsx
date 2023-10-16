import { Helmet } from "react-helmet-async";
import { onlyText } from "react-children-utilities";

export default function PageTitle({children}) {
    return <>
        <h1>{children}</h1>
        <Helmet>
            <title>{onlyText(children)} | BTD6 Index</title>
            <meta
                name="description"
                content="We are a community of Bloons TD 6 players tracking various community-created challenges."
            />
        </Helmet>
    </>;
}