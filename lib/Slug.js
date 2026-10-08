export default function Slug(text, replacer = '-') {
    return text
        .toString()
        .normalize("NFD") // Separate accented characters
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .toLowerCase()
        .trim()
        .replace(/&/g, " and ") // Optional: "&" -> "and"
        .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
        .replace(/\s+/g, replacer) // Replace spaces with hyphens
        .replace(/-+/g, replacer); // Collapse multiple hyphens
}