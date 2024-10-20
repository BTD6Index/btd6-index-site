import {uniqWith} from 'lodash';

const CHALLENGE_QUERIES = [
    "SELECT DISTINCT person FROM twotc_completions WHERE person LIKE ?1 ESCAPE '\\'",
    "SELECT DISTINCT person FROM twomp_completions WHERE person LIKE ?1 ESCAPE '\\'",
    "SELECT DISTINCT person1 AS person FROM twotcc_completions WHERE person1 LIKE ?1 ESCAPE '\\'",
    "SELECT DISTINCT person2 AS person FROM twotcc_completions WHERE person2 LIKE ?1 ESCAPE '\\'",
    "SELECT DISTINCT person FROM ltc_completions WHERE person LIKE ?1 ESCAPE '\\'",
    "SELECT DISTINCT person FROM lcc_completions WHERE person LIKE ?1 ESCAPE '\\'",
    "SELECT DISTINCT person FROM fttc_completions WHERE person LIKE ?1 ESCAPE '\\'",
    "SELECT DISTINCT person FROM lcd_completions WHERE person LIKE ?1 ESCAPE '\\'"
]

export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;

    let searchParams = new URL(context.request.url).searchParams;

    let offset = Math.min(parseInt(searchParams.get('offset') ?? '0'), 0);
    let count = Math.min(parseInt(searchParams.get('count') ?? '10'), 100);

    let user = searchParams.get('user');
    let userPrefix = searchParams.get('query') ?? '';

    let results = await db.batch(
        CHALLENGE_QUERIES.map(query => db.prepare(query).bind(user ?? (userPrefix.replace(/([%_\\\\])/, '\\$1') + '%')))
    );
    let list = results.flatMap(subResult => subResult.results.map(result => result.person));
    list.sort((a,b) => a.localeCompare(b));
    return Response.json({
        results: uniqWith(list, (a,b) => a.localeCompare(b) === 0).slice(offset, offset + count)
    });
}
