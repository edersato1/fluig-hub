function beforeTaskSave(colleagueId, nextSequenceId, userList) {
	var atividade = getValue('WKNumState');
	var formMode = hAPI.getCardValue("modoAtividade");
	var idDoc = hAPI.getCardValue("idDocReuniaoZero");

	if (nextSequenceId != atividade) {
		if (formMode == "ADD" || formMode == "MOD") {
			if (atividade == 59) {
				hAPI.attachDocument(idDoc);
				EnviaEmail();
			}
		}
	}
}

function EnviaEmail() {
	var nomeObra = hAPI.getCardValue('nomeObra');
	var regional = hAPI.getCardValue('valorSpan');

	try {
		// var url = "http://fluig.castilho.com.br:1010"; // Prod
		var url = "http://desenvolvimento.castilho.com.br:3232"; // Dev

		var html =
			"<h3>\
				<b>Reunião Zero - " + nomeObra + " </b> \
			</h3>\
			<div>\
				<p>\
					<b>Coligada:</b> " + hAPI.getCardValue('coligadaSpan') + "<br>\
					<b>Nome da Obra:</b> " + nomeObra + "<br>\
					<b>Regional:</b> " + regional + "<br>\
					<b>Cliente:</b> " + hAPI.getCardValue('clienteObra') + "<br>\
					<b>Número do Contrato:</b> " + hAPI.getCardValue('numeroContrato') + "<br>\
					<br />\
					<b>Coordenador:</b> " + hAPI.getCardValue('coordenador') + "<br>\
					<b>Gerente do Contrato:</b> " + hAPI.getCardValue('gerenteContrato') + "<br>\
					<b>Encarregado Administrativo:</b> " + hAPI.getCardValue('encarregadoAdm') + "<br>\
					<b>Engenheiro:</b> " + hAPI.getCardValue('engenheiroSST') + "<br>\
				</p>\
			</div>\
			<p>Para mais informações, confira o documento referente a obra abaixo:</p>"
			;

		var anexos = BuscaAnexos();

		if (anexos != false && anexos != "") {
			html +=
				"<div>\
					<p>\
						" + anexos + "<br>\
					</p>\
					<br>\
				<div>";
		}

		var data = {
			companyId: getValue("WKCompany").toString(),
			serviceCode: 'ServicoFluig',
			endpoint: '/api/public/alert/customEmailSender',
			method: 'POST',
			timeoutService: '100',
			params: {
				to: BuscaDestinatario(),
				from: "fluig@construtoracastilho.com.br",
				subject: "[FLUIG] Reunião Zero - " + hAPI.getCardValue("nomeObra"),
				templateId: "ReuniaoZero",
				dialectId: "pt_BR",
				param: {
					"CORPO_EMAIL": html,
					"SERVER_URL": url,
					"TENANT_ID": "1"
				}
			}
		}

		var clientService = fluigAPI.getAuthorizeClientService();
		var vo = clientService.invoke(JSONUtil.toJSON(data));

		if (vo.getResult() == null || vo.getResult().isEmpty()) {
			throw "Retorno está vazio";
		} else {
			log.info(vo.getResult());
		}
		log.info("Fim Envia email");
	} catch (error) {
		throw "Erro ao enviar e-mail de notificação: " + error;
	}
}

function BuscaAnexos() {
	var retorno = "";
	var docs = hAPI.listAttachments();

	for (var i = 0; i < docs.size(); i++) {
		var doc = docs.get(i);
		retorno += "<li><a href='" + fluigAPI.getDocumentService().getDownloadURL(doc.getDocumentId()) + "'>" + doc.getDocumentDescription() + "</a></li>"
	}

	return retorno;
}

function BuscaEmailUsuario(usuario) {
	var ds = DatasetFactory.getDataset("colleague", null, [DatasetFactory.createConstraint("colleagueId", usuario, usuario, ConstraintType.MUST)], null);
	if (ds.values.length > 0) {
		return ds.getValue(0, "mail") + "; ";
	}
	else {
		return "";
	}
}

function BuscaDestinatario() {
	var emailCoordenador = hAPI.getCardValue('emailCoordenador');
	var emailGerente = hAPI.getCardValue('emailGerente');
	var emailEncarregado = hAPI.getCardValue('emailEncarregado');
	var emailEngenheiro = hAPI.getCardValue('emailEngenheiro');

	// var emailsEmCopia = [
	// 	"administracao@castilho.com.br" + "; ",
	// 	"diretoria@castilho.com.br" + "; ",
	// 	"frota@castilho.com.br" + "; ",
	// 	"compras@castilho.com.br" + "; ",
	// 	"rh@castilho.com.br" + "; ",
	// 	"financeiro@castilho.com.br" + "; ",
	// 	"contabilidade@castilho.com.br" + "; ",
	// 	"control@castilho.com.br" + "; ",
	// 	"informatica@castilho.com.br" + "; ",
	// 	"sgsst@castilho.com.br" + "; ",
	// 	"tecnica@castilho.com.br" + "; ",
	// 	"planejamento@castilho.com.br" + "; ",
	// 	"juridico@castilho.com.br" + "; ",
	// 	"ambiental@castilho.com.br" + "; "
	// ]

	var emailsEmCopia = [
		"teste1@castilho.com.br" + "; ",
		"teste2@castilho.com.br" + "; ",
		"teste3@castilho.com.br" + "; ",
		"teste4@castilho.com.br" + "; ",
		"teste5@castilho.com.br" + "; "
	]

	var listDestinatario = "";

	for (var i = 0; i < emailsEmCopia.length; i++) {
		listDestinatario += emailsEmCopia[i].replace(',', '') + " ";
	}

	if (emailCoordenador != null && emailCoordenador != "" && emailCoordenador != undefined) {
		listDestinatario += emailCoordenador + "; ";
	}
	if (emailGerente != null && emailGerente != "" && emailGerente != undefined) {
		listDestinatario += emailGerente + "; ";
	}
	if (emailEncarregado != null && emailEncarregado != "" && emailEncarregado != undefined) {
		listDestinatario += emailEncarregado + "; ";
	}
	if (emailEngenheiro != null && emailEngenheiro != "" && emailEngenheiro != undefined) {
		listDestinatario += emailEngenheiro + "; ";
	}

	if (listDestinatario.substring(listDestinatario.length - 2, listDestinatario.length) == "; ") {
		listDestinatario = listDestinatario.substring(0, listDestinatario.length - 2);
	}

	if (listDestinatario.substring(listDestinatario.length - 1, listDestinatario.length) == ";" || listDestinatario.substring(listDestinatario.length - 1, listDestinatario.length) == " ") {
		listDestinatario = listDestinatario.substring(0, listDestinatario.length - 1);
	}

	log.info("ListDestinatario: " + listDestinatario);
	return listDestinatario;
}