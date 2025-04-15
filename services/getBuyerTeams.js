const serverUrl = process.env.SERVER_URL;

async function getBuyerTeams(userId) {
    const userIdObj = {
        user_id: userId
    }
    try {
        const response = await fetch(`${serverUrl}/api/getbuyerteams`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userIdObj)
        });

        return response.json();
    } catch (e) {
        console.error(e);
    }
}

module.exports = { getBuyerTeams }