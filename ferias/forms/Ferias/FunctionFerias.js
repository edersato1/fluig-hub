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

        if (chapa != "") {
            InsereInfoFuncionario(nome, nomeFuncao);
        }
    }

    function InsereInfoFuncionario(nome, nomeFuncao) {
        $("#nomeFunc").val(nome);
        $("#atualFunc").val(nomeFuncao);
    }
}

function showColigada() {
    var c1 = [DatasetFactory.createConstraint("permissaoGeral", "true", "true", ConstraintType.MUST)];
    var dataset = DatasetFactory.getDataset("BuscaPermissaoColigadasUsuario", null, c1, null);
    var chapa = $("#numChapa").val();

    var obra = $("#obra").val();
    var obraNum = obra.split('-');
    var coligada = obraNum[0].trim();    

    if (dataset && dataset.values.length > 0) {
        for (var i = 0; i < dataset.values.length; i++) {
            var coligadaTaset = dataset.values[i]["CODCOLIGADA"];
            var nome = dataset.values[i]["NOMEFANTASIA"];

            if (chapa != "" && coligada == coligadaTaset) {
                InsereColigada(nome);
                break;
            }
        }

        function InsereColigada(nome) {
            $("#infObra").val(nome);
        }
    }
}

function LimpaCampos() {
    $("#nomeFunc, #atualFunc, #infObra").val("");
}

function LimpaData() {
    $("#dataInicio, #qtdDias, #dataFinal").val("");
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

    doc.text("Solicitação de Férias", 105, 10, options = { align: 'center' });
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);   

    /* ============================ */
    /* Identificação do Colaborador */

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
    /* Período de Férias */

    const vacationInfo = $("#vacationPeriod .panel-body .row div");
    const vacationData = [];
    const vacationCheckbox = {};

    vacationInfo.each(function() {
        const labels = $(this).find('label').text().trim();
        const inputs = $(this).find('input');

        if (inputs.is(':checkbox')) {
            const sliderVacation = inputs.prop('checked') ? 'Sim' : 'Não';
            const checkboxId = inputs.attr('id');

            if(!vacationCheckbox.hasOwnProperty(checkboxId)) {
                vacationCheckbox[checkboxId] = sliderVacation;
                vacationData.push([labels, sliderVacation]);
            }
        } else {
            vacationData.push([labels, inputs.val()]);
        }

    });

    const vacationColumns = ['label', 'valor'];

    doc.autoTable(vacationColumns, vacationData, {
        theme: 'grid',
        head: [['Período de Férias']],
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
        startY: 90,
    })

    /* ============================ */
    /* Aprovação Gerente */

    const aprovaGerente = $("#approveArea .panel-body div");
    const gerenteData = [];

    aprovaGerente.each(function() {
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
        head: [['Aprovação do Gerente']],
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
        startY: 150,
    })
    
    doc.save("SOLICITAÇÃO DE FÉRIAS - " + nome + ".pdf");

    var fileName = 'SOLICITAÇÃO DE FÉRIAS - ' + nome + '.pdf';

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
            parentId: 1314641,
            // parentId: 19786,
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