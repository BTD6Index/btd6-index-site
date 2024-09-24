import { handleAddSubmit } from "./handleAddSubmit";
import sanitizeDiscord from "../sanitizeDiscord";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context,
        challenge: 'fttc',
        fields: ['map', 'towerset'],
        extraInfoFields: ['map', 'towerset', 'version', 'date'],
        genEmbedFunction: ({link, formData, edit, filekey, verify}) => {
            return {
                "embeds": [{
                    "title": `${JSON.parse(formData.get('towerset')).length}TTC on ${formData.get('map')} ${edit ? 'Edited' : 'Submitted'}${verify ? ' and Verified' : ''}`,
                    "color": 16737024,
                    "fields": [
                        {
                            "name": "Person",
                            "value": formData.get('person'),
                            "inline": true
                        },
                        {
                            "name": "Tower Types",
                            "value": `${JSON.parse(formData.get('towerset')).join('\n')}`,
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
            };
        }
    });
}
