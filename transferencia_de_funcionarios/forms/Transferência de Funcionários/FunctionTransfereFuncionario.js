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

function buscarObrasDestino() {
    return new Promise((resolve, reject) => {
        DatasetFactory.getDataset("GCCUSTO", null, [
            DatasetFactory.createConstraint("ATIVO","T", "T", ConstraintType.SHOULD)
        ], ['GCCUSTO.CODCOLIGADA'], {
            success: (CentrosDeCusto => {
                if (CentrosDeCusto.values.length > 0) {
                    let options = "";
                    let coligadas = {};
                    
                    CentrosDeCusto.values.forEach(ccusto => {
                        if (!coligadas[ccusto.CODCOLIGADA]) {
                            coligadas[ccusto.CODCOLIGADA] = {
                                options: []
                            };
                        }
                        coligadas[ccusto.CODCOLIGADA].options.push(
                            "<option value='" + ccusto.CODCOLIGADA + " - " + ccusto.CODCCUSTO + " - " + ccusto.NOME + "'>" + ccusto.CODCCUSTO + " - " + ccusto.NOME + "</option>"
                        );
                    });
                    
                    for (const codcoligada in coligadas) {
                        options += "<optgroup label='Coligada " + codcoligada + "'>";
                        options += coligadas[codcoligada].options.join("");
                        options += "</optgroup>";
                    }
                    
                    resolve(options);
                } else {
                    reject("Nenhum Centro de Custo encontrado.");
                }
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
        var dataAdmissao = dataset.values[0]["dataAdmissao"];

        /*Converte data para padrão br*/
        var [data] = dataAdmissao.split(" ");

        var [ano, mes, dia] = data.split("-");
        var dataFormatada = `${dia}/${mes}/${ano}`;

        if (chapa != "") {
            InsereInfoFuncionario(nome, nomeFuncao, dataFormatada);
        }
    }

    function InsereInfoFuncionario(nome, nomeFuncao, dataFormatada) {
        $("#nomeFunc").val(nome);
        $("#atualFunc").val(nomeFuncao);
        $("#dataAdmissao").val(dataFormatada);
    }
}

function LimpaCampos() {
    $("#nomeFunc, #atualFunc, #dataAdmissao").val("");
}

/* Funções de preenchimento dos demais inputs */

function preencherObrasDestino() {
    buscarObrasDestino().then((options) => {
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

function carregaSecao() {
    var obra = $("#obraDestino").val();
    var obraNum = obra.split('-');

    var coligada = obraNum[0].trim();
    var constrColumn = DatasetFactory.createConstraint("coligada", coligada, coligada, ConstraintType.MUST);
    var constraints = new Array(constrColumn);

    var secao = $("#obraSecao").val();
    var dsSecao = DatasetFactory.getDataset("SecaoRM", null, constraints, null);
    $("#obraSecao").empty();

    $.each($(dsSecao.values), function (k, u) {
        var option = $("<option></option>")
        option.attr("value", u.descricao).text(u.descricao);

        if (u.descricao == secao) {
            option.attr("selected", true);
        }
        $("#obraSecao").append(option);
    })
}

function validaCampos() {
    var valida = true;

    if ($("#atividade").val() == 0 || $("#atividade").val() == 5) {
        $(".inputInicial").each(function () {
            if ($(this).val() == "" || $(this).val() == null) {
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

    doc.text("Relatório de Transferência", 105, 10, options = { align: 'center' });
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

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
        startY: 30,
    })

    /* ============================ */
    /* Dados da Obra Destino */

    const obraDestino = $("#divNovaObra .panel-body .row div");
    const obraDestinoData = [];

    obraDestino.each(function () {
        const labels = $(this).find('label').text().trim();
        const inputs = $(this).find('input').val();
        const options = $(this).find('option:selected').text().trim();

        obraDestinoData.push([labels, inputs || options]);
    });

    const obraDestinoColumns = ['label', 'valor'];

    doc.autoTable(obraDestinoColumns, obraDestinoData, {
        theme: 'grid',
        head: [['Dados da Obra Destino']],
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
    /* Aprovação Gerente */

    const aprovaGerente = $("#approveArea .panel-body div");
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
        startY: 145,
    })

    doc.save("TRANSFERÊNCIA - " + nome + ".pdf");

    var fileName = 'TRANSFERÊNCIA - ' + nome + '.pdf';

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
            // parentId: 19783,
            parentId: 1314638,
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