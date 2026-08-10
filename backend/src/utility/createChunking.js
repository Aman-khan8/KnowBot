const createChunking = (text, chunkSize = 500, overlapSize = 50) => {
    const words = text.split(/\s+/);
    const chunks = [];
       
    let start = 0;

    while (start < words.length) {
        let end = Math.min(start + chunkSize, words.length);

        while (
            end < words.length &&
            !/[.!?]$/.test(words[end - 1])
        ) {
            end++;
        }

        const chunk = words.slice(start, end).join(" ").trim();

        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        // IMPORTANT: We have reached the end
        if (end >= words.length) {
            break;
        }

        start = end - overlapSize;
    }

    return chunks;
};

export default createChunking;