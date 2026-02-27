const productService = require('../services/product.service');
const formatter = require('./formatter');
const { state } = require('../services/cache.service');
const normalizarMedicamento = require('../utils/normalize')
const {isFarmaciaAberta, mensagemPlantao, isPlantao } = require('../services/horario.service');

/**
 * Orquestrador principal de fluxos
 */
async function handle(context, intentFromMenu = null) {
  const { nlp, lastState, body } = context;

  try {
    /**
     * 🧍‍♂️ 0️⃣ Se estiver em modo HUMANO, o bot fica pausado
     */
    if (lastState === 'AGUARDANDO_ATENDENTE') {
      // Só volta se o usuário pedir menu explicitamente
      if (nlp?.intent === 'MENU_INICIAL' || /menu|voltar|início|inicio/i.test(body)) {
        return {
          text: formatter.menuInicial(),
          nextState: null
        };
      }

      return
        
    }

    /**
     * 1️⃣ Prioridade: intenção via NLP
     */
    if (nlp?.intent === 'BUSCAR_PRODUTO') {
      return await fluxoBuscaProduto(nlp);
    }

    if (nlp?.intent === 'FALAR_ATENDENTE') {
      return {
        text: formatter.txtFalarAtendente(),
        nextState: 'HUMANO'
      };
    }

    if (nlp?.intent === 'MENU_INICIAL') {
      return {
        text: formatter.menuInicial(),
        nextState: null
      };
    }

    /**
     * 2️⃣ Fallback: estado do usuário
     * Se o usuário já estava em BUSCA_PRODUTO, tratamos qualquer texto como nome do medicamento
     */
    if (lastState === 'BUSCA_PRODUTO') {
      return await fluxoBuscaProduto({
        medicine: body,
        intent: 'BUSCAR_PRODUTO'
      });
    }

    /**
     * 3️⃣ Fallback: menu tradicional (opções 1️⃣ 2️⃣ 3️⃣ 4️⃣)
     */
    if (intentFromMenu === 'BUSCAR_PRODUTO') {
      return {
        text: formatter.qualMedicamento(),
        nextState: 'BUSCA_PRODUTO'
      };
    }

    /**
     * 4️⃣ Mensagem padrão (boas-vindas)
     */
    return mensagemPlantao(isPlantao)


  } catch (err) {
    console.error('🔥 Erro no flows:', err);

    return {
      text: formatter.erroFluxoPrincipal(),
      nextState: null
    };
  }
}

/**
 * 🔎 Fluxo de busca de produto (produção)
 */
async function fluxoBuscaProduto(nlp) {
  const medicine = normalizarMedicamento(nlp.medicine);

  if (!medicine) {
    return {
      text: formatter.qualMedicamento(),
      nextState: 'BUSCA_PRODUTO'
    };
  }

  const produtos = await productService.buscarProduto(medicine);
  console.log('retorno API:', nlp, 'tipo:', typeof nlp);

  if (!produtos || produtos.length === 0) {
    return {
      text: `❌ Não encontrei *${medicine}*.\nQuer tentar outro medicamento?`,
      nextState: 'BUSCA_PRODUTO'
    };
  }

  return {
    text: formatter.produtos(produtos),
    nextState: 'BUSCA_PRODUTO'
  };
}

module.exports = { handle };
