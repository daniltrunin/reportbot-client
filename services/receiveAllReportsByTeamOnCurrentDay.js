const serverUrl = process.env.SERVER_URL;

async function receiveAllReportsByTeamOnCurrentDay(team) {
    try {
        const response = await fetch(`${serverUrl}/report/receiveallreportsbyteamoncurrentday`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ team })
        });
        return response.json();
    } catch (e) {
        console.error(e);
    }
}

module.exports = { receiveAllReportsByTeamOnCurrentDay }