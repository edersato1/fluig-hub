function beforeTaskSave(colleagueId,nextSequenceId,userList){
    var atividade = getValue('WKNumState');
    var formMode = hAPI.getCardValue("modoAtividade");
    var gerenteCheck = hAPI.getCardValue("checkRejeita")  == "on" ? true : false;
    var idDoc = hAPI.getCardValue("idDocRelatorio");
    var comentario = getValue("WKUserComment");
    var status = hAPI.getCardValue("status");
    
	var numProcesso = getValue ("WKNumProces");     
    var usuario = getValue ("WKUser");
    var motivoRejeitado = hAPI.getCardValue("motivo");

    hAPI.setCardValue("numProces", getValue("WKNumProces"));

    if (nextSequenceId != atividade) {
        if (formMode == "ADD" || formMode == "MOD") {

        	if (atividade == 5) {
                if (gerenteCheck == true) {              	
                    EnviaEmailAtualizacao(getValue("WKNumProces"));
                }
                
                if (status == "3") {
                	if (comentario == "") {
                		hAPI.setTaskComments(usuario, numProcesso, 0, motivoRejeitado);
                	}                	
                }
                
                if (status == "1") {
                	if (comentario == "") {
                		hAPI.setCardValue("motivoRejeitado", "");
                	}
                }
                
            }
            
            if (atividade == 15) {
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
        var url = "http://fluig.castilho.com.br:1010";
        // var url = "http://desenvolvimento.castilho.com.br:3232";

        var html =
            "<h3>\
                    <b>INSALUBRIDADE - " + nomeFunc + " - SOLICITAÇÃO  </b> \
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
                <p>Para mais informações, confira o documento referente a solicitação abaixo:</p>"
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
                subject: "[FLUIG] Insalubridade - " + nomeFunc,
                templateId: "TPL_RH_INSALUBRIDADE",
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

    try {
        var url = "http://fluig.castilho.com.br:1010";
        // var url = "http://desenvolvimento.castilho.com.br:3232";
        var html =
                "<h3>\
                    <b>ATUALIZAÇÃO - INSALUBRIDADE - " + nomeFunc + " - SOLICITAÇÃO </b> \
                    <a href='" + url + "/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + numSolic + "' target='_blank'>Nº" + numSolic + "</a>.\
                </h3>\
                <div>\
                    <h4 style='color:firebrick'>Confira a atualização referente a solicitação: " + hAPI.getCardValue('motivo') + "</h4>\
                </div>\
                <div>\
                    <p>\
                        <b>Nome do Funcionário:</b> " + nomeFunc + "<br>\
                        <b>N° da Chapa:</b> " + hAPI.getCardValue('numChapa') + "<br>\
                        <b>Obra de Origem:</b> " + hAPI.getCardValue('obra') + "<br>\
                        <b>Função Atual:</b> " + hAPI.getCardValue('atualFunc') + "<br>\
                    </p>\
                </div>"
            ;

        var data = {
            companyId: getValue("WKCompany").toString(),
            serviceCode: "ServicoFluig",
            endpoint: '/api/public/alert/customEmailSender',
            method: 'POST',
            timeoutService: '100',
            params: {
                to: BuscaDestinatario(),
                from: "fluig@construtoracastilho.com.br",
                subject: "[FLUIG] Atualização - Insalubridade - " + nomeFunc,
                templateId: "TPL_RH_INSALUBRIDADE",
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
    //     "teste2@castilho.com.br" + "; ",
    //     "eder.sato@castilho.com.br" + "; "
    // ]

    var emailSetores = [
        "rh@castilho.com.br" + "; ",
        "sgsst@castilho.com.br" + "; "
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