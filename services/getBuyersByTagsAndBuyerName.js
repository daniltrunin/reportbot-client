const serverUrl = process.env.SERVER_URL;

async function getBuyersByTagsAndBuyerName(tag, team, buyer) {
    try {
        const response = await fetch(`${serverUrl}/report/getbuyersbytagsandbuyername`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tag: tag,
                team: team,
                buyer: buyer
            })
        })
        return response.json();
    } catch (e) {
        console.error(e);
    }
}

module.exports = { getBuyersByTagsAndBuyerName }