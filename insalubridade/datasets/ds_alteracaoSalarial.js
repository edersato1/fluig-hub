function createDataset(fields, constraints, sortFields) {
    var dsAlteraSalario = DatasetBuilder.newDataset();

    var chapa = constraints[0].initialValue;
    var obra = constraints[1].initialValue;
    var coligada = constraints[2].initialValue;

    var selectQuery = PfuncQuery(chapa, obra, coligada);

    var dataSource = "/jdbc/RM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var conn = null;
    var stmt = null;
    var rs = null;

    try {
        conn = ds.getConnection();
        stmt = conn.createStatement();
        rs = stmt.executeQuery(selectQuery);
        var columnCount = rs.getMetaData().getColumnCount();

        if (columnCount > 0) {
            for (var i = 1; i <= columnCount; i++) {
                dsAlteraSalario.addColumn(rs.getMetaData().getColumnName(i));
            }

            while (rs.next()) {
                var arr = new Array();
                for (var i = 1; i <= columnCount; i++) {
                    var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                    if (null != obj) {
                        arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                    } else {
                        arr[i - 1] = "null";
                    }
                }
                dsAlteraSalario.addRow(arr);
            }
        }
    } catch (error) {
        log.error(error.message);
    } finally {
        if (rs != null) {
            rs.close();
        }
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }

    return dsAlteraSalario;
}

function PfuncQuery(chapa, obra, coligada) {
    var query = "SELECT PFUNC.CHAPA as chapa, " +
    "PFUNC.NOME as nomeFunc, " +
    "PFUNC.CODSITUACAO as codsituacao, " +
    "PFUNC.CODSECAO as funcao, " +
    "PFUNC.SALARIO as salario, " +
    "PFUNC.CODPESSOA as idFunc, " +
    "PFUNC.DATAADMISSAO as dataAdmissao, " +
    "PFUNCAO.NOME as cargo, " +
    "PFUNCAO.CODIGO as codCargo, " +
    "PFUNCAO.DESCRICAOPPP as descricaoCargo, " +
    "PSECAO.CODIGO as codSetor, " +
    "PSECAO.DESCRICAO as nomeSetor, " +
    "PSECAO.NROCENCUSTOCONT as obra " +
    "FROM PFUNC " +
    "INNER JOIN PSECAO ON PFUNC.CODCOLIGADA = PSECAO.CODCOLIGADA AND PFUNC.CODSECAO = PSECAO.CODIGO " +
    "INNER JOIN PFUNCAO ON PFUNC.CODCOLIGADA = PFUNCAO.CODCOLIGADA AND PFUNC.CODFUNCAO = PFUNCAO.CODIGO " +
    "WHERE PFUNC.CODSITUACAO <> 'D' AND PFUNC.CODCOLIGADA = '"+ coligada+"' AND PFUNC.CHAPA = '"+ chapa + "' AND PSECAO.NROCENCUSTOCONT = '"+ obra + "'";

    return query;
}