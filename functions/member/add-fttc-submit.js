import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequest(context) {
    return handleAddSubmit({
        context,
        challenge: 'fttc',
        fields: ['map', 'towerset'],
        extraInfoFields: ['map', 'version', 'date'],
        genEmbedFunction: ({link, formData, edit, filekey, verify}) => {
            return {
                "content": `**(${JSON.parse(formData.get('towerset')).join(', ')}) FTTC on ${formData.get('map')} ${
                    edit ? 'Edited' : 'Submitted'
                }${verify ? ' and Verified' : ''}**\n`
                + `Person: ${formData.get('person')}\n`
                + `Link: ${link || `https://media.btd6index.win/${filekey}`}\n`
                + `Notes and Attachments: https://btd6index.win/fttc/notes?${new URLSearchParams({
                    towerset: formData.get('towerset'),
                    map: formData.get('map')
                })}`,
                "username": "Glue Rat",
                "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
                "attachments": []
            };
        }
    });
}
