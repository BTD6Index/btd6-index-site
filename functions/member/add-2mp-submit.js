import { handleAddSubmit } from "./handleAddSubmit";
import sanitizeDiscord from "../sanitizeDiscord";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context, challenge: 'twomp',
        fields: ['entity', 'map'],
        extraInfoFields: ['entity', 'upgrade', 'version', 'date'],
        genEmbedFunction: ({link, formData, edit, filekey, verify}) => {
            return {
                "content": ``,
                "embeds": [
                    {
                    "id": 435480726,
                    "title": `${formData.get('entity')} 2MPC on ${formData.get('map')} ${
                        edit ? 'Edited' : 'Submitted'
                    }${verify ? ' and Verified' : ''}`,
                    "timestamp": Date.now().toISOString(),
                    "color": 16737024,
                    "fields": [
                        {
                        "name": "Person",
                        "value": `${sanitizeDiscord(formData.get('person'))}`,
                        "inline": true
                        },
                        {
                        "name": "Notes and Attachments",
                        "value": formData.has('notes') ? `${sanitizeDiscord(formData.get('notes'))}` : "-# none :(",
                        "inline": true
                        },
                        {
                        "name": link ? "Link" : "",
                        "value": link || ""
                        }
                    ],
                    "url": `${sanitizeDiscord(link || `https://media.btd6index.win/${filekey}`)}`,
                    "image": {
                        "url": link ? null : `https://media.btd6index.win/${filekey}`
                    }
                    }
                ],
                "username": "Glue Rat",
                "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
                "attachments": []
            };
        }
    });
}
