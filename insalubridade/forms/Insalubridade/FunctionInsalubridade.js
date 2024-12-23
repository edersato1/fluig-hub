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
        var nomeFuncao = dataset.values[0]["cargo"];
        var nomeSetor = dataset.values[0]["nomeSetor"];
        var descricaoCargo = dataset.values[0]["descricaoCargo"];


        if (chapa != "") {
            InsereInfoFuncionario(nome, nomeFuncao, nomeSetor, descricaoCargo);
        }
    }

    function InsereInfoFuncionario(nome, nomeFuncao, nomeSetor, descricaoCargo) {
        $("#nomeFunc").val(nome);
        $("#atualFunc").val(nomeFuncao);
        $("#setor").val(nomeSetor);
        $("#descricao").val(descricaoCargo);
    }
}

function LimpaCampos() {
    $("#nomeFunc, #atualFunc, #setor, #descricao, #setorEspecifico").val("");
}

function CriaDocFluig(idInput, i = 0) {
    var files = $("#" + idInput)[0].files;
    var reader = new FileReader();
    var fileName = "";
    fileName = files[i].name;

    reader.onload = function (e) {
        var bytes = e.target.result.split("base64,")[1];
        DatasetFactory.getDataset("CriacaoDocumentosFluig", null, [
            DatasetFactory.createConstraint("processo", $("#numProcess").val(), $("#numProcess").val(), ConstraintType.MUST),
            DatasetFactory.createConstraint("conteudo", bytes, bytes, ConstraintType.MUST),
            DatasetFactory.createConstraint("nome", fileName, fileName, ConstraintType.SHOULD),
            DatasetFactory.createConstraint("descricao", fileName, fileName, ConstraintType.SHOULD),
            DatasetFactory.createConstraint("pasta", 1314670, 1314670, ConstraintType.SHOULD) //Desenv
        ], null, {
            success: function (dataset) {
                if (!dataset || dataset == "" || dataset == null) {
                    throw "Houve um erro na comunicação com o webservice de criação de documentos. Tente novamente!";
                } else {
                    if (dataset.values[0][0] == "false") {
                        throw "Erro ao criar arquivo. Favor entrar em contato com o administrador do sistema. Mensagem: " + dataset.values[0][1];
                    } else {
                        console.log("### GEROU docID = " + dataset.values[0].Resultado);

                        if (idInput == "myFile") {//Se o documento que está sendo anexado seja o contrato
                            $("#idDocContrato").val(dataset.values[0].Resultado);
                            ValidaTerminoTabContrato(true);
                        } else if ($("#idDoc" + idInput.split("inputFile")[1]).val() == null || $("#idDoc" + idInput.split("inputFile")[1]).val() == "") {//Se esta sendo anexado somente um documento
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
                }
            },
            error: function (error) {
                console.log("Erro ao criar documento no Fluig: " + error);
                $(this).siblings("div").html("Nenhum arquivo selecionado");
                throw error;
            }
        });
    };
    reader.readAsDataURL(files[i]);
}

function validaCampos() {
    var valida = true;

    if($("#atividade").val() == 0 || $("#atividade").val() == 4) {
        $(".inputInicial").each(function () {
            if($(this).val() == "" || $(this).val() == null) {
                $(this).addClass("has-error");

                if (valida == true) {
                    valida = false;

                    FLUIGC.toast({
                        message: "Campos não preenchidos!",
                        type: "warning"
                    });
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $(this).offset().top - (screen.height * 0.15)
                    }, 700);
                }
            } else {
                $(this).removeClass("has-error");
            }
        })

        if ($("#setorEspecifico").val().length < 5) {
            if (valida == true) {
                valida = false;

                FLUIGC.toast({
                    message: "Preencha uma função válida!",
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

    /* ============================ */
    /* Identificação do Colaborador */

    doc.text("Relatório de Insalubridade", 105, 10, options = { align: 'center' });
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    const identityFunc = $("#divFuncIdentity .panel-body .row div");
    const data = [];

    identityFunc.each(function() {
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
        startY: 30,
    })

    /* ============================ */
    /* Setor de Trabalho */

    const setorTrabalho = $("#divSectorArea .panel-body .row div");
    const dataSetorTrabalho = [];

    setorTrabalho.each(function() {
        const labels = $(this).find('label').text().trim();
        const inputs = $(this).find('input').val();
        const texts = $(this).find('textarea').val();

        dataSetorTrabalho.push([labels, inputs || texts]);
    });

    const setorTrabalhoColumns = ['label', 'valor'];

    doc.autoTable(setorTrabalhoColumns, dataSetorTrabalho, {
        theme: 'grid',
        head: [['Descritivo de Atividades']],
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
            fontSize: 14,
            cellWidth: 'wrap',
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
            cellWidth: number = 90,
        },
        columnStyles: {
            0: { cellWidth: number = 30 },
            1: { cellWidth: number = 120 },
        },
        startY: 85,
    })

    /* ============================ */
    /* Aprovação Segurança */

    const aprovaSeguranca = $("#approveAreaSeguranca .panel-body div");
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
        head: [['Aprovação Segurança']],
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

    /* ============================ */
    /* Aprovação Gerente */

    const aprovaGerente = $("#approveAreaGerente .panel-body div");
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
        startY: 230,
    })

    /* ============================ */
    /* Checagem de NR's */

    doc.addPage();
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    const normaRegula = $('#divAnexos .panel-body .row div');
    const dataNormaRegula = [];
    const checkboxValNormaRegula = {};

    normaRegula.each(function () {
        const labels = $(this).find('label').text();
        const inputs = $(this).find('input');

        if (inputs.is(':checkbox')) {
            const sliderNormaRegula = inputs.prop('checked') ? 'Sim' : 'Não';
            const checkboxId = inputs.attr('id');

            if (!checkboxValNormaRegula.hasOwnProperty(checkboxId)) {
                checkboxValNormaRegula[checkboxId] = sliderNormaRegula;
                dataNormaRegula.push([labels, sliderNormaRegula]);
            }
        } else {
            dataNormaRegula.push([labels, inputs.val()]);
        }
    });

    const NormaRegulaColumns = ['label', 'valor']

    doc.autoTable(NormaRegulaColumns, dataNormaRegula, {
        theme: 'grid',
        head: [['Normas Regulamentares']],
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
            fontSize: 14,
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
        },
        columnStyles: {
            0: { cellWidth: 'wrap' },
            1: { cellWidth: 'wrap' },
        },
        startY: 30,
    })

    /* Porcentagem NR */

    const nrValue = $("#divNr .panel-body .row div");
    const dataNr = [];

    nrValue.each(function() {
        const inputs = $(this).find('input').val();

        dataNr.push([inputs]);
    });

    const columnsNr = ['valor'];

    doc.autoTable(columnsNr, dataNr, {
        theme: 'grid',
        head: [['Porcentagem de Cálculo da(s) Norma(s) Regulamentar(es)']],
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

    doc.save("INSALUBRIDADE-PERICULOSIDADE - " + nome + ".pdf");

    /* faz o upload do pdf dentro de pasta */
    var fileName = 'INSALUBRIDADE-PERICULOSIDADE - ' + nome + '.pdf';

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
            parentId: 1314675,
            // parentId: 20753,
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