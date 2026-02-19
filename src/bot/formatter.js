module.exports.menuInicial = () => `
👋 Olá! Sou o assistente da *Hiper Popular Drogarias*.

Escolha uma opção:
🔎 Digite o nome para buscar o medicamento

👤 Digite *atendente* para falar com um especialista.
`.trim();

module.exports.opcao_1 = () => `
🔎 Qual produto deseja buscar?
`.trim();

module.exports.opcao_2 = () => `
🔎 Qual medicamento deseja buscar a Bula?
`.trim();

module.exports.opcao_3 = () => `
👤 Encaminhando para um atendente...
`.trim();

module.exports.falhaBuscaProduto = () => `
❌ Produto não encontrado. Tente outro nome ou código.
`.trim();

module.exports.produtos = (produtos) => {
    let msg = '💊 *Resultado da busca:*\n\n';

    produtos.forEach(p => {
        msg += `• *${p.nome}*\n`;
        msg += `🆔 ${p.codigo}\n`;

        if (p.controlado) {
            msg += '⚠️ Medicamento controlado\n';
            msg += '👉 Atendimento presencial\n\n';
        } else {
            msg += `💰 ${Number(p.preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}\n`;

            if (p.precisa_receita)
                msg += '📄 Exige receita\n';

            msg += '\n';
        }
    });

    return msg;
};

module.exports.bula = (bula) => {
    let msg = '💊 *Resultado da busca:*\n\n';

    bula.forEach(b => {
        msg += `• *${b.nome}*\n`;
        msg += ` ${b.bula}\n`;

        if (b.controlado) {
            msg += '⚠️ Medicamento controlado\n';
            msg += '👉 Atendimento presencial\n\n';
        } else {
            // msg += `💰 ${Number(p.preco).toLocaleString('pt-BR', {
            //     style: 'currency',
            //     currency: 'BRL'
            // })}\n`;

            if (b.precisa_receita)
                // msg += '📄 Exige receita\n';
            msg += '\n';
        }
    });

    return msg;
};

