const serverUrl = process.env.SERVER_URL;

async function getAllTags() {
    try {
        const response = await fetch(`${serverUrl}/tags/getalltags`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.json();
    } catch (e) {
        console.error(e)
    }
}

module.exports = { getAllTags }