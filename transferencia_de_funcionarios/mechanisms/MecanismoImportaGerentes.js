function resolve(process,colleague){
	var userList = new java.util.ArrayList();

	var obraOrigem = hAPI.getCardValue("obra");
	var obraDestino = hAPI.getCardValue("obraDestino");

	var obraNumOrigem = obraOrigem.split("-");
	var obraNumDestino = obraDestino.split("-");
	
	var obraOrigemSelect = obraNumOrigem[obraNumOrigem.length - 1].trim();
	var obraDestinoSelect = obraNumDestino[obraNumDestino.length - 1].trim();

	var regex = /^\d+/;

	var obraOrigemCodColigada = obraOrigem.match(regex)[0];
	var obraDestinoCodColigada = obraDestino.match(regex)[0];

	var valor = 21000;

	/* ======================== */

	var c1 = DatasetFactory.createConstraint("paramCodColigada", obraOrigemCodColigada, obraOrigemCodColigada, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("paramCodColigada", obraDestinoCodColigada, obraDestinoCodColigada, ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("paramLocal", obraOrigemSelect, obraOrigemSelect, ConstraintType.MUST);
	var c4 = DatasetFactory.createConstraint("paramLocal", obraDestinoSelect, obraDestinoSelect, ConstraintType.MUST);
	var c5 = DatasetFactory.createConstraint("paramValorTotal", valor, valor, ConstraintType.MUST);

	var resultDataSet = DatasetFactory.getDataset("verificaAprovador", null, [c1, c2, c3, c4, c5], null);

	for (var count = 0; count < resultDataSet.values.length; count++) {
		var user = resultDataSet.getValue(count, "usuarioFLUIG");

		userList.add(user);
		userList.add('eder.sato');
		userList.add('felipe');

		return userList;
	}
}