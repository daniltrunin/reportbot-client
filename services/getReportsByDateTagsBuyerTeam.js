const serverUrl = process.env.SERVER_URL;

async function getReportsByDateTagsBuyerTeam(date, tag, buyer, team) {
    try {
        const response = await fetch(`${serverUrl}/report/getreportsbydatetagsbuyerteam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: date,
                tag: tag,
                buyer: buyer,
                team: team
            })
        })
        return response.json();
    } catch (e) {
        console.error(e)
    }
}

module.exports = { getReportsByDateTagsBuyerTeam }