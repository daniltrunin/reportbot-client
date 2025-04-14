const getSendReportMsg = () => {
    return `Сформируй свой отчёт одним текстовым сообщением и отправь его мне.`
}

const getReportMsg = (report) => {
    return `Твой отчёт:

${report}`
}

module.exports = { getSendReportMsg, getReportMsg };