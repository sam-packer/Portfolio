// Adapted from https://equk.co.uk/2023/02/02/generating-slug-from-title-in-astro/

export default function (title: string) {
    const accentsMap = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
        'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
        'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u'
    };
    const slug = (
        title
            // remove leading & trailing whitespace
            .trim()
            // replace accented characters
            .replace(/[\u00C0-\u00FF]/g, function (char) {
                return accentsMap[char] || char;
            })
            // output lowercase
            .toLowerCase()
            // replace spaces
            .replace(/\s+/g, '-')
            // remove special characters
            .replace(/[^\w-]/g, '')
            // remove leading & trailing separators
            .replace(/^-+|-+$/g, '')
    )
    return slug + "/";
}
