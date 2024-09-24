import { handleAddSubmit } from "./handleAddSubmit";
import sanitizeDiscord from "../sanitizeDiscord";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context, challenge: 'twotcc',
        fields: ['tower1', 'tower2', 'map'],
        extraInfoFields: ['tower1', 'tower2', 'upgrade1', 'upgrade2', 'version', 'date', 'money'],
        auxFields: ['person1', 'person2'],
        genEmbedFunction: ({ link, formData, edit, filekey, verify }) => ({
            "embeds": [{
                "title": `${formData.get('tower1')} & ${formData.get('tower2')} 2TCC on ${formData.get('map')} ${edit ? 'Edited' : 'Submitted'}${verify ? ' and Verified' : ''}`,
                "color": 16737024,
                "fields": [
                    {
                        "name": "Person",
                        "value": `${formData.get('person1')} & ${formData.get('person2')}`,
                        "inline": true
                    },
                    {
                        "name": "Notes and Attachments",
                        "value": formData.get('notes') !== "" ? `${formData.get('notes')}` : "-# none :(",
                        "inline": true
                    },
                    {
                        "name": link ? "Link" : "",
                        "value": link || ""
                    }
                ],
                "url": link ? link : `https://media.btd6index.win/${filekey}`,
                "image": {"url": link ? null : `https://media.btd6index.win/${filekey}`},
                "footer": {
                    "text": new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(Date.now())
                }
            }],
            "username": "Glue Rat",
            "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
            "attachments": []
        })
    });
}
