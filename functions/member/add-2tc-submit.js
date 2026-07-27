import { handleAddSubmit } from "./handleAddSubmit";
import { getChallenge, verify2TCSettings } from "./challenge-editor-handler";

export async function onRequestPost(context) {
    return handleAddSubmit({
        context, challenge: 'twotc',
        fields: ['tower1', 'tower2', 'map'],
        extraInfoFields: ['tower1', 'tower2', 'upgrade1', 'upgrade2', 'version', 'date'],
        genEmbedFunction: async ({ link, formData, edit, filekey, verify }) => {
            let challengeInfo = null;

            const rawCode = formData.get("challenge_code");
            const code = (rawCode || "").trim();

            if (code && (code.length > 64 || /[\/\\\s]/.test(code))) {
                challengeInfo = {
                    verified: false,
                    errors: ["Invalid challenge code format"]
                };
            } else if (code) {
                try {
                    const challenge = await getChallenge(code);
                    challengeInfo = verify2TCSettings(challenge);
                } catch (e) {
                    challengeInfo = {
                        verified: false,
                        errors: ["Failed to fetch or parse challenge (Ninja Kiwi API down or invalid code)"]
                    };
                }
            }
                    challengeInfo = {
                        verified: false,
                        errors: [`Failed to fetch challenge (Ninja Kiwi API down or invalid code)`]
                    };
                }
            }

            let challengeCheckValue;

            if (!code) {
                challengeCheckValue = "No challenge code provided";
            } else if (!challengeInfo) {
                challengeCheckValue = `${code}\nNo challenge info available`;
            } else {
                const mapLine = challengeInfo.map ? `Map: ${challengeInfo.map}\n` : "";
                const towersLine = Array.isArray(challengeInfo.towers) ? `${challengeInfo.towers.join("\n")}\n` : "";
                const status = challengeInfo.verified
                    ? "✅ Basic Settings Checked. Confirm that towers/map match what is submitted."
                    : `❌ Basic Settings Failed\n${(challengeInfo.errors || []).map(e => `- ${e}`).join("\n")}`;
                challengeCheckValue = `Code: ${code}\n${mapLine}Towers:\n${towersLine}${status}`;
            }

            return {
                "embeds": [{
                    "title": `${formData.get('tower1')} & ${formData.get('tower2')} 2TC on ${formData.get('map')} ${edit ? 'Edited' : 'Submitted'}${verify ? ' and Verified' : ''}`,
                    "color": 16737024,
                    "fields": [
                        {
                            "name": "Person",
                            "value": formData.get('person'),
                            "inline": true
                        },
                        {
                            "name": "Challenge Editor Check:",
                            "value": challengeCheckValue
                        },
                        {
                            "name": "Notes and Attachments",
                            "value": formData.get('notes') !== "" ? `${formData.get('notes')}` : "-# none :(",
                            "inline": true
                        },
                        {
                            "name": link ? "Link" : "",
                            "value": link || ""
                        }
                    ],
                    "url": link ? link : `https://media.btd6index.win/${filekey}`,
                    "image": {"url": link ? null : `https://media.btd6index.win/${filekey}`},
                    "footer": {
                        "text": new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(Date.now())
                    }
                }],
                "username": "Glue Rat",
                "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
                "attachments": []
            };
        }
    });
}
