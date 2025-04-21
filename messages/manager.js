const getStartManagerMsg = (res) => {
    return `<b>Бот для отчётности — Баинг Отдел</b>

Твоя роль - <b>${res.message.join(", ")}</b> (Team Lead)
Весь отчёт - получить отчёт за сегодняшний день по каждому байеру
Кнопка с именем - отчёты по конкретной команде`
}

const getReceiveSingleReportMsg = (report) => {
    return `
<b>${report.dateString}</b> @${report.user_id.username || "Неизвестно"}
Команда - ${report.teams?.join(", ") || "—"}, теги - ${report.tags?.join(", ") || "—"}

<b>Отчёт:</b>
${report.message}`;
}

module.exports = { getStartManagerMsg, getReceiveSingleReportMsg };