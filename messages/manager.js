const getStartManagerMsg = (res) => {
    return `<b>Бот для отчётности — Баинг Отдел</b>

Твоя роль - <b>${res.message.join(", ")}</b> (Team Lead)

Кнопка «Весь отчёт» <i>получить отчёт за сегодняшний день по каждому байеру</i>

Кнопка с именем <i>отчёты по конкретной команде</i>`
}

const getReceiveSingleReportMsg = (report) => {
    return `
<b>Дата</b> <i>${report.dateString}</i> 
<b>Buyer</b> <i>@${report.user_id.username || "Неизвестно"}</i>
<b>Команда</b> <i>${report.teams?.join(", ") || "—"}</i>
<b>Тег</b> <i>${report.tags?.join(", ") || "—"}</i>

<b>Отчёт</b>
<i>${report.message}</i>`;
}

const getDataOfManagerMsg = (teamName) => {
    return `<b>Команда</b> <i>${teamName}</i>

Выбери один тег, по которому хочешь отфильтровать отчёты
Или получить список всех отчётов команды за сегодня`
}

const getBuyersListByTeamAndNameMsg = (buyerList, team, tag) => {
    if (buyerList && buyerList.length > 0) {
        return `<b>Список байеров команды</b> <i>${team}</i> по тегу <i>${tag}</i>`
    } else {
        return `Байеров для этой команд ещё не создавали, или нет ни одного отчёта`
    }
}

module.exports = { getStartManagerMsg, getReceiveSingleReportMsg, getDataOfManagerMsg, getBuyersListByTeamAndNameMsg };