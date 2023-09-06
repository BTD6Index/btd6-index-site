import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context, challenge: '2mp',
        fields: ['entity', 'map'],
        extraInfoFields: ['entity', 'upgrade', 'version', 'date'],
        genEmbedFunction: ({link, formData, edit, filekey, verify}) => {
            return {
                "content": `**${formData.get('entity')} 2MPC on ${formData.get('map')} ${
                    edit ? 'Edited' : 'Submitted'
                }${verify ? ' and Verified' : ''}**\n`
                + `Person: ${formData.get('person')}\n`
                + `Link: ${link || `https://media.btd6index.win/${filekey}`}\n`
                + `Notes and Attachments: https://btd6index.win/2mp/notes?${new URLSearchParams({
                    entity: formData.get('entity'),
                    map: formData.get('map')
                })}`,
                "username": "Glue Rat",
                "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
                "attachments": []
            };
        }
    });
}
