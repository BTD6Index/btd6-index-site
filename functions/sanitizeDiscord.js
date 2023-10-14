// adapted from https://github.com/Swiiz/discord-escape

export default function sanitizeDiscord(str) {
    return str; // TODO remove this if we ever enable submissions from non-helpers again
    return str
    .replace(/(_|\*|~|`|\||\\|<|>|!|(?<=^|\n|\r)#+\s|(?<=(?:^|\n|\r)\s*)-\s)/g, "\\$1")
    .replace(/((?<=(?:^|\n|\r)\s*)\d+)\.(\s)/g, "$1\\.$2")
    .replace(/@(everyone|here|[!&]?[0-9]{17,21})/g, "@\u200b$1");
}