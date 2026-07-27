export async function onRequest(context) {
    let searchParams = new URL(context.request.url).searchParams;
    let tower1 = searchParams.get('tower1');
    let tower2 = searchParams.get('tower2');
    let map = searchParams.get('map');
    if (tower1 === null || tower2 === null || map == null) {
        return Response.json({error: `need entity and map specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "twotc_completion_notes" WHERE tower1 = ?1 AND tower2 = ?2 AND map = ?3')
    .bind(tower1, tower2, map)
    .first();
    if (res === null) {
        // still try to fetch challenge_code if present in separate table
        let codeRes = await context.env.BTD6_INDEX_DB
            .prepare('SELECT challenge_code FROM "twotc_challenge_codes" WHERE tower1 = ?1 AND tower2 = ?2 AND map = ?3')
            .bind(tower1, tower2, map)
            .first();
        return Response.json({notes: '', challengeCode: codeRes ? codeRes['challenge_code'] : null});
    }
    // also fetch challenge code from the separate table if present
    let codeRes = await context.env.BTD6_INDEX_DB
        .prepare('SELECT challenge_code FROM "twotc_challenge_codes" WHERE tower1 = ?1 AND tower2 = ?2 AND map = ?3')
        .bind(tower1, tower2, map)
        .first();
    return Response.json({notes: res['notes'], challengeCode: codeRes ? codeRes['challenge_code'] : null});
}
