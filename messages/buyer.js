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

const getSavedYourTextNowChooseTagsMsg = () => {
    return `Отлично, я сохранил твой текст. Теперь выбери один или несколько тегов`
}

const getShowYourChosenTagsAndChosenTextMsg = (tags, message) => {
    return `Выбранные теги: ${tags}
    
Сохранённый текст:
${message}

Отправляем?`
}

module.exports = {
    getSendReportMsg,
    getReportMsg,
    getAcceptSendReportToServerMsg,
    getSavedYourTextNowChooseTagsMsg,
    getShowYourChosenTagsAndChosenTextMsg
};