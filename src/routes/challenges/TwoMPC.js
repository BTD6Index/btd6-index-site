import ChallengePage from "./ChallengePage";

export default function TwoMPC() {
    return <ChallengePage
    challenge="2mp"
    header="2 Million Pops CHIMPS"
    description="In this challenge, win CHIMPS with a given tower so that pops on other towers are less than 42,693 (the total pops in a CHIMPS game, excluding regrows, minus 2 million)."
    fieldHeaders={['Entity']}
    fields={['entity']}
    />
};