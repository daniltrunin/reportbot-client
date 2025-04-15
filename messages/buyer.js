const getSendReportMsg = () => {
    return `Сформируй свой отчёт одним текстовым сообщением и отправь его мне.`
}

const getReportMsg = (report) => {
    return `Твой отчёт:

${report}

Сохранить?`
}

const getAcceptSendReportToServerMsg = () => {
    return `Отчёт успешно отправлен!`
}

module.exports = { getSendReportMsg, getReportMsg, getAcceptSendReportToServerMsg };