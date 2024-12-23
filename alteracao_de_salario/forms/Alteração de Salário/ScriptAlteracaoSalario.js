/*

Incio -------------------- 0/4
Gerente de Contrato ------ 5
RH ----------------------- 13
SMS ---------------------- 15
RH Conferencia ----------- 21
Fim ---------------------- 19

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

		$("#numChapa").on("change input", function () {
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

		$("#obra").on('change', function () {
			carregaFuncoes();
		})

		$("#atualFunc").on('change', function () {
			buscaFuncaoAtual();
		})

		$('#novoSalario').mask("#.##0,00", { reverse: true });
		$('#atualSalario').mask("#.##0,00", { reverse: true });

		$("#divFuncIdentity, #divAlertMessage, #divEmail, #divFuncAtual, #divNovaFunc, #divAnexos").hide();

		$("#nomeFunc, #atualFunc, #obraOrigem").attr("readonly", "readonly");

		/* Delimitações/exibições das atividades  */

		if ($("#atividade").val() == 0) {
			$("#aprovaGerente, #aprovaSeguranca, #motivoRejeitado, #pdfArea").hide();
		}

	} else if ($("#modoAtividade").val() == "MOD") {

		$('input[type="text"]').prop('readonly', true);
		$('#atualSalario, #novoSalario').prop('readonly', false);

		if ($("#atividade").val() == 4) {
			$("#aprovaGerente, #aprovaSeguranca, #motivoRejeitado, #pdfArea").hide();
			preencherObrasDestino();

			$("#obra").on('change', function () {
				carregaFuncoes();
			})

			if ($('#status').val() == '2') {
                checkMotivoCorrecao = $('#motivo').val();
                
                if (checkMotivoCorrecao || checkMotivoCorrecao != "") {
                    let paragMotivo = document.createElement("h4");
                    let textoMotivo = document.createTextNode(checkMotivoCorrecao);
                    
                    paragMotivo.classList.add('motivoAlteracao');
                    paragMotivo.appendChild(textoMotivo);
                    document.getElementById("divAlertMessage").appendChild(paragMotivo);
                    $('#motivo').val();
                }
            }
		}

		/* Gerente de Contrato */
		if ($("#atividade").val() == 5) {
			$("#divAnexos, #aprovaSeguranca, #motivoRejeitado, #pdfArea").hide();

			if ($("#motivoAlteracao").val() == "mudancaFuncao") {
				$("#atualSalario, #novoSalario").closest('div').hide();
			} else if ($("#motivoAlteracao").val() == "merito") {
				$("#novaFunc").closest('div').hide();
			}

			$("#novoSalario").prop('readonly', true);
			$("#pdfArea").hide();
		}

		/* RH */
		if ($("#atividade").val() == 13) {
			$("#divAnexos, #aprovaSeguranca, #motivoRejeitado, #pdfArea").hide();

			if ($("#motivoAlteracao").val() == "mudancaFuncao") {
				$("#atualSalario, #novoSalario").closest('div').hide();
			} else if ($("#motivoAlteracao").val() == "merito") {
				$("#novaFunc").closest('div').hide();
			}

			if ($("#checkAprovaGerente").is(":checked")) {
				$("#checkRejeitaGerente").prop("disabled", true);
			} else {
				$("#checkAprovaGerente").prop("disabled", true);
			}

			$("#novoSalario").prop('readonly', false);
		}

		/* SMS */
		if ($("#atividade").val() == 15) {
			$("#pdfArea").hide();
			$("#divAnexos, #motivoRejeitado").hide();
			$("#aprovaGerente, #aprovaSeguranca").show();

			if ($("#checkAprovaGerente").is(":checked")) {
				$("#checkRejeitaGerente").prop("disabled", true);
			} else {
				$("#checkAprovaGerente").prop("disabled", true);
			}

			$("#checkAprovaSeguranca, #checkRejeitaSeguranca").click(function() {
				if ($(this).attr("id") === "checkAprovaSeguranca") {
					$("#status").val("1");
					$("#motivoRejeitado").hide();
				} else if ($(this).attr("id") === "checkRejeitaSeguranca") {
					$("#status").val("2");
					$("#motivoRejeitado").show();
				} else {
					$("#status").val("0");
					$("#motivoRejeitado").hide();
				}
			});

			if ($('#status').val() == '2') {
				$('#aprovaSeguranca input[type="checkbox"]').removeAttr('checked');
				$("#motivoRejeitado").val("");
				$("#motivoRejeitado").text("");
            }

			if ($("#motivoAlteracao").val() == "mudancaFuncao") {
				$("#atualSalario, #novoSalario").closest('div').hide();
			} else if ($("#motivoAlteracao").val() == "merito") {
				$("#novaFunc").closest('div').hide();
				$("#aprovaSeguranca").hide();
			}
		}

		/* RH Conferencia */ 
		var isClicked = false;
		
		if ($("#atividade").val() == 21) {
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

			$("#divAnexos, #motivoRejeitado").hide();
			$("#aprovaGerente, #aprovaSeguranca").show();
			$("#pdfArea").show();

			if ($("#checkAprovaGerente").is(":checked")) {
				$("#checkRejeitaGerente").prop("disabled", true);
			} else {
				$("#checkAprovaGerente").prop("disabled", true);
			}

			if ($("#motivoAlteracao").val() == "mudancaFuncao") {
				$("#atualSalario, #novoSalario").closest('div').hide();
			} else if ($("#motivoAlteracao").val() == "merito") {
				$("#novaFunc").closest('div').hide();
				$("#aprovaSeguranca").hide();
			}

			if ($("#checkAprovaSeguranca").is(":checked")) {
				$("#status").val("1");
				$("#checkRejeitaSeguranca").prop("disabled", true);
			} else {
				$("#checkAprovaSeguranca").prop("disabled", true);
			}
		}

	} else if ($("#modoAtividade").val() == "VIEW") {
		$("#divAlertMessage, #divFuncAtual, #divNovaFunc, #divAnexos, #motivoRejeitado, #pdfArea").hide();
		$("#aprovaGerente, #aprovaSeguranca").hide();
	}

	/* Funções gerais */

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
	})

	$("#motivoAlteracao").change(function () {
		if ($(this).val() == "") {
			$("#divFuncIdentity, #divAlertMessage, #divEmail, #divFuncAtual, #divNovaFunc, #divAnexos").hide();
		}
		else if ($(this).val() == "mudancaFuncao") {
			$("#divFuncIdentity, #divAlertMessage, #divEmail, #divFuncAtual, #divNovaFunc, #divAnexos").show();
			$("#novoSalario, #atualSalario").closest('div').hide();
		}
		else if ($(this).val() == "merito") {
			$("#divFuncIdentity, #divAlertMessage, #divEmail, #divFuncAtual, #divNovaFunc").show();
			$("#novoSalario").closest('div').show();
			$("#novaFunc").closest('div').hide();
		}
		else if ($(this).val() == "enquadramento") {
			$("#divFuncIdentity, #divAlertMessage, #divEmail, #divFuncAtual, #divNovaFunc").show();
			$("#novoSalario, #atualSalario").closest('div').show();
			$("#novaFunc").closest('div').show();
		}
		else {
			$("#divFuncIdentity, #divAlertMessage, #divEmail, #divFuncAtual, #divNovaFunc, #divAnexos").show();

			$("#novaFunc, #novoSalario").closest('div').show();
		}

		var valorSelect = $(this).val();
		var texts = textosExplicativos[valorSelect] || '';
		$("#textoSelects").text(texts);
	})

	var textosExplicativos = {
		"mudancaFuncao": "Este formulário altera o cargo e/ou o setor. Não possui alteração salarial.",
		"antecipacao": "Este formulário garante antecipação legal - CCT.",
		"enquadramento": "Este formulário realiza a adequação da faixa salarial e altera a titulação de cargos.",
		"merito": "Este formulário garante o reconhecimento do salário, sem alterar o cargo do colaborador.",
		"promocao": "Este formulário altera o cargo, responsabilidades e salário do colaborador."
	};

	$("#geraPdf").click(function() {
		gerarPdf();
	})

	FLUIGC.popover('.popoverAtestadoSaude', { trigger: 'hover', placement: 'bottom', html: true });
	FLUIGC.popover('.popoverFichaEPI', { trigger: 'hover', placement: 'bottom', html: true });
	FLUIGC.popover('.popoverNovaFunc', { trigger: 'hover', placement: 'bottom', html: true });
	FLUIGC.popover('.popoverCertificadoTreinamento', { trigger: 'hover', placement: 'bottom', html: true });
	FLUIGC.popover('.popoverTermoTreinamento', { trigger: 'hover', placement: 'bottom', html: true });
	FLUIGC.popover('.popoverAvaliaEficacia', { trigger: 'hover', placement: 'bottom', html: true });
});