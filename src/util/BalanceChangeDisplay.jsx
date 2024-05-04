export default function BalanceChangeDisplay({change, nature, children}) {
    return <li className={`balance-${nature}`}>{change} {children}</li>;
}