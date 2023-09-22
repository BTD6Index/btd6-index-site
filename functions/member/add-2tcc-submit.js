import { handleAddSubmit } from "./handleAddSubmit";
import sanitizeDiscord from "../sanitizeDiscord";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context, challenge: '2tcc',
        fields: ['tower1', 'tower2', 'map'],
        extraInfoFields: ['tower1', 'tower2', 'upgrade1', 'upgrade2', 'version', 'date', 'money'],
        auxFields: ['person1', 'person2'],
        genEmbedFunction: ({ link, formData, edit, filekey, verify }) => ({
            "content": `**${formData.get('tower1')} and ${formData.get('tower2')} 2TCC on ${formData.get('map')} ${
                edit ? 'Edited' : 'Submitted'
            }${verify ? ' and Verified' : ''}**\n`
            + `People: ${sanitizeDiscord(formData.get('person1'))}, ${sanitizeDiscord(formData.get('person2'))}\n`
            + `Link: ${sanitizeDiscord(link || `https://media.btd6index.win/${filekey}`)}\n`
            + `Notes and Attachments: https://btd6index.win/2tcc/notes?${new URLSearchParams({
                    tower1: formData.get('tower1'),
                    tower2: formData.get('tower2'),
                    map: formData.get('map')
                })}`,
            "username": "Glue Rat",
            "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
            "attachments": []
        })
    });
}
