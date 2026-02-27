// Menu Inicial
module.exports.menuInicial = () => `
👋 Olá! Sou o assistente da *Hiper Popular Drogarias*.

Escolha uma opção:
🔎 Digite o nome para buscar o medicamento

👤 Digite *atendente* para falar com um especialista.
`.trim();

// Falar com atendente
module.exports.txtfalarAtendente = () => `
👨‍⚕️ Vou te encaminhar para um atendente. Um momento...
`.trim();

// Mensagem de boas-vindas (plantão)
module.exports.txtPlantao = () => `
Olá! 👋  
Posso te ajudar a encontrar medicamentos.  
Exemplo: *"Tem dipirona?"*  

Ou digite *menu* para ver as opções.

⚠️ Atenção: *Estamos de Plantão*
Estaremos prontos para te atender até às *22:00* horas.
`.trim();

// Mensagem de boas-vindas (horário normal)
module.exports.txtNormal = () => `
Olá! 👋  
Posso te ajudar a encontrar medicamentos.  
Exemplo: *"Tem dipirona?"*  

Ou digite *menu* para ver as opções.
`.trim();

// Perguntando para o usuário qual medicamento ele procura
module.exports.qualMedicamento = () => `
🔎 Qual medicamento você procura?
`.trim();

// Mensagem de erro do fluxo principal
module.exports.erroFluxoPrincipal = () => `
⚠️ Ocorreu um erro ao processar sua solicitação. Tente novamente.
`.trim();

// Horário de funcionamento
module.exports.farmaciaFechada = () => `
⏰ A farmácia está fechada no momento.
🕢 Horário:
Seg-Sex: 07:30 - 19:00
Sábado: 07:30 - 13:00
Plantão: 07:30 - 22:00
`.trim();

// Mensagem de medicamentos retornados do banco de dados
module.exports.produtos = (produtos) => {
    let msg = '💊 *Resultado da busca:*\n\n';

    produtos.forEach(p => {
        msg += `• *${p.PRODUTO}*\n`;
        msg += `◻ ${p.APRESENTACAO}\n`;
        msg += `🆔 ${p.EAN_1}\n`;

        if (p.RESTRICAO_HOSPITALAR === 'Sim') {
            msg += '⚠️ Medicamento controlado\n';
            msg += '👉 Atendimento presencial\n\n';
        } else {
            const valor = Number(p.PMC_Sem_Impostos.replace(',', '.'));
            msg += `💰 ${valor.toLocaleString('pt-BR', { 
            style: 'currency',
            currency: 'BRL'
            })}\n`;

            if (p.TARJA === 'Tarja Preta')
                msg += '📄 Exige receita\n';

            msg += '\n';
        }
    });

    return msg;
};


