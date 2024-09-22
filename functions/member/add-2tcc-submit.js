import { handleAddSubmit } from "./handleAddSubmit";
import sanitizeDiscord from "../sanitizeDiscord";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context, challenge: 'twotcc',
        fields: ['tower1', 'tower2', 'map'],
        extraInfoFields: ['tower1', 'tower2', 'upgrade1', 'upgrade2', 'version', 'date', 'money'],
        auxFields: ['person1', 'person2'],
        genEmbedFunction: ({ link, formData, edit, filekey, verify }) => ({
            "content": ``,
            "embeds": [
                {
                "title": `${formData.get('tower1')} & ${formData.get('tower2')} 2TCC on ${formData.get('map')} ${
                    edit ? 'Edited' : 'Submitted'
                }${verify ? ' and Verified' : ''}`,
                "timestamp": Date.now().toISOString(),
                "color": 16737024,
                "fields": [
                    {
                    "name": "People",
                    "value": `${sanitizeDiscord(formData.get('person1'))} & ${sanitizeDiscord(formData.get('person2'))}`,
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
                    "url": link ? null : `https://media.btd6index.win/${filekey}`                    }
                }
                ],
            "username": "Glue Rat",
            "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
            "attachments": []
        })
    });
}
