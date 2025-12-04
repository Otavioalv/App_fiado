import { MessageMap } from "../../shared/interfaces/notifierInterfaces";


export const Messages:MessageMap = {
    novaSolicitacaoParceria: (data) => (
        `Você recebeu uma nova solicitação de parceria de ${data.nome}${data.apelido ? ` conhecido(a) por ${data.apelido}.` : "."}`
    ),
    parceriaAceita: (data) => (
        `Sua solicitação de parceria com: ${data.nome}, FOI ACEITA`
    ),
    novaSolicitacaoCompra: (data) => (
        `Seu parceiro ${data.nome}${data.apelido ? ` conhecido por ${data.apelido},` : ","} está solicitando os seguintes itens:\n${data.compra.map(c => `${c.nome_produto}: ${c.quantidade}`).join("\n")}`
    ),
    aceitarCompra: (data) => (
        `Retirada de produto(s) de ${data.nome}${data.apelido ? ` conhecido por ${data.apelido},` : ","} aprovado. Verifique sua lista.`
    ),
    recusarCompra: (data) => (
        `Retirada de produto(s) de ${data.nome}${data.apelido ? ` conhecido por ${data.apelido},` : ","} recudado. Verifique sua lista.`
    ),
    atualizarCompra: (data) => (
        `Status de compra(s) de ${data.nome}${data.apelido ? ` conhecido por ${data.apelido},` : ","} atualizado. Verifique sua lista.`
    )
}
