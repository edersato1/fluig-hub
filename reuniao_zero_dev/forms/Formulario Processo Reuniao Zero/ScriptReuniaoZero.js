/* Identificação atividades */

/* 
4 - Licitações
5 - Gestão Corporativa
6 - Controladoria
7 - Engenheiro
8 - Planejamento
9 - Suprimentos/Compras
10 - SST
11 - Meio Ambiente
12 - T.I.
13 - Contábil
15 - Central de Equipamentos
53 - Qualidade
59 - Gestão Corporativa
51 - Fim

*/
myLoading1 = null;

$(document).ready(function () {
    myLoading1 = FLUIGC.loading(window, {
        textMessage: "Pastas da obra sendo criadas, por favor aguarde...",
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

    checkAtividade9();
    checkAtividade12();
    // sessionStorage.clear();
    // localStorage.clear();

    console.clear();

    if ($("#modoAtividade").val() == "ADD") {

        if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 4) {
            $("#geraPdf").hide();
            $("#suprimentos").hide();
            $("#controladoria").hide();
            $("#contabilidade").hide();
            $("#segurancaTrabalho").hide();
            $("#ti").hide();
            $("#centralEquipments").hide();
            $("#meioAmbiente").hide();

            $("#tableApresentaObra").collapse({
                toggle: false
            });
            $("#spanSelectRegional").hide();
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();

            CarregaListaDeRegionais();
        }

        $("#inicioObra").change(function () {
            var valorIniciObra = $(this).val();
            $("#dataPrevInicio").val(valorIniciObra);
        });

        $("#fimObra").change(function () {
            var valorFimObra = $(this).val();
            $("#dataPrevFinal").val(valorFimObra);
        });

        $('#inicioObra, #prazoExecucao').on('input', function () {
            var startDate = $('#inicioObra').val();
            var daysText = $('#prazoExecucao').val();
            var days = parseInt(daysText);

            if (startDate && !isNaN(days)) {
                var dateParts = startDate.split('/');
                var day = parseInt(dateParts[0]);
                var month = parseInt(dateParts[1]) - 1;
                var year = parseInt(dateParts[2]);

                var date = new Date(year, month, day);

                date.setDate(date.getDate() + days);

                // Formata a data de resultado para dd/mm/yyyy
                var resultDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();

                $('#fimObra').val(resultDate);
            }
        });

        FLUIGC.calendar("#baseData");
        FLUIGC.calendar("#inicioObra");
        FLUIGC.calendar("#fimObra", { showToday: false });

        $('#estimativaResultado, #issPrevia, #percentCastilho').mask('##0,00%', { reverse: true });
        $('#valorContrato').mask("#.##0,00", { reverse: true });
    }
    else if ($("#modoAtividade").val() == "MOD") {

        /* Atividades ==> Gestão Corporativa ||  Planejamento || */
        if ($("#atividade").val() == 5 || $("#atividade").val() == 8) {
            $("#quadroTecnico").show();

            $("#geraPdf").hide();
            $("#suprimentos").hide();
            $("#controladoria").hide();
            $("#contabilidade").hide();
            $("#segurancaTrabalho").hide();
            $("#ti").hide();
            $("#centralEquipments").hide();
            $("#meioAmbiente").hide();

            $("#tableApresentaObra").collapse({
                toggle: false
            });

            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();
        }

        /* Controladoria */
        else if ($("#atividade").val() == 6) {
            $("#quadroTecnico").show();
            $("#controladoria").show();


            $("#tableApresentaObra, #tableControladoria").collapse({
                toggle: false
            });

            $("#geraPdf").hide();
            $("#suprimentos").hide();
            $("#contabilidade").hide();
            $("#segurancaTrabalho").hide();
            $("#ti").hide();
            $("#centralEquipments").hide();
            $("#meioAmbiente").hide();

            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();

        }

        /* Engenheiro */
        else if ($("#atividade").val() == 7) {
            $("#quadroTecnico").show();

            $('#tableApresentaObra, #tableSuprimentos, #tableControladoria, #tableContabilidade, #tableSegurancaTrabalho, #tableTi, #tableCentralEquipments, #tableMeioAmbiente').collapse({
                toggle: false
            });

            $('.hideDivCanteiro, .hideDivCanteiroMicro, .hideDivCombust').hide();
            $("#geraPdf").hide();
            $("#criaPasta").hide();
            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $("#suprimentos").addClass("panel panel-primary");

            var isClicked = false;

            $("#botaoSalvar").click(function () {
                $("#saveButton, #saveButtonVeiculo, #saveButtonContabilidade, #saveButtonTi, #saveButtonEquipamento").click();
                $("#saveButtonBetuminoso, #saveButtonAco, #saveButtonDiesel, #saveButtonAgregado, #saveButtonEpi, #saveButtonEpc, #saveButtonLaboratorio").click();

                isClicked = true;
                const validateForm = validaCampos();
                
                
                
                if (validateForm) {
                    FLUIGC.toast({
                        title: "Informações salvas com sucesso! ",
                        message: "<br><br>Confira as informações salvas antes de avançar",
                        type: "success",
                    })
                    // Carrega o botão de enviar, apenas depois de clicar em salvar
                    window.parent.$("#workflowActions").show();
                } else {
                    FLUIGC.toast({
                        title: "Informações incorretas ou não preenchidas! ",
                        message: "<br><br>Confira as informações adicionadas antes de avançar",
                        type: "warning",
                    })
                    
                    // Se estiver errado, apenas será gerado o botão de enviar/salvar com o correto preenchimento
                    window.parent.$("#workflowActions").hide();
                }

                $("#status").val("1");
            });

            if (!isClicked) {
                window.parent.$("#workflowActions").hide();
            }
            SalvaTableContabil();
            SalvaTableEquipamentos();
            SalvaTableSuprimentos();
            SalvaTableVeiculo();
            SalvaTableTi();

            SalvaTableBetuminoso();
            SalvaTableAco();
            SalvaTableDiesel();
            SalvaTableAgregado();
            SalvaTableEpi();
            SalvaTableEpc();
            SalvaTableLaboratorio();
            validaCampos();

            $("#saveButton, #saveButtonVeiculo, #saveButtonBetuminoso, #saveButtonContabilidade, #saveButtonTi, #saveButtonEquipamento").hide();
            $("#saveButtonBetuminoso, #saveButtonAco, #saveButtonDiesel, #saveButtonAgregado, #saveButtonEpi, #saveButtonEpc, #saveButtonLaboratorio").hide();

            if ($("#status").val() == "1") {
                EditaTableSuprimentos();
                EditaTableTi();
    
                EditaTableBetuminoso();
                EditaTableAco();
                EditaTableDiesel();
                EditaTableAgregado();
                EditaTableEpc();
                EditaTableEpi();
                EditaTableLaboratorio();

                MostraTableVeiculo();
                MostraTableBetuminoso();
                MostraTableAco();
                MostraTableDiesel();
                MostraTableAgregado();
                MostraTableEpc();
                MostraTableEpi();
                MostraTableLaboratorio();
                MostraTableContabil();
                MostraTableEquipamento();

                validaCampos();
            }
        }

        /* Compras */
        else if ($("#atividade").val() == 9) {
            $("#quadroTecnico").show();
            $("#suprimentos").show();

            $("#tableSuprimentos, #tableApresentaObra").collapse({
                toggle: false
            });

            $("#geraPdf").hide();
            $("#controladoria").hide();
            $("#contabilidade").hide();
            $("#segurancaTrabalho").hide();
            $("#ti").hide();
            $("#centralEquipments").hide();
            $("#meioAmbiente").hide();
            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));

            EditaTableSuprimentos();
            MostraTableVeiculo();

            MostraTableBetuminoso();
            MostraTableAco();
            MostraTableDiesel();
            MostraTableAgregado();
            MostraTableEpc();
            MostraTableEpi();
            MostraTableLaboratorio();

            $("#suprimentos").addClass("panel panel-primary");
            $("#saveButton, #saveButtonVeiculo").hide();
            $("#saveButtonBetuminoso, #saveButtonAco, #saveButtonDiesel, #saveButtonAgregado, #saveButtonEpi, #saveButtonEpc, #saveButtonLaboratorio").hide();
            $("#adicionaVeiculo, #adicionaBetuminoso, #adicionaAco, #adicionaDiesel, #adicionaAgregado, #adicionaEpi, #adicionaEpc, #adicionaLaboratorio").hide();
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();

        }

        /* SST */
        else if ($("#atividade").val() == 10) {
            $("#quadroTecnico").show();
            $("#segurancaTrabalho").show();

            $("#tableSegurancaTrabalho, #tableApresentaObra").collapse({
                toggle: false
            })

            $("#geraPdf").hide();
            $("#contabilidade").hide();
            $("#controladoria").hide();
            $("#suprimentos").hide();
            $("#ti").hide();
            $("#centralEquipments").hide();
            $("#meioAmbiente").hide();
            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();
        }

        /* Meio Ambiente */
        else if ($("#atividade").val() == 11) {
            $("#meioAmbiente").show();

            $("#tableMeioAmbiente, #tableApresentaObra").collapse({
                toggle: false
            })

            $("#geraPdf").hide();
            $("#controladoria").hide();
            $("#contabilidade").hide();
            $("#suprimentos").hide();
            $("#ti").hide();
            $("#centralEquipments").hide();
            $("#segurancaTrabalho").hide();
            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $(".inputSlider").hide();

            $('.hideDivCanteiro, .hideDivCanteiroMicro, .hideDivCombust').hide();
            $("#enginnerBtn").hide();
        }

        /* T.I. */
        else if ($("#atividade").val() == 12) {
            $("#quadroTecnico").show();
            $("#ti").show();

            $("#tableTi, #tableApresentaObra").collapse({
                toggle: false
            })

            $("#geraPdf").hide();
            $("#contabilidade").hide();
            $("#controladoria").hide();
            $("#segurancaTrabalho").hide();
            $("#suprimentos").hide();
            $("#meioAmbiente").hide();
            $("#centralEquipments").hide();
            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $("#saveButtonTi").hide();
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();

            EditaTableTi();
        }

        /* Contabilidade */
        else if ($("#atividade").val() == 13) {
            $("#quadroTecnico").show();
            $("#contabilidade").show();

            $("#tableContabilidade, #tableApresentaObra").collapse({
                toggle: false
            })

            $("#geraPdf").hide();
            $("#ti").hide();
            $("#controladoria").hide();
            $("#suprimentos").hide();
            $("#segurancaTrabalho").hide();
            $("#centralEquipments").hide();
            $("#meioAmbiente").hide();
            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $("#adicionaContabilidade, #saveButtonContabilidade").hide();
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();

            MostraTableContabil();
        }

        /* Central de Equipamentos */
        else if ($("#atividade").val() == 15) {
            $("#quadroTecnico").show();
            $("#centralEquipments").show();


            $("#tableCentralEquipments, #tableApresentaObra").collapse({
                toggle: false
            });

            $("#geraPdf").hide();
            $("#suprimentos").hide();
            $("#contabilidade").hide();
            $("#controladoria").hide();
            $("#segurancaTrabalho").hide();
            $("#ti").hide();
            $("#meioAmbiente").hide();
            $("#regionalObra").hide();
            $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $("#adicionaEquipamento, #saveButtonEquipamento").hide();
            $(".inputSlider").hide();
            $("#enginnerBtn").hide();

            MostraTableEquipamento();
        }

        /* Qualidade */
        else if ($("#atividade").val() == 53) {
            $("#quadroTecnico").show();

            $('#tableApresentaObra, #tableSuprimentos, #tableControladoria, #tableContabilidade, #tableSegurancaTrabalho, #tableTi, #tableCentralEquipments, #tableMeioAmbiente').collapse({
                toggle: false
            });

            $("#geraPdf").hide();
            $("#criaPasta").hide();
            $("#regionalObra").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));

            EditaTableSuprimentos();
            EditaTableTi();

            EditaTableBetuminoso();
            EditaTableAco();
            EditaTableDiesel();
            EditaTableAgregado();
            EditaTableEpc();
            EditaTableEpi();
            EditaTableLaboratorio();

            SalvaTableSuprimentos();
            SalvaTableVeiculo();
            SalvaTableTi();
            SalvaTableContabil();
            SalvaTableEquipamentos();

            $("#botaoSalvar").click(function () {
                $("#saveButton, #saveButtonVeiculo, #saveButtonContabilidade, #saveButtonTi, #saveButtonEquipamento").click();
                $("#saveButtonBetuminoso, #saveButtonAco, #saveButtonDiesel, #saveButtonAgregado, #saveButtonEpi, #saveButtonEpc, #saveButtonLaboratorio").click();
            });

            $("#suprimentos").addClass("panel panel-primary");
            $(".inputSlider").hide();
            $("#saveButton, #saveButtonVeiculo, #saveButtonContabilidade, #saveButtonTi, #saveButtonEquipamento").hide();
            $("#saveButtonBetuminoso, #saveButtonAco, #saveButtonDiesel, #saveButtonAgregado, #saveButtonEpi, #saveButtonEpc, #saveButtonLaboratorio").hide();

            $('#botaoSalvar').text('Editar Informações');

            MostraTableEquipamento();
            MostraTableContabil();
            MostraTableVeiculo();

            MostraTableBetuminoso();
            MostraTableAco();
            MostraTableDiesel();
            MostraTableAgregado();
            MostraTableEpc();
            MostraTableEpi();
            MostraTableLaboratorio();
        }

        /* Gestão Corporativa */
        else if ($("#atividade").val() == 59) {
            $("#quadroTecnico").show();
            $("#geraPdf").show();

            $('#tableApresentaObra, #tableSuprimentos, #tableControladoria, #tableContabilidade, #tableSegurancaTrabalho, #tableTi, #tableCentralEquipments, #tableMeioAmbiente').collapse({
                toggle: false
            });

            ;
            $("#criaPasta").hide();
            $("#regionalObra").hide();
            $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").val()));
            $("#enginnerBtn").hide();

            MostraTableEquipamento();
            MostraTableTi();
            MostraTableSuprimentos();
            MostraTableContabil();

            MostraTableBetuminoso();
            MostraTableAco();
            MostraTableDiesel();
            MostraTableAgregado();
            MostraTableEpc();
            MostraTableEpi();
            MostraTableLaboratorio();

            $("#saveButton #saveButtonVeiculo, #saveButtonContabilidade, #saveButtonTi, #saveButtonEquipamento").hide();

            $("#adicionaVeiculo, #adicionaContabilidade, #adicionaEquipamento, #adicionaBetuminoso, #adicionaAco, #adicionaDiesel, #adicionaAgregado, #adicionaEpi, #adicionaEpc, #adicionaLaboratorio").hide();
            $("#saveButton, #saveButtonBetuminoso, #saveButtonAco, #saveButtonDiesel, #saveButtonAgregado, #saveButtonEpi, #saveButtonEpc, #saveButtonLaboratorio, #saveButtonVeiculo").hide();
            $("#suprimentos").addClass("panel panel-primary");
            $("#enginnerBtn").hide();
        }

        /* Insere os valores dos campos em outro campo */
        $("#CCusto").on('input', function () {
            var valorInput = $(this).val();
            $("#centroCusto").val(valorInput);
        });

        FLUIGC.calendar("#dataPrevInicio");
        FLUIGC.calendar("#dataPrevFinal");

        $('#cep').mask('00000-000');
        $('#cnpj').mask('00.000.000/0000-00', { reverse: true });
        $('#CCusto').mask('0.0.000');
    }

    else if ($("#modoAtividade").val() == "VIEW") {
        console.clear();
        $("#pdfArea").hide();
        $("#suprimentos").hide();
        $("#contabilidade").hide();
        $("#controladoria").hide();
        $("#segurancaTrabalho").hide();
        $("#ti").hide();
        $("#centralEquipments").hide();
        $(".inputSlider").hide();
        $("#meioAmbiente").hide();
        $("#enginnerBtn").hide();


        $("#tableApresentaObra").collapse({
            toggle: false
        });

        $("#tableApresentaObra .row:nth-child(2)").css("display", "none");
        $("#tableApresentaObra .row:nth-child(3)").css("display", "none");
        $("#tableApresentaObra .row:nth-child(4)").css("display", "none");
        $("#emailCoordenador, #emailEncarregado, #emailEngenheiro, #emailGerente").hide();
        $("#regionalObra").hide();
        $("#spanSelectRegional").show();
        $("#spanSelectRegional").text(RetornaDescriçãoDoDocumentoPorId($("#regionalObra").text()));

        FLUIGC.switcher.init('#consorcioSwitch');
    }

    $('#geraPdf').click(function () {

        FLUIGC.toast({
            title: 'PDF sendo gerado <br>',
            message: 'Por favor, aguarde!',
            type: 'info',
        });

        setTimeout(async () => {
            gerarPDF();
            console.log('gerou pdf');

            FLUIGC.toast({
                title: 'PDF gerado com sucesso <br>',
                message: '',
                type: 'success',
            });
        }, 5000);
    })

    /* Tabela Suprimentos */
    $('#adicionaVeiculo').click(function () {
        linhaTableSuprimentos();
    })

    $('#adicionaBetuminoso').click(function () {
        linhaTableBetuminoso();
    })
    $('#adicionaAco').click(function () {
        linhaTableAco();
    })
    $('#adicionaDiesel').click(function () {
        linhaTableDiesel();
    })
    $('#adicionaAgregado').click(function () {
        linhaTableAgregado();
    })
    $('#adicionaEpi').click(function () {
        linhaTableEpi();
    })
    $('#adicionaEpc').click(function () {
        linhaTableEpc();
    })
    $('#adicionaLaboratorio').click(function () {
        linhaTableLaboratorio();
    })

    if ($("#atividade").val() == 53) {
        $('#adicionaBetuminoso').off('click');
        $('#adicionaAco').off('click');
        $('#adicionaDiesel').off('click');
        $('#adicionaAgregado').off('click');
        $('#adicionaEpi').off('click');
        $('#adicionaEpc').off('click');
        $('#adicionaLaboratorio').off('click');

        $('#adicionaBetuminoso').click(function () {
            linhaEditaBetuminoso();
        })
        $('#adicionaAco').click(function () {
            linhaEditaAco();
        })
        $('#adicionaDiesel').click(function () {
            linhaEditaDiesel();
        })
        $('#adicionaAgregado').click(function () {
            linhaEditaAgregado();
        })
        $('#adicionaEpi').click(function () {
            linhaEditaEpi();
        })
        $('#adicionaEpc').click(function () {
            linhaEditaEpc();
        })
        $('#adicionaLaboratorio').click(function () {
            linhaEditaLaboratorio();
        })
    }
    /* Tabela Contabilidade */
    $('#adicionaContabilidade').click(function () {
        linhaTableContabil();
        $('#extensao, #aliquotaIss').mask('##0,00%', { reverse: true });
        $("#CNPJContabil").mask('00.000.000/0000-00', { reverse: true });

        $("#CNPJContabil").cleanVal();
    })
    /* Tabela Central de Equipamentos */
    $('#adicionaEquipamento').click(function () {
        linhaTableEquip();
    })


    $('#insumosObra').find('tbody').on("change", 'input[type="checkbox"]', function () {
        if ($(this).is(':checked')) {
            $(this).closest('tr').find('input[type="text"]').removeAttr('readonly');
        } else {
            $(this).closest('tr').find('input[type="text"]').attr('readonly', 'readonly');
        }

        if ($('input[type="checkbox"]:not(:checked)')) {
            $(this).closest('tr').find('input[type="text"]').val("");
        }

        checkAtividade9();
    })

    $('#equipamentosTi').find('tbody').on("change", 'input[type="checkbox"]', function () {
        if ($(this).is(':checked')) {
            $(this).closest('tr').find('input[type="text"]').removeAttr('readonly');
        } else {
            $(this).closest('tr').find('input[type="text"]').attr('readonly', 'readonly');
        }

        if ($('input[type="checkbox"]:not(:checked)')) {
            $(this).closest('tr').find('input[type="text"]').val("");
        }

        checkAtividade12();
    })

    function checkAtividade9() {
        if ($("#atividade").val() == 9) {
            $('input[type="checkbox"]:not(:checked)').each(function () {
                $(this).closest('tr').find('input[type="text"]').val("");
                $(this).closest('tr').css("display", "none");
            });

            $('input[type="checkbox"]:checked').each(function () {
                $(this).closest('tr').find('input[type="checkbox"]:checked').css("display", "none");
            });
        }
    }

    function checkAtividade12() {
        if ($("#atividade").val() == 12) {
            $('input[type="checkbox"]:not(:checked)').each(function () {
                $(this).closest('tr').find('input[type="text"]').val("");
                $(this).closest('tr').css("display", "none");
            });

            $('input[type="checkbox"]:checked').each(function () {
                $(this).closest('tr').find('input[type="checkbox"]:checked').css("display", "none");
            });
        }
    }


    $("#insumosObra").find('tbody tr').each(function () {
        $(this).find('[id^=inicioConsumo]').each(function () {
            var inputCalendar = this.id.match(/^inicioConsumo/)[0];

            if (inputCalendar === 'inicioConsumo') {
                FLUIGC.calendar(this);
            }
        });
    });

    $('#tableApresentaObra, #tableSuprimentos, #tableControladoria, #tableSegurancaTrabalho, #tableTi, #tableCentralEquipments, #tableMeioAmbiente').collapse({
        toggle: true
    });

    /* Switcher do Consorcio */
    FLUIGC.switcher.init('#consorcioSwitch, #fgtsSwitch, #meioAmbienteSwitch');

    FLUIGC.switcher.onChange($('#consorcioSwitch'), function (event, state) {
        if (state) {
            $(".inputSlider").toggle(this.checked);
            $(".inputSlider").show();

        } else {
            $(".inputSlider").hide();
        }
    })


    /* Meio Ambiente Switchers */
    FLUIGC.switcher.init('#licencaSupressaoSwitch, #motoserraSwitch, #mobDesmobSwitch, #inOutDomainSwitch, #oficinaSwitch, #unidadeTanqueSwitch, #usinaAsfaltoSwitch, #usinaConcretoSwitch, #botaforaSoloSwitch, #caixaEmprestimoSwitch, #botaForaFresaSwitch, #captaAguaSwitch, #fumacaSwitch, #switchInstalaCanteiro, #switchCanteiroMicro, #switchTanqueCombust');
    FLUIGC.switcher.init('#usinaConcretoSwitch, #botaforaSoloSwitch, #caixaEmprestimoSwitch, #botaForaFresaSwitch, #captaAguaSwitch, #fumacaSwitch, #switchInstalaCanteiro, #switchCanteiroMicro, #switchTanqueCombust');

    /* Meio Ambiente - Item 4 */
    FLUIGC.switcher.onChange($('#switchInstalaCanteiro'), function (event, state) {
        if (state) {
            $('.hideDivCanteiro').show();
        } else {
            $('.hideDivCanteiro').hide();
        }
    })

    /* Meio Ambiente - Item 5 e subsequentes */
    FLUIGC.switcher.onChange($('#switchCanteiroMicro'), function (event, state) {
        if (state) {
            $('.hideDivCanteiroMicro').show();
        } else {
            $('.hideDivCanteiroMicro').hide();
        }
    })

    /* Meio Ambiente - Item 7 */
    FLUIGC.switcher.onChange($('#switchTanqueCombust'), function (event, state) {
        if (state) {
            $('.hideDivCombust').show();
        } else {
            $('.hideDivCombust').hide();
        }
    })

    /* Criação de pasta e inserção de regras */
    $("#criaPasta").on("click", function () {

        if (($("#idPastaObra").val() == null || $("#idPastaObra").val() == "")) {
            var nomeObra = $("#nomeObra").val();

            myLoading1.show();
            setTimeout(async () => {
                await CriaPastasDaObra();

                FLUIGC.toast({
                    message: "Pastas da obra " + nomeObra + " criadas com sucesso!",
                    type: "success",
                })
                myLoading1.hide();
                // AplicaPermissaoNasPastaParaAObra();
                console.log('Criou pasta');
            }, 3400);
        }
    })

    $('#coligada').change(function () {
        var selectedOption = $("#coligada option:selected").text();
        $("#coligadaSpan").val(selectedOption);

        CarregaListaDeRegionais();
    })
})