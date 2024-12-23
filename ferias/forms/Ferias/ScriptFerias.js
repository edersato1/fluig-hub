/*

Início -------------------- 0/4
Gestor de Contrato -------- 5
RH ------------------------ 10
Fim ----------------------- 14

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
        
        $("#numChapa").on("change input", function() {
            var mainValue = $(this).val();

            if (mainValue.length >= 7) {   
				myLoading1.show();
				
                setTimeout(async () => {
                    selecionaChapa();
                    showColigada();
					myLoading1.hide();
                }, 2300)
			}
            
            if (mainValue) {
                preencheDadosUsuario(codCustoGlobal);
            } else {
                LimpaCampos();
            }
        });

        $("#dataInicio").on("change input", function() {
            var mainValue = $(this).val();
            
            if (mainValue) {} else {
                LimpaData();
            }
        })        

        let dia = new Date();
        
        FLUIGC.calendar("#dataInicio", { showToday: false, minDate: dia, daysOfWeekDisabled: [0,4,5,6] });
        FLUIGC.switcher.init("#decimoParcela, #abonoPecuniario");

        if ($("#atividade").val() == 0 || $("#atividade").val() == 4) {
            $("#approveArea, #motivoRejeitado, #pdfArea").hide();
        }

        $("#nomeFunc", "#atualFunc").attr("readonly", "readonly");
    }
    if ($("#modoAtividade").val() == "MOD") {

        FLUIGC.switcher.init("#decimoParcela, #abonoPecuniario");

        if($("#atividade").val() == 4) {

            FLUIGC.calendar("#dataInicio");

            $("#approveArea").hide();
            $("#motivoRejeitado, #pdfArea").hide();
            
            if ($('#status').val() == '2') {
                checkMotivoCorrecao = $('#motivo').val();
                
                if (checkMotivoCorrecao || checkMotivoCorrecao != "") {
                    let paragMotivo = document.createElement("h4");
                    let textoMotivo = document.createTextNode(checkMotivoCorrecao);
                    
                    paragMotivo.classList.add('motivoAlteracao');
                    paragMotivo.appendChild(textoMotivo);
                    document.getElementById("alertMessage").appendChild(paragMotivo);
                    $('#motivo').val();
                }
                $("#pdfArea").hide();
            }
        }

        /* Gestor de Contrato */
        if($("#atividade").val() == 5) {
            $("#approveArea").show();
            $("#motivoRejeitado, #pdfArea").hide();
            $("#dataInicio, #qtdDias").prop("readonly", true);
            
            $("#checkAprova, #checkRejeita").click(function() {
                if ($(this).attr("id") === "checkAprova") {
                    $("#status").val("1");
                } else if ($(this).attr("id") === "checkRejeita") {
                    $("#status").val("2");
                };
            })

            if ($('#status').val() == '2') {
                $('input:checkbox').removeAttr('checked');
            }
        }

        /* RH */
        var isClicked = false;

        if($("#atividade").val() == 10) {
            $("#approveArea, #pdfArea").show();
            $("#motivoRejeitado").hide();
            $("#dataInicio, #qtdDias").prop("readonly", true);

            if ($("#status").val() === "2") {
                $("#motivoRejeitado").show();
            } else {
				$("#motivoRejeitado").hide();

                $('#geraPdf').click(function () {
                    isClicked = true;
    
                    window.parent.$("#workflowActions").show();
    
                    FLUIGC.toast({
                        title: "Relatório gerado com sucesso! ",
                        message: "<br><br>Confira as informações salvas antes de avançar",
                        type: "success",
                    })
                })
    
                if (!isClicked) {
                    window.parent.$("#workflowActions").hide();
                }
            }
        }
    }
    if ($("#modoAtividade").val() == "VIEW") {
        FLUIGC.switcher.init("#decimoParcela");
        $("#approveArea, #motivoRejeitado, #pdfArea").hide();
    }

    $('#dataInicio, #qtdDias').on('input', function() {
        var startDate = $('#dataInicio').val();
        var daysText = $('#qtdDias').val();
        var days = parseInt(daysText);
    
        if (startDate && !isNaN(days)) {
            var dateParts = startDate.split('/');
            var day = parseInt(dateParts[0]);
            var month = parseInt(dateParts[1]) - 1; // Subtrai 1 porque os meses no JavaScript são baseados em zero (0-11)
            var year = parseInt(dateParts[2]);
    
            var date = new Date(year, month, day);
    
            date.setDate(date.getDate() + days);
            // Formata a data de resultado para dd/mm/yyyy
            var resultDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    
            $('#dataFinal').val(resultDate);
        }
    });

    $("#geraPdf").click(function() {
		gerarPdf();
	})

    FLUIGC.popover('.popoverFerias', { trigger: 'hover', placement: 'bottom', html: true });
})