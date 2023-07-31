export function onRequest(context) {
    let query_result = context.env.BTD6_INDEX_DB
    .prepare("SELECT tower1,tower2,person,link FROM '2tccompletions' WHERE person=?")
    .bind('KaptainKO').all();
    return Response.json(query_result.results); // TODO update this to be real shit
}