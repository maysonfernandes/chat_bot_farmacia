const db = require('../db/mysql');

async function buscarProduto(termo) {
    const [rows] = await db.query(
        `SELECT * FROM ta_preco_medicamento
         WHERE MATCH(PRODUTO, SUBSTÂNCIA, LABORATÓRIO)
         AGAINST (? IN NATURAL LANGUAGE MODE)
         AND RESTRIÇÃO HOSPITALAR = Não
         LIMIT 5`,
        [termo]
    );
    return rows;
}

async function buscarPorCodigo(codigo) {
    const [rows] = await db.query(
        'SELECT * FROM produtos WHERE codigo = ? AND ativo = true',
        [codigo]
    );
    return rows;
}

async function buscarBula(termo) {
    const [rows] = await db.query(
        `SELECT * FROM produtos
         WHERE MATCH(nome, principio_ativo, categoria)
         AGAINST (? IN NATURAL LANGUAGE MODE)
         AND ativo = true
         LIMIT 1`,
        [termo]
    );
    return rows;
}

module.exports = { buscarProduto, buscarPorCodigo, buscarBula };
