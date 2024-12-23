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
    var secao = null;
    var coligada = null;
    var i = null;
    
    if (constraints != null) {
        for (i = 0; i < constraints.length; i++) {
        	if (constraints[i].fieldName == "secao"){ 
        		secao = constraints[i].initialValue; 
        	}
        	if (constraints[i].fieldName == "coligada"){ 
        		coligada = constraints[i].initialValue; 
        	}
        }
    }
    
    if (coligada != null && (secao == null || secao == '')) {
    	var myQuery = "SELECT DISTINCT codigo, codigo + ' - ' + descricao descricao, codfilial FROM psecao WHERE codcoligada = "+ coligada +" AND secaodesativada <> 1 AND LEN(codigo) > 6 order by descricao";
    } else if (coligada != null && secao != null && secao != '') {
    	var myQuery = "SELECT DISTINCT codigo, codigo + ' - ' + descricao descricao, codfilial FROM psecao WHERE codcoligada = "+ coligada +" AND secaodesativada <> 1 AND LEN(codigo) > 6 and codigo = '"+ secao +"' order by descricao";
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
function onMobileSync(user) {

}