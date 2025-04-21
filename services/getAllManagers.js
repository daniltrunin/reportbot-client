const serverUrl = process.env.SERVER_URL;

async function getAllManagers() {
    try {
        const response = await fetch(`${serverUrl}/api/getallmanagers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response.json();
    } catch (e) {
        console.error(e);
    }
}

module.exports = { getAllManagers }