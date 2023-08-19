import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequest(context) {
    return handleAddSubmit({
        context, challenge: '2mp',
        fields: ['entity', 'map'],
        extraInfoFields: ['entity', 'upgrade', 'version', 'date'],
        genEmbedFunction: ({link, formData, edit, filekey}) => {
            return {
                "content": `**${formData.get('entity')} 2MPC on ${formData.get('map')} ${
                    edit ? 'Edited' : 'Submitted'
                }${formData.has('verify') ? ' and Verified' : ''}**\n`
                + `Person: ${formData.get('person')}\n`
                + `Link: ${link || `https://media.btd6index.win/${filekey}`}\n`
                + `Notes and Attachments: https://btd6index.win/2mp/notes?${new URLSearchParams({
                    entity: formData.get('entity'),
                    map: formData.get('map')
                })}`,
                "username": "Glue Rat",
                "avatar_url": "https://btd6index.win/static/media/GlueGunnerPetRatIcon.949fcb9e188713ce4e4e.png",
                "attachments": []
            };
        }
    });
}
