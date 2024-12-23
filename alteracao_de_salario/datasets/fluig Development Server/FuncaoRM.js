function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigRM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
    var coligada = null;
    var funcao = null;
    
    if (constraints != null) 
    {
        for (i = 0; i < constraints.length; i++) {
        	if (constraints[i].fieldName == "coligada"){ 
        		coligada = constraints[i].initialValue; 
        	}
        	if (constraints[i].fieldName == "funcao"){ 
        		funcao = constraints[i].initialValue; 
        	}
        }
    }
    if (coligada != null && (funcao == null || funcao == '')) {
    	var myQuery = "SELECT DISTINCT nome, codigo, codcoligada FROM pfuncao WHERE codcoligada = "+ coligada +" AND inativa = 0 ORDER BY nome";
    } else if (coligada != null && funcao != null && funcao != '') {
    	var myQuery = "SELECT DISTINCT nome, codigo, codcoligada FROM pfuncao WHERE codcoligada = "+ coligada +" AND codigo = '"+ funcao + "' AND inativa = 0 ORDER BY nome";
    } 
    
    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery);
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
                    Arr[i - 1] = "null";
                }
            }
            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
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

function onMobileSync(user) {

}