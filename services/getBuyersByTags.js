const serverUrl = process.env.SERVER_URL;

async function getBuyersByTags(tag, team) {
    try {
        const response = await fetch(`${serverUrl}/api/getbuyersbytags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tag: tag,
                team: team
            })
        })
        return response.json()
    } catch (e) {
        console.error(e)
    }
}

module.exports = { getBuyersByTags }