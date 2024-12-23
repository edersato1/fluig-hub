function displayFields(form,customHTML){
    var mode = form.getFormMode();
    var atividade = getValue('WKNumState');

	form.setValue("modoAtividade", mode);
    form.setValue("atividade", atividade);
    
    if (atividade == 0) {
        form.setValue("solicitante", getValue("WKUser"));
    }
}