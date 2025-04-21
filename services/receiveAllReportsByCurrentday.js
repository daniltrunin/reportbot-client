const serverUrl = process.env.SERVER_URL;

async function receiveAllReportsByCurrentday() {
    try {
        const response = await fetch(`${serverUrl}/report/receiveallreportsbycurrentday`, {
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

module.exports = { receiveAllReportsByCurrentday }