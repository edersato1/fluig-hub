function resolve(process, colleague) {
    var userList = new java.util.ArrayList();
    var obra = hAPI.getCardValue("obra");
    var obraNum = obra.split("-");
    var obraSelect = obraNum[obraNum.length - 1].trim();
    var regex = /^\d+/;
    var codcoligada = obra.match(regex)[0];
	var codTmv = "1.1.98";
    var valor = 20000;
    
    /* Separação do dataset */
	if (obraSelect == "Matriz Curitiba") {
		// userList.add('padilha');
		userList.add('eder.sato');
		return userList;
	} else {
		var c1 = DatasetFactory.createConstraint("paramCodColigada", codcoligada, codcoligada, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("paramLocal", obraSelect, obraSelect, ConstraintType.MUST);
		var c3 = DatasetFactory.createConstraint("paramCodTmv", codTmv, codTmv, ConstraintType.MUST);
		var c4 = DatasetFactory.createConstraint("paramValorTotal", valor, valor, ConstraintType.MUST);
		
		var resultDataSet = DatasetFactory.getDataset("verificaAprovador", null, [ c1, c2, c3, c4 ], null);
		
		for (var count = 0; count < resultDataSet.values.length; count++) {
			var user = resultDataSet.getValue(count, "usuarioFLUIG");
			
			// userList.add(user);
			userList.add("eder.sato");
			return userList;
		}
	}
	throw "Aprovador não encontrado."
}