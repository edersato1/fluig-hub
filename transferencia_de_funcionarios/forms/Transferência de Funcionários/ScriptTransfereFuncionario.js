/*

Inicio ----------------- 0/4
Obra Destino ----------- 5
Gerente de Contrato ---- 11
RH --------------------- 13
Fim -------------------- 17

*/

myLoading1 = null;

$(document).ready(function () {

    myLoading1 = FLUIGC.loading(window, {
        textMessage: "Procurando número da chapa, aguarde um instante...",
        css: {
            padding: 0,
            margin: 0,
            width: '50%',
            top: '40%',
            left: '25%',
            textAlign: 'center',
            color: '#000',
            border: '3px solid #aaa',
            backgroundColor: '#fff',
            cursor: 'wait'
        },
        overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.6,
            cursor: 'wait'
        }
    });

    if ($("#modoAtividade").val() == "ADD") {

        preencherObrasDoUsuario();
        preencherObrasDestino();

        $("#numChapa").on("change input", function() {
            var mainValue = $(this).val();
            
            if (mainValue.length >= 7) {   
				myLoading1.show();
				
                setTimeout(async () => {
                    selecionaChapa();
					myLoading1.hide();
                }, 2300)
            }

            if (mainValue) {
                preencheDadosUsuario(codCustoGlobal);
            } else {
                LimpaCampos();
            }
        });

        if ($("#atividade").val() == 0) {
            $("#approveArea, #divNovaObra, #motivoRejeitado, #pdfArea").hide();
        }

        $("#nomeFunc", "#atualFunc", "#dataAdmissao").attr("readonly", "readonly");
    }
    
    if ($("#modoAtividade").val() == "MOD") {

        let dia = new Date();
        var hideInputs = $(".newFunc").hide();
    
        FLUIGC.calendar("#dataInicio", { minDate: dia });

        $("#obraDestino").on('change', function() {
            carregaSecao();
        })
        
        /* Obra Destino */
        if($("#atividade").val() == 5) {
            preencherObrasDestino();
            carregaSecao();

            
            $("#approveArea, #motivoRejeitado, #pdfArea").hide();
            hideInputs;
        }
        
        /* Gerente de Contrato */
        if ($("#atividade").val() == 11) {
            $("#approveArea").show();
            $("#motivoRejeitado, #pdfArea").hide();            
            
            $("#divNovaObra input, #divNovaObra select").attr("readonly", "readonly");
            $("#divNovaObra input, #divNovaObra select").css("cursor", "text");
        }
        
        /* RH */
        var isClicked = false;

        if ($("#atividade").val() == 13) {
            $("#approveArea, #pdfArea").show();
            $("#motivoRejeitado").hide();

            $("#divNovaObra input, #divNovaObra select").attr("readonly", "readonly");
            $("#divNovaObra input, #divNovaObra select").css("cursor", "text");

            $('#geraPdf').click(function () {
				isClicked = true;

				window.parent.$("#workflowActions").show();

				FLUIGC.toast({
                    title: "PDF gerado com sucesso! ",
                    message: "<br><br>Confira as informações salvas antes de avançar",
                    type: "success",
                })
			})

			if (!isClicked) {
                window.parent.$("#workflowActions").hide();
            }

            if ($("#checkAprova").is(":checked")) {
                $("#checkRejeita").prop("disabled", true);
			} else {
                $("#checkAprova").prop("disabled", true);
			};
        }
    }

    if ($("#modoAtividade").val() == "VIEW") {

        $("#approveArea, #motivoRejeitado, #pdfArea").hide();
        $("#divNovaObra input, #divNovaObra select").attr("readonly", "readonly");
    }

    $("#geraPdf").click(function() {
		gerarPdf();
	})
})