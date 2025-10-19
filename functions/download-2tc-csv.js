import { handleDownloadCSV } from "./handleFetch";

export async function onRequest(context) {
    const { success } = await context.env.DATA_DUMP_DOWNLOAD_RL.limit({ key: "download-2tc-csv" });
    if (!success) {
        return new Response({"error": "rate limit exceeded"}, {status: 429})
    }
    const csv = await handleDownloadCSV({
        context,
        primaryFieldKeys: ['tower1', 'tower2'],
        altFieldKeys: ['map'],
        challenge: 'twotc'
    })
    return new Response(csv);
}