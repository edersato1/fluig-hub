function createDataset(fields, constraints, sortFields) {
    var myQuery = null,
        operacao = null,
        codColigada = null,
        codCusto = null;

    if (constraints != null) {
        for (i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "operacao") {
                operacao = constraints[i].initialValue;
            }
            else if (constraints[i].fieldName == "codColigada") {
                codColigada = constraints[i].initialValue;
            }
            else if (constraints[i].fieldName == "codCusto") {
                codCusto = constraints[i].initialValue;
            }
        }
    }

    if (operacao == "BuscaContratos") {
        myQuery = "SELECT TCNT.CODIGOCONTRATO, \
            FCFO.NOMEFANTASIA\
            FROM TCNT\
            INNER JOIN FCFO ON FCFO.CODCOLIGADA = TCNT.CODCOLCFO AND FCFO.CODCFO = TCNT.CODCFO\
            WHERE TCNT.CODCOLIGADA = " + codColigada + "\
            AND TCNT.CODCCUSTO = " + codCusto + "\
            AND CODSTACNT = '01'\
            ORDER BY FCFO.NOMEFANTASIA";
    }

    log.info("myQuery: " + myQuery);
    return executaQuery(myQuery);
}

function executaQuery(query) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/RM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
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


// function createDataset(fields, constraints, sortFields) {
//     var dsCodigoContrato = DatasetBuilder.newDataset();

//     var codColigada = constraints[0].initialValue;
//     var codCusto = constraints[1].initialValue;

//     var selectVal = queryContracts(codColigada, codCusto);

//     var dataSource = "/jdbc/RM";
//     var ic = new javax.naming.InitialContext();
//     var ds = ic.lookup(dataSource);
//     var conn = null;
//     var stmt = null;
//     var rs = null;

//     try {
//         conn = ds.getConnection();
//         stmt = conn.createStatement();
//         rs = stmt.executeQuery(selectVal);
//         var columnCount = rs.getMetaData().getColumnCount();

//         if (columnCount > 0) {
//             for (var i = 1; i <= columnCount; i++) {
//                 dsCodigoContrato.addColumn(rs.getMetaData().getColumnName(i));
//             }

//             while (rs.next()) {
//                 var arr = new Array();
//                 for (var i = 1; i <= columnCount; i++) {
//                     var obj = rs.getObject(rs.getMetaData().getColumnName(i));
//                     if (null != obj) {
//                         arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
//                     } else {
//                         arr[i - 1] = "null";
//                     }
//                 }
//                 dsCodigoContrato.addRow(arr);
//             }
//         }
//     } catch (error) {
//         log.error(error.message);
//     } finally {
//         if (rs != null) {
//             rs.close();
//         }
//         if (stmt != null) {
//             stmt.close();
//         }
//         if (conn != null) {
//             conn.close();
//         }
//     }

//     return dsCodigoContrato;
// }


// function queryContracts(codColigada, codCusto) {
//     var query = "SELECT TCNT.CODIGOCONTRATO, " + 
// 	"FCFO.NOMEFANTASIA, " + 
//     "FROM TCNT " + 
// 	"INNER JOIN FCFO ON FCFO.CODCOLIGADA = TCNT.CODCOLCFO AND FCFO.CODCFO = TCNT.CODCFO " +
//     "WHERE TCNT.CODCOLIGADA = '" + codColigada + "' AND TCNT.CODCCUSTO = '" + codCusto + "' AND CODSTACNT = '01' " +
//     "ORDER BY FCFO.NOMEFANTASIA";

//     return query;
// }