const getStartBuyerMsg = (res) => {
    return `<b>Бот для отчётности — Баинг Отдел</b>

Твоя роль - <b>${res.message.join(", ")}</b>`
}

const getSendReportMsg = () => {
    return `Сформируй свой отчёт одним текстовым сообщением и отправь его мне`
}

const getReportMsg = (report) => {
    return `Твой отчёт:

${report}

Сохранить?`
}

const getAcceptSendReportToServerMsg = () => {
    return `Отчёт успешно отправлен!`
}

const getSavedYourTextNowChooseTagsMsg = () => {
    return `Отлично, я сохранил твой текст. Теперь выбери тег`
}

const getShowYourChosenTagsAndChosenTextMsg = (tags, message) => {
    return `Выбранный тег: ${tags}
    
Сохранённый текст:
${message}

Отправляем?`
}

module.exports = {
    getStartBuyerMsg,
    getSendReportMsg,
    getReportMsg,
    getAcceptSendReportToServerMsg,
    getSavedYourTextNowChooseTagsMsg,
    getShowYourChosenTagsAndChosenTextMsg
};