function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    var atividade = getValue('WKNumState');
    var formMode = hAPI.getCardValue("modoAtividade");
    var motivo = hAPI.getCardValue("motivoAlteracao");
    var checkSMS = hAPI.getCardValue("checkRejeitaSeguranca")  == "on" ? true : false;
    var idDoc = hAPI.getCardValue("idDocRelatorio");
    var comentario = getValue("WKUserComment");
    
	var numProcesso = getValue ("WKNumProces");     
    var usuario = getValue ("WKUser");
    var motivoRejeitado = hAPI.getCardValue("motivo");

    hAPI.setCardValue("numProces", getValue("WKNumProces"));

    if (nextSequenceId != atividade) {
        if (formMode == "ADD" || formMode == "MOD") {

            if (motivo == "mudancaFuncao" || motivo == "antecipacao" || motivo == "promocao") {
                ListaAnexosFluig();
            }

            if (atividade == 15) {
                if (checkSMS == true) {
                    EnviaEmailAtualizacao(getValue("WKNumProces"));
                }
                
                if (comentario == "" && checkSMS == true) {
                    hAPI.setTaskComments(usuario, numProcesso, 0, motivoRejeitado);
                }
            }

            if (atividade == 21) {
                hAPI.attachDocument(idDoc);
                EnviaEmail(getValue("WKNumProces"));
            }
        }
    }
}

function EnviaEmail(numSolic) {
    var nomeFunc = hAPI.getCardValue('nomeFunc');
    var numChapa = hAPI.getCardValue('numChapa');
    var obra = hAPI.getCardValue('obra');
    var atualFunc = hAPI.getCardValue('atualFunc');

    try {
        var url = "http://fluig.castilho.com.br:1010"; //Prod
        // var url = "http://desenvolvimento.castilho.com.br:3232"; //Dev

        var html = 
            "<h3>\
                <b>ALTERAÇÃO SALARIAL - " + nomeFunc + " - SOLICITAÇÃO </b> \
                <a href='" + url + "/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + numSolic + "' target='_blank'>Nº" + numSolic + "</a>.\
            </h3>\
            <div>\
                <p>\
                    <b>Nome do Funcionário:</b> " + nomeFunc + "<br>\
                    <b>N° da Chapa:</b> " + numChapa + "<br>\
                    <b>Obra de Origem:</b> " + obra + "<br>\
                    <b>Função Atual:</b> " + atualFunc + "<br>\
                </p>\
            </div>\
            <p>Para mais informações, confira o documento referente ao funcionário abaixo:</p>"
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
            serviceCode: "ServicoFluig",
            endpoint: '/api/public/alert/customEmailSender',
            method: 'POST',
            timeoutService: '100',
            params: {
                to: BuscaDestinatario(),
                from: "fluig@construtoracastilho.com.br",
                subject: "[FLUIG] Alteração Salarial - " + nomeFunc,
                templateId: "TPL_RH_ALTERACAOSALARIAL",
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

function EnviaEmailAtualizacao(numSolic) {
    var nomeFunc = hAPI.getCardValue('nomeFunc');
    var numChapa = hAPI.getCardValue('numChapa');
    var obra = hAPI.getCardValue('obra');
    var atualFunc = hAPI.getCardValue('atualFunc');

    try {
        var url = "http://fluig.castilho.com.br:1010" //Prod
        // var url = "http://desenvolvimento.castilho.com.br:3232" //Dev

        var html = 
            "<h3>\
                <b>ATUALIZAÇÃO - ALTERAÇÃO SALARIAL - " + nomeFunc + " - SOLICITAÇÃO </b> \
                <a href='" + url + "/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + numSolic + "' target='_blank'>Nº" + numSolic + "</a>.\
            </h3>\
            <div>\
                <h4 style='color:firebrick'>Confira a atualização referente a solicitação: " + hAPI.getCardValue('motivo') + "</h4>\
            </div>\
            <div>\
                <p>\
                    <b>Nome do Funcionário:</b> " + nomeFunc + "<br>\
                    <b>N° da Chapa:</b> " + numChapa + "<br>\
                    <b>Obra de Origem:</b> " + obra + "<br>\
                    <b>Função Atual:</b> " + atualFunc + "<br>\
                </p>\
            </div>\
            <p>Para mais informações, confira o documento referente ao funcionário abaixo:</p>"
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
            serviceCode: "ServicoFluig",
            endpoint: '/api/public/alert/customEmailSender',
            method: 'POST',
            timeoutService: '100',
            params: {
                to: BuscaDestinatario(),
                from: "fluig@construtoracastilho.com.br",
                subject: "[FLUIG] Atualização - Alteração Salarial - " + nomeFunc,
                templateId: "TPL_RH_ALTERACAOSALARIAL",
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
    // var emailSetores = [
    //     "teste1@castilho.com.br" + "; ",
	// 	"teste2@castilho.com.br" + "; ",
    //     "eder.sato@castilho.com.br" + "; "
    // ]

    // Prod
    var emailSetores = [
        "rh@castilho.com.br" + "; ",
        "sgsst@castilho.com.br" + "; ",
    ]

    var listDestinatario = "";

    for (var i = 0; i < emailSetores.length; i++) {
        listDestinatario += emailSetores[i].replace(',', '') + " ";
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

function ListaAnexosFluig() {
    function processarAnexosPorCampo(campo) {
        if (campo != null && campo.trim() != "") {
            var documentos = campo.split(",").map(function(item) {
                return item.trim();
            }).filter(function(item) {
                return item != "";
            });

            for (var i = 0; i < documentos.length; i++) {
                if (documentos[i]) {
                    AnexarDocumento(documentos[i]);
                }
            }
        }
    }

    // Processar os anexos de forma independente para cada campo
    processarAnexosPorCampo(hAPI.getCardValue("idDocAtestadoSaude"));
    processarAnexosPorCampo(hAPI.getCardValue("idDocFichaEPI"));
    processarAnexosPorCampo(hAPI.getCardValue("idDocOSNovaFunc"));
    processarAnexosPorCampo(hAPI.getCardValue("idDocTreinoNovaFunc"));
    processarAnexosPorCampo(hAPI.getCardValue("idDocTermoTreino"));
    processarAnexosPorCampo(hAPI.getCardValue("idDocAvaliaEficacia"));
}

// Função para anexar o documento, agora com validação de ID
function AnexarDocumento(id) {
    if (id && id.trim() != "") {  // Verifica se o ID é válido
        var attachments = hAPI.listAttachments();
        var isAnexado = false;

        for (var i = 0; i < attachments.size(); i++) {
            if (id == attachments.get(i).getDocumentId()) {
                isAnexado = true;
                break;
            }
        }

        if (!isAnexado) {
            log.info("Anexando documento com ID: " + id);
            hAPI.attachDocument(id);
        }
    } else {
        log.info("ID inválido ou nulo. Documento não será anexado.");
    }
}