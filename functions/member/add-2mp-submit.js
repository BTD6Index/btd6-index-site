import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequest(context) {
    return handleAddSubmit({
        context, challenge: '2mp',
        fields: ['entity', 'map'],
        extraInfoFields: ['entity', 'upgrade', 'version', 'date'],
        genEmbedFunction: ({link, formData, edit, filekey}) => ({
            "content": `${link || `https://media.btd6index.win/${filekey}`}`,
            "embeds": [
                {
                    "title": `${formData.get('entity')} 2MPC on ${formData.get('map')} ${
                        edit ? 'Edited' : 'Submitted'
                    }${formData.has('verify') ? ' and Verified' : ''}`,
                    "description": `Person: ${formData.get('person')}\nView 2MPs: https://btd6index.win/2mp`,
                    "color": 0x2d00c1,
                    "url": link || `https://media.btd6index.win/${filekey}`
                }
            ],
            "username": "Glue Rat",
            "avatar_url": "https://btd6index.win/static/media/GlueGunnerPetRatIcon.949fcb9e188713ce4e4e.png",
            "attachments": []
        })
    });
}
