export function onRequest(context) {
    return new Response(JSON.stringify([
        {
            tower1: "Energizer",
            tower2: "The Anti-Bloon",
            person: "KyrosQF",
            link: "https://youtu.be/dlvYT_VZBOI"
        }
    ])); // TODO update this to be real shit
}