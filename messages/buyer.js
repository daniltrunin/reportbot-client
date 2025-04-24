const getStartBuyerMsg = (res) => {
    return `<b>Бот для отчётности — Баинг Отдел</b>

Твоя роль - <b>${res.message.join(", ")}</b>`
}

const getSendReportMsg = () => {
    return `Сформируй свой отчёт одним текстовым сообщением и отправь его мне`
}

const getReportMsg = (report) => {
    return `<b>Твой отчёт</b>

<i>${report}</i>`
}

const getAcceptSendReportToServerMsg = () => {
    return `Отчёт успешно отправлен!`
}

const getSavedYourTextNowChooseTagsMsg = () => {
    return `<b>Теперь выбери тег</b>
Твой отчёт закрепится с этим тегом`
}

const getShowYourChosenTagsAndChosenTextMsg = (tags, message) => {
    return `<b>Выбранный тег</b> <i>${tags}</i>
    
<b>Текст отчёта</b>
<i>${message}</i>`
}

module.exports = {
    getStartBuyerMsg,
    getSendReportMsg,
    getReportMsg,
    getAcceptSendReportToServerMsg,
    getSavedYourTextNowChooseTagsMsg,
    getShowYourChosenTagsAndChosenTextMsg
};