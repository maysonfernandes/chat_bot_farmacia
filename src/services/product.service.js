const db = require('../db/mysql');


// Busca de produtos usando FULLTEXT
async function buscarProduto(termo) {
  const sql = `
    SELECT *
    FROM TA_PRECO_MEDICAMENTO
    WHERE MATCH(\`PRODUTO\`, \`SUBSTANCIA\`, \`LABORATORIO\`)
    AGAINST (? IN NATURAL LANGUAGE MODE)
    AND \`RESTRICAO_HOSPITALAR\` = 'Não'
    LIMIT 5
  `;
  console.log("Termo buscado:", termo);
  const [rows] = await db.query(sql, [termo]);
  console.log("Rows encontrados:", rows);
  return rows;
}

module.exports = { buscarProduto };
