
function createDataset(fields, constraints, sortFields) {

	log.info("#### [Dataset: createDocument] - Iniciando");
	
	var dtResult = DatasetBuilder.newDataset();
	dtResult.addColumn("Status");
	dtResult.addColumn("Resultado");
	log.info("dtResult: " + dtResult);
	
	var processo = null;
	var idRM = null;
	var conteudo = null;
	var nome = null;
	var descricao = null;
	var pasta = null;

	if (constraints != null)
    {
        for (i = 0; i < constraints.length; i++) 
        {
        	if (constraints[i].fieldName == "processo"){ 
        		processo = constraints[i].initialValue; 
        	}
        	if (constraints[i].fieldName == "idRM"){ 
        		idRM = constraints[i].initialValue; 
        	}       
        	if (constraints[i].fieldName == "conteudo"){ 
        		conteudo = constraints[i].initialValue; 
			}
			if (constraints[i].fieldName == "nome") {
				nome = constraints[i].initialValue;
			}
			if (constraints[i].fieldName == "descricao") {
				descricao = constraints[i].initialValue;
			}
			if(constraints[i].fieldName == "pasta"){
				pasta = constraints[i].initialValue;
			}
       }
    }
	
	if (constraints == null) {
		return e("Sem parametros");
	}
	
	/*
	 * ============================================== 
	 * == PARÂMETROS QUE PRECISAM SER MODIFICADOS: ==
	 * ==============================================
	 */
	
	log.info("lognome: " + nome + " descricao: " + descricao + " pasta: " + pasta);
	
	
	var ServiceDocumentName = "ECMDocumentServiceFluig"; // O ServiceDocumentName corresponde ao código do serviço criado no studio. Para este exemplo, crie o serviço como CXF

	var codEmpresa = 1; // Informe o codigo da empresa
	var loginAdm = "fluig"; // Usuario integrador - login do usuário administrador 
	var senhaAdm = "flu!g@cc#2018"; // Usuario integrador - Senha do usuário administrador

	if (descricao != null && descricao != "" && nome != null && nome != "") {	// Se a descrição do documento foi passada por parâmetro
		var DocumentDescription = descricao;
		var fileName = nome;
	}
	else{ // Se não ultitliza a descrição padrão 
		var DocumentDescription = "Processo "+processo+" - RM: "+idRM; // Descricao do documento
		var fileName = "OrdemRM - "+idRM+".pdf"; // Nome do arquivo fisico:
	}

	// PRODUCAO
	if (pasta != "" && pasta != null) {
		var ParentDocumentId = parseInt(pasta); // Codigo da pasta pai onde o novo documento sera publicado
	}
	else{
		var ParentDocumentId = 108789; // Anexos OC/OS = Codigo da pasta pai onde o novo documento sera publicado
	}
	
	var PublisherId = "fluig"; // Matricula do usuario publicador
	var ColleagueId = "fluig"; // Matricula do usuario criador

	/* 
	 * No fileName eh necessario informar o nome do arquivo fisico disponivel que sera publicado. 
	 * Este precisa estar na pasta de upload do usuário integrador (loginAdm)
	 * Para enviar o documento para a pasta de upload do usuario, veja: http://tdn.totvs.com/x/zABlDw
	 */
	
	try {
		// neste momento, sera instanciado o servidor ECMDocumentService
		var webServiceProvider = ServiceManager.getServiceInstance(ServiceDocumentName);
		var webServiceLocator  = webServiceProvider.instantiate("ws.ECMDocumentServiceService");
		var webService = webServiceLocator.getDocumentServicePort();
		var documentoArray =  webServiceProvider.instantiate("ws.DocumentDtoArray"); 
		var documento =  webServiceProvider.instantiate("ws.DocumentDto");
		
		// agora sera definida as propriedades do documento, a lista completa de propriedade pode ser vista aqui: http://tdn.totvs.com/x/l4eADQ
		documento.setApprovalAndOr(false);
		documento.setAtualizationId(1);
		documento.setColleagueId(ColleagueId);
		documento.setCompanyId(codEmpresa);
		documento.setDeleted(false);
		documento.setDocumentDescription(DocumentDescription);
		documento.setDocumentType("2"); // 1 - Pasta; 2 - Documento; 3 - Documento Externo; 4 - Fichario; 5 - Fichas; 9 - Aplicativo; 10 - Relatorio.
		documento.setDownloadEnabled(true);
		documento.setExpires(false);
		documento.setInheritSecurity(true);
		documento.setParentDocumentId(ParentDocumentId);
		documento.setPrivateDocument(false);
		documento.setPublisherId(PublisherId);
		documento.setUpdateIsoProperties(true);
		documento.setUserNotify(false);
		documento.setVersionOption("0"); 
		documento.setDocumentPropertyNumber(0);
		documento.setDocumentPropertyVersion(0);
		documento.setVolumeId("Default");  
		//documento.setIconId(2);
		documento.setLanguageId("pt");
		documento.setIndexed(true);//o default era false
		documento.setActiveVersion(true);
		documento.setTranslated(false);
		documento.setTopicId(1);
		documento.setDocumentTypeId("");
		documento.setExternalDocumentId("");
		documento.setDatasetName("");
		documento.setVersionDescription(""); 
		documento.setKeyWord("");
		documento.setImutable(false);
		documento.setProtectedCopy(false);
		documento.setAccessCount(0);
		documento.setVersion(1000);

	    documentoArray.getItem().add(documento);
		
		// agora sera definida as propriedades do anexo, a lista completa de propriedade pode ser vista aqui: http://tdn.totvs.com/x/l4eADQ
		var attachmentArray = webServiceProvider.instantiate("ws.AttachmentArray"); 
		var attachment = webServiceProvider.instantiate("ws.Attachment"); 

		log.info("## [Dataset: createDocument] - Nome e extensão do arquivo físico a ser publicado: " + fileName);
		//var caminho = '//HOMOLOGACAO/FileTemp/teste.pdf';
		var decodedString = java.util.Base64.getDecoder().decode(conteudo.getBytes("UTF-8"));
		//var byteArray = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(caminho));
		
		attachment.setFileName(fileName);
		attachment.setPrincipal(true);
		attachment.setFilecontent(decodedString);

		attachmentArray.getItem().add(attachment);
		
		var documentSecurityConfigDtoArray = webServiceProvider.instantiate("ws.DocumentSecurityConfigDtoArray");
		var approverDtoArray = webServiceProvider.instantiate("ws.ApproverDtoArray"); 
		var relatedDocumentDtoArray = webServiceProvider.instantiate("ws.RelatedDocumentDtoArray"); 
		
		log.info("## [Dataset: createDocument] - chamando createDocument");
		// agora sera feita a publicacao do documento
		var retornoDocumento = webService.createDocument(loginAdm, senhaAdm, codEmpresa, documentoArray, attachmentArray, documentSecurityConfigDtoArray, approverDtoArray, relatedDocumentDtoArray);
		// codigo do documento publicado
		var idDocumento = retornoDocumento.getItem().get(0).getDocumentId();
		
		log.info("## [Dataset: createDocument] - Documento criado com SUCESSO! Código: " + idDocumento);
		//dtResult.addRow(["Documento criado com SUCESSO! Código: " + idDocumento]);
		dtResult.addRow(new Array("true", idDocumento));
		
		log.info("#### [Dataset: createDocument] - Finalizado");
		return dtResult;
		
	} catch (e) {
		//dtResult.addRow(["Erro " + e.message]);
		dtResult.addRow(new Array("false",e));
		log.info("## [Dataset: createDocument] - Erro ao tentar criar documento: " + e.message);
		return dtResult;
	} 
};