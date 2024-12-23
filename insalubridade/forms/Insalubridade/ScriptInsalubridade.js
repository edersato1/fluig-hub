/*

Inicio --------------  0/4
Seguranca ------------ 5
Gerente de Contrato -- 33
RH ------------------- 15
Fim ------------------ 14

*/

myLoading1 = null;

$(document).ready(function() {

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
            $("#divAnexos, #divNr, #approveAreaGerente, #approveAreaSeguranca, #motivoRejeitado, #pdfArea, .divAnexo").hide();
        }

        $("input[type='file']").on("change", function () {
            $("#idDoc" + $(this).attr("id").split("inputFile")[1]).val("");
    
            if ($(this)[0].files.length == 0) {
                $(this).siblings("div").html("Nenhum arquivo selecionado");
            } else if ($(this)[0].files.length == 1) {
                if ($(this).attr("id") != "inputFileContrato") {
                    $(this).siblings("div").html("Carregando...");
                    CriaDocFluig($(this).attr("id"));
                }
            } else {
                if ($(this).attr("id") != "inputFileContrato") {
                    $(this).siblings("div").html("Carregando...");
                    CriaDocFluig($(this).attr("id"));
                }
            }
        });

        FLUIGC.switcher.init("#anexoObserv");

            /* switch da observação */
        FLUIGC.switcher.onChange($('#anexoObserv'), function (event, state) {
            if (state) {
                $(".divAnexo").toggle(this.checked);
            } else {
                $(".divAnexo").hide();
            }
        })
    }

    if ($("#modoAtividade").val() == "MOD") {
        
        if ($("#atividade").val() == 4) {
            preencherObrasDoUsuario();

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

            if ($('#status').val() == '2' || $('#status').val() == '3') {
                checkMotivoCorrecao = $('#motivo').val();
                
                if (checkMotivoCorrecao || checkMotivoCorrecao != "") {
                    let paragMotivo = document.createElement("h4");
                    let textoMotivo = document.createTextNode(checkMotivoCorrecao);
                    
                    paragMotivo.classList.add('motivoAlteracao');
                    paragMotivo.appendChild(textoMotivo);
                    document.getElementById("divAlertMessage").appendChild(paragMotivo);
                    $('#motivo').val();
                }
                $("#pdfArea").hide();
            }
            $("#divAnexos, #approveAreaGerente, #approveAreaSeguranca, #divNr, #motivoRejeitado, #pdfArea, .divAnexo").hide();
        }

        /* Gerente de Contrato */
        if ($("#atividade").val() == 33) {
            $("#approveAreaSeguranca, #divAnexos, #divNr, #motivoRejeitado, #pdfArea, .divAnexo").hide();

            $('input[type="text"]').prop('readonly', true);
            $("#setorEspecifico").css("text-transform", "uppercase");

            $("#checkAprova, #checkRejeita").click(function() {
                if ($(this).attr("id") === "checkAprova") {
                    $("#status").val("1");
                } else if ($(this).attr("id") === "checkRejeita") {
                    $("#status").val("2");
                };
            })

            if($("#observacoes").val() === "") {
                $("#divObservacoes").hide();
            } else {
                $("#divObservacoes").show();
            }

            if ($('#status').val() == '2' || $('#status').val() == '3') {
                $('input:checkbox').removeAttr('checked');

                if($("#observacoes").val() === "") {
                    $("#divObservacoes").hide();
                } else {
                    $("#divObservacoes").show();
                }
            }

        }

        /* Segurança */
        if ($("#atividade").val() == 5) {
            $("#approveAreaGerente, #motivoRejeitado, #pdfArea, .divAnexo").hide();
            $("#approveAreaSeguranca").show();
            
            $('#descricaoCargo input[type="text"]').prop('readonly', true);
            $("#setorEspecifico").css("text-transform", "uppercase");

			$("#checkAprovaSeguranca, #checkRejeitaSeguranca").click(function() {
				if ($(this).attr("id") === "checkAprovaSeguranca") {
					$("#status").val("1");
					$("#motivoRejeitado").hide();
				} else if ($(this).attr("id") === "checkRejeitaSeguranca") {
					$("#status").val("3");
					$("#motivoRejeitado").show();
				} else {
					$("#status").val("1");
					$("#motivoRejeitado").hide();
				}
			});

            if ($('#status').val() == '2' || $('#status').val() == '3') {
                $('input:checkbox').removeAttr('checked');
            }

            if ($('#status').val() == '2') {
                $("#checkAprovaSeguranca, #checkRejeitaSeguranca").click(function() {
                    if ($(this).attr("id") === "checkAprovaSeguranca") {
                        $("#status").val("1");
                        $("#motivoRejeitado").hide();
                    } else {
                        $("#status").val("2");
                        $("#motivoRejeitado").hide();
                    }
                });
            }

            $('#percentNr').mask('##0,00%', { reverse: true });
        }
        
        
        /* RH */
        var isClicked = false;
        if ($("#atividade").val() == 15) {
            $("#motivoRejeitado, #pdfArea, .divAnexo").hide();

            $('input[type="text"]').prop('readonly', true);
            $("#setorEspecifico").css("text-transform", "uppercase");

            if ($("#checkAprova").is(":checked")) {
				$("#checkRejeita").prop("disabled", true);
			} else {
				$("#checkAprova").prop("disabled", true);
			}

            if ($("#checkAprovaSeguranca").is(":checked")) {
                $("#checkRejeitaSeguranca").prop("disabled", true);
            } else {
                $("#checkAprovaSeguranca").prop("disabled", true);
            }

            if($("#observacoes").val() === "") {
                $("#divObservacoes").hide();
            } else {
                $("#divObservacoes").show();
            }

            if ($("#status").val() === "2") {
                $("#pdfArea, .divAnexo").hide();
                $("#motivoRejeitado").show();
                $('#motivo').val("");
                
            } else {
                $("#pdfArea").show();
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

        $("input[type='file']").on("change", function () {
            $("#idDoc" + $(this).attr("id").split("inputFile")[1]).val("");
    
            if ($(this)[0].files.length == 0) {
                $(this).siblings("div").html("Nenhum arquivo selecionado");
            } else if ($(this)[0].files.length == 1) {
                if ($(this).attr("id") != "inputFileContrato") {
                    $(this).siblings("div").html("Carregando...");
                    CriaDocFluig($(this).attr("id"));
                }
            } else {
                if ($(this).attr("id") != "inputFileContrato") {
                    $(this).siblings("div").html("Carregando...");
                    CriaDocFluig($(this).attr("id"));
                }
            }
        });

        FLUIGC.switcher.init('#perigoAnexo1, #perigoAnexo2, #perigoAnexo3, #perigoAnexo4, #perigoAnexo5');
        FLUIGC.switcher.init('#insalubreAnexo1, #insalubreAnexo2, #insalubreAnexo3, #insalubreAnexo4, #insalubreAnexo5, #insalubreAnexo6, #insalubreAnexo7, #insalubreAnexo8, #insalubreAnexo9, #insalubreAnexo10, #insalubreAnexo11, #insalubreAnexo12, #insalubreAnexo13, #insalubreAnexo14, #insalubreAnexo15');
        FLUIGC.switcher.init("#anexoObserv");
    }
    
    if ($("#modoAtividade").val() == "VIEW") {
        $("#divAnexos, #approveAreaGerente, #approveAreaSeguranca, #divObservacoes, #motivoRejeitado, #pdfArea").hide();
    }    

    $("#geraPdf").click(function() {
		gerarPdf();
	})

    /* switch da observação */
    FLUIGC.switcher.onChange($('#anexoObserv'), function (event, state) {
        if (state) {
            $(".divAnexo").toggle(this.checked);
        } else {
            $(".divAnexo").hide();
        }
    })

    let dia = new Date();
    FLUIGC.calendar("#dataSolicitacao", {minDate: dia, showToday: false});
})