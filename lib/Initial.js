const Initial = (name) => {
    if (!name || typeof name === undefined) {
        return null;
    }
    const words = name.trim().split(' ');

    if (words.length === 1) {
        return words[0][0].toUpperCase() + (words[0][1] ? words[0][1].toUpperCase() : '');
    } else {
        return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
    }
}

export default Initial