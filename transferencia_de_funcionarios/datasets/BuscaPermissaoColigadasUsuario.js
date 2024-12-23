function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	var usuario = null,  
    permissaoGeral = false,
    myQuery = null;

    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "usuario") {
                usuario = constraints[i].initialValue;
            }
            else if(constraints[i].fieldName == "permissaoGeral"){
                permissaoGeral = constraints[i].initialValue;
            }
        }
    }

    if (permissaoGeral == "true") {
        myQuery =
        "SELECT DISTINCT\
            TFCOLIGADA.CODCOLIGADA,\
            TFCOLIGADA.NOMEFANTASIA,\
            GCCUSTO.CODCCUSTO,\
            ZR.PERFIL perfil\
        FROM ZRPERFILUSUARIO ZR\
            INNER JOIN TFCOLIGADA ON\
                TFCOLIGADA.CODCOLIGADA = ZR.CODCOLIGADA\
            INNER JOIN TLOC ON\
                ZR.PERFIL = TLOC.NOME\
                AND ZR.CODCOLIGADA = TLOC.CODCOLIGADA\
            INNER JOIN GCCUSTO ON\
                TLOC.CODCOLIGADA = GCCUSTO.CODCOLIGADA\
                AND (CASE\
                    WHEN TLOC.CODCOLIGADA = 2\
                        THEN SUBSTRING(TLOC.NOME,10,100)\
                    ELSE\
                        TLOC.NOME\
                    \END) = GCCUSTO.NOME\
                AND (GCCUSTO.ATIVO = 'T' OR GCCUSTO.CODCCUSTO = '1.5.013')\
        WHERE\
           (TLOC.INATIVO = 0 OR TLOC.CODLOC = 513)\
        ORDER BY CODCOLIGADA";
    }
    else{
        myQuery =
        "SELECT DISTINCT\
            TFCOLIGADA.CODCOLIGADA,\
            TFCOLIGADA.NOMEFANTASIA,\
            GCCUSTO.CODCCUSTO,\
            ZR.PERFIL perfil\
        FROM ZRPERFILUSUARIO ZR\
            INNER JOIN TFCOLIGADA ON\
                TFCOLIGADA.CODCOLIGADA = ZR.CODCOLIGADA\
            INNER JOIN TLOC ON\
                ZR.PERFIL = TLOC.NOME\
                AND ZR.CODCOLIGADA = TLOC.CODCOLIGADA\
            INNER JOIN GCCUSTO ON\
                TLOC.CODCOLIGADA = GCCUSTO.CODCOLIGADA\
                AND (CASE\
                    WHEN TLOC.CODCOLIGADA = 2\
                        THEN SUBSTRING(TLOC.NOME,10,100)\
                    ELSE\
                        TLOC.NOME\
                    \END) = GCCUSTO.NOME\
                AND (GCCUSTO.ATIVO = 'T' OR GCCUSTO.CODCCUSTO = '1.5.013')\
        WHERE\
            (TLOC.INATIVO = 0 OR TLOC.CODLOC = 513)\
            AND CODUSUARIOFLUIG = '" + usuario + "'\
        ORDER BY CODCOLIGADA";
    }

    log.info("myQuery: " + myQuery);
    return executaQuery(myQuery);

}function onMobileSync(user) {

}

function executaQuery(query) {
    var newDataset = DatasetBuilder.newDataset(),
	dataSource = "/jdbc/RM",
	ic = new javax.naming.InitialContext(),
	ds = ic.lookup(dataSource),
    created = false;
    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(query);
        var columnCount = rs.getMetaData().getColumnCount();

        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "   -   ";
                }
            }

            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
        newDataset.addColumn("coluna");
        newDataset.addRow(["deu erro! "]);
        newDataset.addRow([e.message]);
    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
}