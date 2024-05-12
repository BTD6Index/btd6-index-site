export async function onRequest(context) {
    try {
        const db = context.env.BTD6_INDEX_DB;
        
        let searchParams = new URL(context.request.url).searchParams;

        let queryBuilder = ['TRUE'];
        let params = [];

        if (searchParams.has('tower')) {
            queryBuilder.push(`tower = ?${params.length + 1}`);
            params.push(searchParams.get('tower'));
        }

        if (searchParams.has('version')) {
            if (searchParams.has('version_end')) {
                // TODO refine this
                queryBuilder.push(`CAST(version AS FLOAT) BETWEEN ?${params.length + 1} AND ?${params.length + 2}`);
                params.push(parseFloat(searchParams.get('version')), parseFloat(searchParams.get('version_end')));
            } else {
                queryBuilder.push(`version = ?${params.length + 1}`);
                params.push(searchParams.get('version'));
            }
        }

        let res = await db.prepare(`SELECT * FROM balance_changes WHERE ${queryBuilder.join(' AND ')}`)
        .bind(...params)
        .all();

        return Response.json({results: res.results});
    } catch (ex) {
        return Response.json({error: ex.message});
    }
}