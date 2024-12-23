clientService = null;
function displayFields(form,customHTML){ 

	form.setHidePrintLink(true);
	var atividade = getValue('WKNumState');
	var numProcess = getValue('WKNumProces');
    var usuario = getValue("WKUser");
	var company = getValue("WKCompany");

	form.setValue("atividade", atividade);
	form.setValue("usuario", usuario);
	form.setValue("company", company);

	var mode = form.getFormMode();

	form.setValue("modoAtividade", mode);



	clientService = fluigAPI.getAuthorizeClientService();
	console.log(clientService);

}