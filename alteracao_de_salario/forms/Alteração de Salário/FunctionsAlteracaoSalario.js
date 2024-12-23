/* Validação de campos */

function ValidaCampos() {
    var atividade = $("#atividade").val();
    var valida = true;

    if (atividade == 0) {
        if ($("#numChapa").val() == "") {
            $(this).addClass("has-error");

            if (valida == true) {
                valida = false;
                FLUIGC.toast({
                    message: "Campo não preenchido!",   
                    type: "warning"
                })
            }
        }

        if ($("#obraDestino").val() == "") {
            $(this).addClass("has-error");

            if (valida == true) {
                valida = false;
                FLUIGC.toast({
                    message: "Campo não preenchido!",
                    type: "warning"
                })
            }
        }

        if ($("#nomeFunc").val() == "" || $("#atualFunc").val() == "") {
            if (valida == true) {
                valida = false;

                FLUIGC.toast({
                    message: "Número da Chapa informado está incorreto!",
                    type: "warning"
                })
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(this).offset().top - (screen.height * 0.15)
                }, 700);
            }
        }
    }

    return valida;
}

/* Area delimitada para buscar obras e demais informações do funcionário */
function buscarObrasDoUsuario(permissaoGeral = false) {
    return new Promise((resolve, reject) => {
        DatasetFactory.getDataset("colleagueGroup", null, [
            DatasetFactory.createConstraint("groupId", "RH", "RH", ConstraintType.SHOULD),
            DatasetFactory.createConstraint("groupId", "Administrador TI", "Administrador TI", ConstraintType.SHOULD),
            DatasetFactory.createConstraint("colleagueId", $("#solicitante").val(), $("#solicitante").val(), ConstraintType.MUST)
        ], null, {
            success: (grupos => {
                var constraints = [
                    DatasetFactory.createConstraint("usuario", $("#solicitante").val(), $("#solicitante").val(), ConstraintType.MUST)
                ];
                if (grupos.values.length > 0 || permissaoGeral === true) {
                    constraints.push(
                        DatasetFactory.createConstraint("permissaoGeral", "true", "true", ConstraintType.MUST)
                    )
                }
                DatasetFactory.getDataset("BuscaPermissaoColigadasUsuario", null, constraints, null, {
                    success: (CentrosDeCusto => {
                        if (CentrosDeCusto.values.length > 0) {
                            var options = "";
                            var codcoligada = "";
                            CentrosDeCusto.values.forEach(ccusto => {

                                if (codcoligada != ccusto.CODCOLIGADA) {
                                    if (codcoligada != "") {
                                        options += "</optgroup>";
                                    }
                                    options +=
                                        "<optgroup label='" + ccusto.CODCOLIGADA + " - " + ccusto.NOMEFANTASIA + "'>";
                                    codcoligada = ccusto.CODCOLIGADA;
                                }
                                options += "<option value='" + ccusto.CODCOLIGADA + " - " + ccusto.CODCCUSTO + " - " + ccusto.perfil + "'>" + ccusto.CODCCUSTO + " - " + ccusto.perfil + "</option>";
                            });
                            options += "</optgroup>";
                            resolve(options);
                        }
                        else {
                            DatasetFactory.getDataset("colleagueGroup", null, [
                                DatasetFactory.createConstraint("colleagueId", $("#userCode").val(), $("#userCode").val(), ConstraintType.MUST),
                                DatasetFactory.createConstraint("groupId", "Obra", "Obra", ConstraintType.MUST, true),
                            ], null, {
                                success: (ds => {
                                    var options = "";
                                    ds.values.forEach(obra => {
                                        var ds2 = DatasetFactory.getDataset("GCCUSTO", null, [
                                            DatasetFactory.createConstraint("NOME", obra["colleagueGroupPK.groupId"], obra["colleagueGroupPK.groupId"], ConstraintType.MUST)
                                        ], null);
                                        var ccusto = ds2.values[0];

                                        options += "<option value='" + ccusto.CODCOLIGADA + " - " + ccusto.CODCCUSTO + " - " + ccusto.NOME + "'>" + ccusto.CODCCUSTO + " - " + ccusto.NOME + "</option>";
                                    });
                                    resolve(options);
                                }),
                                error: (error => {
                                    FLUIGC.toast({
                                        title: "Erro ao buscar obras: ",
                                        message: error,
                                        type: "warning"
                                    });
                                })
                            });
                        }
                    }),
                    error: (error => {
                        FLUIGC.toast({
                            title: "Erro ao buscar Centros de Custo: ",
                            message: error,
                            type: "warning"
                        });
                    })
                });
            }),
            error: (error => {
                FLUIGC.toast({
                    title: "Erro ao verificar permissões do usuário",
                    message: error,
                    type: "warning"
                });
            })
        });
    });
}

var codCustoGlobal;

function preencherObrasDoUsuario() {
    buscarObrasDoUsuario().then((options) => {
        var obraSelect = $("#obra");
        obraSelect.append(options);
        obraSelect.change(function () {
            var selectedValue = $(this).val();
            codCustoGlobal = selectedValue.split(" - ")[1];
            preencheDadosUsuario(codCustoGlobal);
        });
        preencheDadosUsuario(codCustoGlobal);
    })
        .catch((error) => {
            console.log(error);
        });
}

function preencheDadosUsuario(codCusto) {
    var codCustoo = codCusto;
    return codCustoo;
}

async function selecionaChapa() {
    var chapa = $("#numChapa").val();

    var obra = $("#obra").val();
    var obraNum = obra.split('-');

    var chapa = document.getElementById("numChapa").value;
    obra = obraNum[1].trim();
    var coligada = obraNum[0].trim();

    var c2 = [
        DatasetFactory.createConstraint("chapa", chapa, chapa, ConstraintType.MUST),
        DatasetFactory.createConstraint("obra", obra, obra, ConstraintType.MUST),
        DatasetFactory.createConstraint("coligada", coligada, coligada, ConstraintType.MUST)
    ];

    var dataset = DatasetFactory.getDataset("ds_alteracaoSalarial", null, c2, null);

    if (dataset && dataset.values.length > 0) {
        var nome = dataset.values[0]["nomeFunc"];
        var nomeSetor = dataset.values[0]["nomeSetor"];
        var obra = dataset.values[0]["obra"];
        var nomeFuncao = dataset.values[0]["cargo"];


        if (chapa != "") {
            InsereInfoFuncionario(nome, nomeFuncao, obra, nomeSetor);
        } else {
            FLUIGC.toast({
                title: "Número da chapa não encontrado! ",
                message: "<br><br>Insira um valor válido.",
                type: "warning",
            });
        };
    }

    function InsereInfoFuncionario(nome, nomeFuncao, obra, nomeSetor) {
        $("#nomeFunc").val(nome);
        $("#atualFunc").val(nomeFuncao);
        $("#obraOrigem").val(obra + " - " + nomeSetor);
    }
}

function LimpaCampos() {
    $("#nomeFunc, #atualFunc, #obraOrigem, #atualSalario").val("");
}
/* Funções de preenchimento dos demais inputs */

function preencherObrasDestino() {
    buscarObrasDoUsuario().then((options) => {
        var selectElem = $("#obraDestino");
        selectElem.append(options);
        selectElem.change(function () {
            var selectedVal = $(this).val();
            codCustoGlobal = selectedVal.split(" - ")[1];
            preencheDadosUsuario(codCustoGlobal);
        });
        preencheDadosUsuario(codCustoGlobal);
    }).catch((error) => {
        console.log(error);
    })
}

function carregaFuncoes() {
    var obra = $("#obra").val();
    var obraNum = obra.split('-');

    var coligada = obraNum[0].trim();
    var constrCol = DatasetFactory.createConstraint("coligada", coligada, coligada, ConstraintType.MUST);
    var constraints = new Array(constrCol);

    var funcao = $("#novaFunc").val();
    var dsFuncao = DatasetFactory.getDataset("FuncaoRM", null, constraints, null);
    $("#novaFunc").empty();

    $.each($(dsFuncao.values), function (k, v) {
        var option = $("<option></option>");
        option.attr("value", v.nome).text(v.nome);
        if (v.nome == funcao) {
            option.attr("selected", true);
        }
        $("#novaFunc").append(option);
    })
}

/* Area delimitada para criação dos anexos do processo */
function CriaDocFluig(idInput, i = 0) {
    var files = $("#" + idInput)[0].files;
    var reader = new FileReader();

    var fileName = "";
    fileName = files[i].name;

    reader.onload = function (e) {
        var bytes = e.target.result.split("base64,")[1];
        var folderId;

        if (idInput === 'inputFileAtestadoSaude') {
            // folderId = 20632; //Dev
            folderId = 1314650; //Prod
        } else if(idInput === 'inputFileFichaEPI') {
            // folderId = 20633; //Dev
            folderId = 1314656; //Prod
        } else if(idInput === 'inputFileOSNovaFunc') {
            // folderId = 20634; //Dev
            folderId = 1314658; //Prod
        } else if(idInput === 'inputFileTreinoNovaFunc') {
            // folderId = 20635; //Dev
            folderId = 1314653; //Prod
        } else if(idInput === 'inputFileTermoTreino') {
            // folderId = 20636; //Dev
            folderId = 1314659; //Prod
        } else if(idInput === 'inputFileAvaliaEficacia') {
            // folderId = 20637; //Dev
            folderId = 1314652; //Prod
        } else {
            console.error("Pasta não definida!");
            return;
        }

        DatasetFactory.getDataset("CriacaoDocumentosFluig", null, [
            DatasetFactory.createConstraint("processo", $("#numProcess").val(), $("#numProcess").val(), ConstraintType.MUST),
            DatasetFactory.createConstraint("conteudo", bytes, bytes, ConstraintType.MUST),
            DatasetFactory.createConstraint("nome", fileName, fileName, ConstraintType.SHOULD),
            DatasetFactory.createConstraint("descricao", fileName, fileName, ConstraintType.SHOULD),
            DatasetFactory.createConstraint("pasta", folderId, folderId, ConstraintType.SHOULD) //Dev
        ], null, {
            success: function (dataset) {
                if (!dataset || dataset == "" || dataset == null) {
                    throw "Houve um erro na comunicação com o webservice de criação de documentos. Tente novamente!";
                } else {
                    if (dataset.values[0][0] == "false") {
                        throw "Erro ao criar arquivo. Favor entrar em contato com o administrador do sistema. Mensagem: " + dataset.values[0][1];
                    } else {
                        console.log(dataset.values[0].Resultado);
                    }

                    if ($("#idDoc" + idInput.split("inputFile")[1]).val() == null || $("#idDoc" + idInput.split("inputFile")[1]).val() == "") {//Se esta sendo anexado somente um documento
                        $("#idDoc" + idInput.split("inputFile")[1]).val(dataset.values[0].Resultado);

                        console.log(idInput.split("inputFile")[1]);

                    } else {//Se mais de um documento esta sendo anexado concatena no input os IDs dos documentos
                        $("#idDoc" + idInput.split("inputFile")[1]).val($("#idDoc" + idInput.split("inputFile")[1]).val() + "," + dataset.values[0].Resultado);
                    }

                    if (files.length > i + 1) {//Se tem mais documentos para anexar chama a funcao novamente passando o proximo documento
                        dataset.values[0].Resultado += "," + CriaDocFluig(idInput, i + 1);
                    }
                    else {
                        if (i > 0) {
                            $("#" + idInput)
                                .siblings("div")
                                .html((i + 1) + " Documentos");
                        } else {
                            $("#" + idInput).siblings("div").html(fileName);
                        }
                    }
                }
            },
            error: function (error) {
                console.error("Erro ao criar documento no Fluig: " + error);
                $(this).siblings("div").html("Nenhum arquivo selecionado");
                throw error;
            }
        });
    };

    reader.readAsDataURL(files[i]);
}

/* Gera pdf do processo */

function gerarPdf() {
    var options = {
        orientation: 'p',
        precision: 90,
        margins: {
            top: 5,
            right: 10,
            left: 10,
            left: 5,
        },
        unit: 'mm',
    }

    var doc = new jsPDF(options);
    var nome = $("#nomeFunc").val();

    doc.text("Relatório Alteração Salarial", 105, 10, options = { align: 'center' });
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    const motivo = $("#initForm #motivoAlteracao");
    const optionSelect = [];

    motivo.each(function () {
        const optionMotivo = $(this).find('option:selected').text().trim();

        optionSelect.push([optionMotivo]);
    })

    motivoColumns = ['valor'];

    doc.autoTable(motivoColumns, optionSelect, {
        theme: 'grid',
        head: [['Motivo de Alteração']],
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
            fontSize: 14,
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
            cellWidth: number = 180,
            fontSize: 12,
        },
        startY: 30,
    })

    /* ============================ */
    /* Identificação do Colaborador */

    const identityFunc = $("#divFuncIdentity .panel-body .row div");
    const data = [];

    identityFunc.each(function () {
        const labels = $(this).find('label').text().trim();
        const inputs = $(this).find('input').val();
        const options = $(this).find('option:selected').text().trim();

        data.push([labels, inputs || options]);
    });

    const identifyColumns = ['label', 'valor'];

    doc.autoTable(identifyColumns, data, {
        theme: 'grid',
        head: [['Identificação do Colaborador']],
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
            fontSize: 14,
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
            cellWidth: number = 90,
        },
        startY: 55,
    })

    /* ============================ */
    /* Situação Atual */

    const actualFunc = $("#divFuncAtual .panel-body div");
    const funcData = [];

    actualFunc.each(function () {
        const labels = $(this).find('label').text().trim();
        const inputs = $(this).find('input').val();
        const options = $(this).find('option:selected').text().trim();

        funcData.push([labels, inputs || options]);
    });

    const funcColumns = ['label', 'valor'];

    doc.autoTable(funcColumns, funcData, {
        theme: 'grid',
        head: [['Situação Atual']],
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
            fontSize: 14,
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
            cellWidth: number = 90,
        },
        startY: 95,
    })

    /* ============================ */
    /* Situação Proposta */


    const novaFunc = $("#divNovaFunc .panel-body div");
    const novaFuncData = [];

    novaFunc.each(function () {
        const labels = $(this).find('label').text().trim();
        const inputs = $(this).find('input').val();
        const options = $(this).find('option:selected').text().trim();

        novaFuncData.push([labels, inputs || options]);
    });

    const novaDataColumns = ['label', 'valor'];

    doc.autoTable(novaDataColumns, novaFuncData, {
        theme: 'grid',
        head: [['Situação Proposta']],
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
            fontSize: 14,
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
            cellWidth: number = 90,
        },
        startY: 135,
    })

    /* ============================ */
    /* Aprovação Gerente */

    const aprovaGerente = $("#aprovaGerente .panel-body div");
    const gerenteData = [];

    aprovaGerente.each(function () {
        const inputs = $(this).find('input');

        if (inputs.is(':checkbox')) {
            const gerenteCheck = inputs.prop('checked') ? 'Aprovado' : 'Reprovado';

            if (!gerenteData.some(data => data[0])) {
                gerenteData.push([gerenteCheck]);
            }
        }
    })

    const gerenteColumns = ['valor'];

    doc.autoTable(gerenteColumns, gerenteData, {
        theme: 'grid',
        head: [['Aprovação Gerente']],
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
            fontSize: 14,
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
            cellWidth: number = 180,
            fontSize: 12,
        },
        startY: 175,
    })

    /* ============================ */
    /* Aprovação SMS */

    const selectedMotivo = $("#motivoAlteracao").val();

    const allowed = ['mudancaFuncao', 'antecipacao', 'promocao'];

    if (allowed.includes(selectedMotivo)) {
        const aprovaSeguranca = $("#aprovaSeguranca .panel-body div");
        const segurancaData = [];

        aprovaSeguranca.each(function () {
            const inputs = $(this).find('input');

            if (inputs.is(':checkbox')) {
                const segurancaCheck = inputs.prop('checked') ? 'Aprovado' : 'Reprovado';

                if (!segurancaData.some(data => data[0])) {
                    segurancaData.push([segurancaCheck]);
                }
            }
        })

        const segurancaColumns = ['valor'];

        doc.autoTable(segurancaColumns, segurancaData, {
            theme: 'grid',
            head: [['Aprovação SMS']],
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
                fontSize: 14,
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
                cellWidth: number = 180,
                fontSize: 12,
            },
            startY: 200,
        })
    }

    doc.save("ALTERAÇÃO SALARIAL - " + nome + ".pdf");

    /* faz o upload do pdf dentro de pasta */
    var fileName = 'ALTERAÇÃO SALARIAL - ' + nome + '.pdf';

    fetch(`/api/public/2.0/contentfiles/upload/?fileName=${fileName}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
            },
            cache: "no-cache",
            body: doc.output('blob')
        }
    ).then(function (response) {
        if (!response.ok) {
            throw "Erro ao enviar o arquivo";
        }

        /* Cria o documento dentro do Fluig */

    }).then(async function () {
        let document = {
            companyId: window.parent.WCMAPI.organizationId,
            description: fileName,
            immutable: true,
            parentId: 1314664,
            // parentId: 19770,
            isPrivate: false,
            downloadEnabled: true,
            attachments: [{
                fileName: fileName,
            }],
        };

        const response = await fetch(
            "/api/public/ecm/document/createDocument",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                cache: "no-cache",
                body: JSON.stringify(document)

            }
        );
        if (!response.ok) {
            throw "Erro ao Salvar documento na Pasta Indicada";
        }
        /* Atribui o pdf ao idDoc para ser salvo no sistema */

        const response_1 = await response.json();
        const idPdf = response_1.content;
        const inputDocPdf = $("#idDocRelatorio");

        if (idPdf) {
            inputDocPdf.val(idPdf.id);
        } else {
            console.error("Erro ao salvar JSON");
        }

        return response_1.content;
    })
}