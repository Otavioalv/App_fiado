import { MessageMap } from "../../shared/interfaces/notifierInterfaces";


export const Messages:MessageMap = {
    novaSolicitacaoParceria: (data) => (
        `Você recebeu uma nova solicitação de parceria de ${data.nome}${data.apelido ? ` conhecido por ${data.apelido}.` : "."}`
    ),
    parceriaAceita: (data) => (
        `Sua solicitação de parceria com: ${data.nome}, FOI ACEITA`
    ),
    novaSolicitacaoCompra: (data) => (
        `Seu parceiro ${data.nome}${data.apelido ? ` conhecido por ${data.apelido},` : ","} está solicitando os seguintes itens:\n${data.compra.map(c => `${c.nome_produto}: ${c.quantidade}`).join("\n")}`
    )
}
