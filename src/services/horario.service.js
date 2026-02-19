const isPlantao = true; // futuramente pode vir do banco

function isFarmaciaAberta(isPlantao) {
  const agora = new Date();
  const dia = agora.getDay(); // 0 = domingo
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const totalMin = hora * 60 + minuto;

  const segASex = dia >= 1 && dia <= 5;
  const sabado = dia === 6;

  // Horários em minutos
  const abre = 7 * 60 + 30;
  const fechaSemana = 19 * 60;
  const fechaSabado = 13 * 60;
  const fechaPlantao = 22 * 60;

  if (isPlantao) {
    return totalMin >= abre && totalMin <= fechaPlantao;
  }

  if (segASex) {
    return totalMin >= abre && totalMin <= fechaSemana;
  }

  if (sabado) {
    return totalMin >= abre && totalMin <= fechaSabado;
  }

  return false; // domingo fechado
}


//
function mensagemPlantao(isPlantao) {
  let msgPlantao;

  if (isPlantao === true) {
    msgPlantao = {
      text: `Olá! 👋  
Posso te ajudar a encontrar medicamentos.  
Exemplo: *"Tem dipirona?"*  

Ou digite *menu* para ver as opções.

⚠️ Atenção: *Estamos de Plantão*
Estaremos prontos para te atender até às *22:00* horas.`,
      nextState: null
    };
  } else {
    msgPlantao = {
      text: `Olá! 👋  
Posso te ajudar a encontrar medicamentos.  
Exemplo: *"Tem dipirona?"*  

Ou digite *menu* para ver as opções.`,
      nextState: null
    };
  }

  return msgPlantao;
}
//

module.exports = { isFarmaciaAberta, mensagemPlantao , isPlantao};
