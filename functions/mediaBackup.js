/**
 * Copies an object from the main media bucket to the backup bucket (if it exists).
 * Backups are stored under `<key>/<ISO timestamp>` so repeated backups of the same key are all kept;
 * the backup bucket's lifecycle rule cleans them up after 30 days.
 * @param {*} env
 * @param {string} key
 */
async function backupObject(env, key) {
    const obj = await env.BTD6_INDEX_MEDIA.get(key);
    if (obj === null) {
        return;
    }
    await env.BTD6_INDEX_MEDIA_BACKUP.put(`${key}/${new Date().toISOString()}`, obj.body, {
        httpMetadata: obj.httpMetadata,
        customMetadata: { ...obj.customMetadata, originalKey: key },
    });
}

/**
 * Returns true if the object at `key` in the main media bucket has exactly the same contents as `file`.
 * Uses the R2 etag, which is the hex MD5 of the contents for single-part uploads.
 * @param {*} env
 * @param {string} key
 * @param {File} file
 */
async function isSameContent(env, key, file) {
    const existing = await env.BTD6_INDEX_MEDIA.head(key);
    if (existing === null || existing.size !== file.size || existing.etag.includes('-')) {
        return false;
    }
    const digest = await crypto.subtle.digest('MD5', await file.arrayBuffer());
    const hex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
    return hex === existing.etag.toLowerCase();
}

/**
 * Prepares to replace the object at `key` with `file`: backs up the existing object unless it is identical.
 * @param {*} env
 * @param {string} key
 * @param {File} file
 * @returns {Promise<boolean>} false if the existing object is identical (skip the upload), true otherwise
 */
async function backupForReplace(env, key, file) {
    if (await isSameContent(env, key, file)) {
        return false;
    }
    await backupObject(env, key);
    return true;
}

/**
 * Backs up the given object(s), then deletes them from the main media bucket.
 * Deletion only happens if every backup succeeded.
 * @param {*} env
 * @param {string | string[]} keys
 */
async function backupAndDelete(env, keys) {
    const keyList = Array.isArray(keys) ? keys : [keys];
    if (keyList.length === 0) {
        return;
    }
    await Promise.all(keyList.map(key => backupObject(env, key)));
    await env.BTD6_INDEX_MEDIA.delete(keyList);
}

/**
 * Backs up and deletes every object in the main media bucket whose key starts with `prefix`.
 * @param {*} env
 * @param {string} prefix
 */
async function backupAndDeletePrefix(env, prefix) {
    let cursor = undefined;
    do {
        const listRes = await env.BTD6_INDEX_MEDIA.list({ prefix, cursor });
        await backupAndDelete(env, listRes.objects.map(obj => obj.key));
        cursor = listRes.truncated ? listRes.cursor : undefined;
    } while (cursor);
}

export { backupObject, backupForReplace, backupAndDelete, backupAndDeletePrefix };
