import { handleAddSubmit } from "./handleAddSubmit";
import sanitizeDiscord from "../sanitizeDiscord";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context,
        challenge: 'lto',
        fields: ['odyssey', 'towerset'],
        extraInfoFields: ['odyssey', 'towerset', 'version', 'date'],
        genEmbedFunction: ({link, formData, edit, filekey, verify}) => {
            return {
                "content": `**(${JSON.parse(formData.get('towerset')).join(', ')}) LTO for ${formData.get('odyssey')} ${
                    edit ? 'Edited' : 'Submitted'
                }${verify ? ' and Verified' : ''}**\n`
                + `Person: ${sanitizeDiscord(formData.get('person'))}\n`
                + `Link: ${sanitizeDiscord(link || `https://media.btd6index.win/${filekey}`)}\n`
                + `Notes and Attachments: https://btd6index.win/lto/notes?${new URLSearchParams({
                    towerset: formData.get('towerset'),
                    odyssey: formData.get('odyssey')
                })}`,
                "username": "Glue Rat",
                "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
                "attachments": []
            };
        }
    });
}
