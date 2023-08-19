import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequest(context) {
    return handleAddSubmit({
        context, challenge: '2tc',
        fields: ['tower1', 'tower2', 'map'],
        extraInfoFields: ['tower1', 'tower2', 'upgrade1', 'upgrade2', 'version', 'date'],
        genEmbedFunction: ({ link, formData, edit, filekey }) => ({
            "content": `**${formData.get('tower1')} and ${formData.get('tower2')} 2TC on ${formData.get('map')} ${
                edit ? 'Edited' : 'Submitted'
            }${formData.has('verify') ? ' and Verified' : ''}**\n`
            + `Person: ${formData.get('person')}\n`
            + `Link: ${link || `https://media.btd6index.win/${filekey}`}\n`
            + `Notes and Attachments: https://btd6index.win/2tc/notes?${new URLSearchParams({
                    tower1: formData.get('tower1'),
                    tower2: formData.get('tower2'),
                    map: formData.get('map')
                })}`,
            "username": "Glue Rat",
            "avatar_url": "https://btd6index.win/static/media/GlueGunnerPetRatIcon.949fcb9e188713ce4e4e.png",
            "attachments": []
        })
    });
}
