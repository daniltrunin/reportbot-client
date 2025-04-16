const serverUrl = process.env.SERVER_URL;

async function setReport(data) {
    try {
        const response = await fetch(`${serverUrl}/report/setreport`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return response.json();
    } catch (e) {
        console.error(e)
    }
}

module.exports = { setReport }