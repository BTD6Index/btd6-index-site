import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context, challenge: '2tc',
        fields: ['tower1', 'tower2', 'map'],
        extraInfoFields: ['tower1', 'tower2', 'upgrade1', 'upgrade2', 'version', 'date'],
        genEmbedFunction: ({ link, formData, edit, filekey, verify }) => ({
            "content": `**${formData.get('tower1')} and ${formData.get('tower2')} 2TC on ${formData.get('map')} ${
                edit ? 'Edited' : 'Submitted'
            }${verify ? ' and Verified' : ''}**\n`
            + `Person: ${formData.get('person')}\n`
            + `Link: ${link || `https://media.btd6index.win/${filekey}`}\n`
            + `Notes and Attachments: https://btd6index.win/2tc/notes?${new URLSearchParams({
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
