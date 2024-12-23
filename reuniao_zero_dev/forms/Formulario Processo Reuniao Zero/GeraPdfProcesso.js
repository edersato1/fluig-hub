function gerarPDF() {

    var options = {
        orientation: 'p',
        precision: 90,
        margins: {
            top: 5,
            right: 10,
            bottom: 10,
            left: 5,
        },
        unit: 'mm',
    };

    var doc = new jsPDF(options);
    var nomeObra = $("#nomeObra").val();

    /*Inicia a criação do pdf*/

    doc.text("Relatório Reunião Zero", 105, 10, options = { align: 'center' })
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    /* Tabelas */
    /* Quadro Técnico */

    const quadTec = $('#quadtec .row div');
    const data = [];

    quadTec.each(function () {
        const label = $(this).find('label').text().trim();
        const input = $(this).find('.select2-selection__choice').attr("title");

        if (label && input) {
            const existingLabelIndex = data.findIndex(item => item[0] === label);

            if (existingLabelIndex === -1) {
                data.push([label, input]);
            } else {
                data[existingLabelIndex][1] = input;
            }
        }
    });

    const quadTecColumns = ['label', 'valor']

    doc.autoTable(quadTecColumns, data, {
        theme: 'grid',
        head: [['Quadro Técnico']],
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

    /* =============================================================  */
    /* Apresentação da Obra */

    const apresentaObra = $('#tableApresentaObra .row div');
    const dataObra = [];
    const checkboxVal = {};

    apresentaObra.each(function () {
        const labels = $(this).find('label').text().trim();
        const inputs = $(this).find('input');
        const spans = $(this).find('span').text().trim();
        const options = $(this).find('option:selected').text().trim();

        if (inputs.is(':checkbox')) {
            const sliderVal = inputs.prop('checked') ? 'Sim' : 'Não';
            const checkboxId = inputs.attr('id');

            if (!checkboxVal.hasOwnProperty(checkboxId)) {
                checkboxVal[checkboxId] = sliderVal;
                dataObra.push([labels, sliderVal, spans, options]);
            }
        } else {
            dataObra.push([labels, spans || inputs.val() || options]);
        }
    });

    const apresentaObraColumns = ['label', 'valor']

    doc.autoTable(apresentaObraColumns, dataObra, {
        theme: 'grid',
        head: [['Apresentação da Obra']],
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
        startY: 75,
    })

    /* =============================================================  */
    /* Controladoria */

    const controladoriaTable = $('#tableControladoria .panel-body .row div');
    const dataTableControl = [];

    controladoriaTable.each(function () {
        const labels = $(this).find('label').text();
        const inputs = $(this).find('input').val();

        dataTableControl.push([labels, inputs]);
    });

    const tableControlColumns = ['label', 'valor']

    doc.autoTable(tableControlColumns, dataTableControl, {
        theme: 'grid',
        head: [['Controladoria']],
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
        startY: 240,
    })

    /* =============================================================  */
    /* Meio Ambiente */
    doc.addPage();
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    const meioAmbiente = $('#tableMeioAmbiente .panel-body .row div');
    const dataMeioAmbiente = [];
    const checkboxValMeioAmbiente = {};

    meioAmbiente.each(function () {
        const labels = $(this).find('label').text();
        const inputs = $(this).find('input');
        const texts = $(this).find('textarea').val();

        if (inputs.is(':checkbox')) {
            const sliderMeioAmbiente = inputs.prop('checked') ? 'Sim' : 'Não';
            const checkboxId = inputs.attr('id');

            if (!checkboxValMeioAmbiente.hasOwnProperty(checkboxId)) {
                checkboxValMeioAmbiente[checkboxId] = sliderMeioAmbiente;
                dataMeioAmbiente.push([labels, sliderMeioAmbiente, texts]);
            }
        } else {
            dataMeioAmbiente.push([labels, inputs.val(), texts]);
        }
    });

    const meioAmbienteColumns = ['label', 'valor', 'texts']

    doc.autoTable(meioAmbienteColumns, dataMeioAmbiente, {
        theme: 'grid',
        head: [['Meio Ambiente']],
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
            0: { cellWidth: number = 100 },
            1: { cellWidth: number = 10 },
            2: { cellWidth: number = 70 },
        },
        startY: 30,
    })

    /* =============================================================  */
    /* SST */

    doc.addPage();
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    const sst = $('#tableSegurancaTrabalho .panel-body .row div');
    const dataSst = [];
    const checkboxValSST = {};

    sst.each(function () {
        const labels = $(this).find('label').text();
        const inputs = $(this).find('input');

        if (inputs.is(':checkbox')) {
            const sliderSST = inputs.prop('checked') ? 'Sim' : 'Não';
            const checkboxId = inputs.attr('id');

            if (!checkboxValSST.hasOwnProperty(checkboxId)) {
                checkboxValSST[checkboxId] = sliderSST;
                dataSst.push([labels, sliderSST]);
            }
        } else {
            dataSst.push([labels, inputs.val()]);
        }
    });

    const sstColumns = ['label', 'valor']

    doc.autoTable(sstColumns, dataSst, {
        theme: 'grid',
        head: [['Segurança do Trabalho']],
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

    /*Suprimentos/Compras */
    /* Insumos */

    /* Header */
    let headSuprimentos = [
        [
            { content: 'Suprimentos/Compras', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ];

    doc.autoTable({
        startY: 140,
        head: headSuprimentos,
        theme: 'grid'
    });

    /* Body */
    doc.autoTable({
        html: '#insumosObra',
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
        },
        startY: 148
    });

    /* =============================================================  */
    /* Betuminoso */

    doc.addPage();
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    let currentY = 30;
    
    /* Betuminoso */
    let headBetuminoso = [
        [
            { content: 'Betuminoso', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ];
    
    var dadosBetuminoso = $("#jsonTableBetuminoso").val();
    
    if (!dadosBetuminoso.trim()) {
        dadosBetuminoso = [];
    } else {
        try {
            dadosBetuminoso = JSON.parse(dadosBetuminoso);
        } catch (e) {
            dadosBetuminoso = [];
        }
    }

    let betuminosoShow = false;
    if (dadosBetuminoso.length > 0) {
        var columnsBetuminoso = [
            { title: "Produto", datakey: "betuminoso" },
            { title: "Volume Estimado", datakey: "volume" },
            { title: "Início do Consumo", datakey: "inicioConsumo" },
            { title: "Observação", datakey: "observacoes" },
        ];
        
        var tableBodyBetuminoso = dadosBetuminoso.map(function (betuminoso) {
            return [betuminoso.betuminoso, betuminoso.volume, betuminoso.inicioConsumo, betuminoso.observacoes];
        });
        
        doc.autoTable({
            startY: currentY,
            head: headBetuminoso,
            columns: columnsBetuminoso,
            body: tableBodyBetuminoso,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: 0.3,
            },
        });
        
        // Atualiza currentY para a próxima posição após a primeira tabela
        
        currentY = doc.previousAutoTable.finalY + 30;
        betuminosoShow = true;
    }
    
    /* Aço */
    let headAco = [
        [
            { content: 'Aço', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ];
    
    var dadosAco = $("#jsonTableAco").val();
    
    if (!dadosAco.trim()) {
        dadosAco = [];
    } else {
        try {
            dadosAco = JSON.parse(dadosAco);
        } catch (e) {
            dadosAco = [];
        }
    }

    let acoShow = false;
    if (dadosAco.length > 0) {
        var columnsAco = [
            { title: "Produto", datakey: "aco" },
            { title: "Volume Estimado", datakey: "volume" },
            { title: "Início do Consumo", datakey: "inicioConsumo" },
            { title: "Observação", datakey: "observacoes" },
        ];
        
        var tableBodyAco = dadosAco.map(function (aco) {
            return [aco.aco, aco.volume, aco.inicioConsumo, aco.observacoes];
        });
        
        doc.autoTable({
            startY: currentY,
            head: headAco,
            columns: columnsAco,
            body: tableBodyAco,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: 0.3,
            }
        });

        currentY = doc.previousAutoTable.finalY + 30;
        acoShow = true;
    }


    /* Diesel */
    let headDiesel = [
        [
            { content: 'Diesel', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ]
    
    var dadosDiesel = $("#jsonTableDiesel").val();
    if (!dadosDiesel.trim()) {
        dadosDiesel = [];
    } else {
        try {
            dadosDiesel = JSON.parse(dadosDiesel);
        } catch (e) {
            dadosDiesel = [];
        }
    }

    if (dadosDiesel.length > 0) {
        var columns = [
            { title: "Produto", datakey: "diesel" },
            { title: "Volume Estimado", datakey: "volume" },
            { title: "Início do Consumo", datakey: "inicioConsumo" },
            { title: "Observação", datakey: "observacoes" },
        ]
    
        var tableBody = dadosDiesel.map(function (diesel) {
            return [diesel.diesel, diesel.volume, diesel.inicioConsumo, diesel.observacoes]
        });
    
        doc.autoTable({
            startY: currentY,
            head: headDiesel,
            columns: columns,
            body: tableBody,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
            },
        });

        currentY = doc.previousAutoTable.finalY + 30;
    }


    /* =============================================================  */
    /* Epi */

    doc.addPage();
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    let currentYaxis = 30;

    let headAgregado = [
        [
            { content: 'Agregado', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ]

    var dadosAgregado = $("#jsonTableAgregado").val();

    if (!dadosAgregado.trim()) {
        dadosAgregado = [];
    } else {
        try {
            dadosAgregado = JSON.parse(dadosAgregado);
        } catch (e) {
            dadosAgregado = [];
        }
    }

    let agregadoShow = false;
    if (dadosAgregado.length > 0) {
        var columnsAgregado = [
            { title: "Produto", datakey: "agregado" },
            { title: "Volume Estimado", datakey: "volume" },
            { title: "Início do Consumo", datakey: "inicioConsumo" },
            { title: "Observação", datakey: "observacoes" },
        ]
    
        var tableBodyAgregado = dadosAgregado.map(function (agregado) {
            return [agregado.agregado, agregado.volume, agregado.inicioConsumo, agregado.observacoes]
        });
    
        doc.autoTable({
            startY: currentYaxis,
            head: headAgregado,
            columns: columnsAgregado,
            body: tableBodyAgregado,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
            },
        });

        currentYaxis = doc.previousAutoTable.finalY + 30;
        agregadoShow = true;
    }


    /* Epi */

    let headEpi = [
        [
            { content: 'Epi', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ]

    var dadosEpi = $("#jsonTableEpi").val();

    if (!dadosEpi.trim()) {
        dadosEpi = [];
    } else {
        try {
            dadosEpi = JSON.parse(dadosEpi);
        } catch (e) {
            dadosEpi = [];
        }
    }

    let epiShow = false;
    if (dadosEpi.length > 0) {
        var columnsEpi = [
            { title: "Produto", datakey: "epi" },
            { title: "Volume Estimado", datakey: "volume" },
            { title: "Início do Consumo", datakey: "inicioConsumo" },
            { title: "Observação", datakey: "observacoes" },
        ]
    
        var tableBodyEpi = dadosEpi.map(function (epi) {
            return [epi.epi, epi.volume, epi.inicioConsumo, epi.observacoes]
        });
        
        doc.autoTable({
            startY: currentYaxis,
            head: headEpi,
            columns: columnsEpi,
            body: tableBodyEpi,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
            },
        });

        currentYaxis = doc.previousAutoTable.finalY + 30;
        epiShow = true;
    }


    /* Epc */

    let headEpc = [
        [
            { content: 'Epc', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ]

    var dadosEpc = $("#jsonTableEpc").val();

    if (!dadosEpc.trim()) {
        dadosEpc = [];
    } else {
        try {
            dadosEpc = JSON.parse(dadosEpc);
        } catch (e) {
            dadosEpc = [];
        }
    }

    if (dadosEpc.length > 0) {
        var columnsEpc = [
            { title: "Produto", datakey: "epc" },
            { title: "Volume Estimado", datakey: "volume" },
            { title: "Início do Consumo", datakey: "inicioConsumo" },
            { title: "Observação", datakey: "observacoes" },
        ]
    
        var tableBodyEpc = dadosEpc.map(function (epc) {
            return [epc.epc, epc.volume, epc.inicioConsumo, epc.observacoes]
        });
    
        doc.autoTable({
            startY: currentYaxis,
            head: headEpc,
            columns: columnsEpc,
            body: tableBodyEpc,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
            },
        });

        currentYaxis = doc.previousAutoTable.finalY + 30;
    }


    /* =============================================================  */
    /* Laboratorio */

    doc.addPage();
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    let currentYposition = 30;


    let headLaboratorio = [
        [
            { content: 'Laboratorio', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ]

    var dadosLaboratorio = $("#jsonTableLaboratorio").val();

    if (!dadosLaboratorio.trim()) {
        dadosLaboratorio = [];
    } else {
        try {
            dadosLaboratorio = JSON.parse(dadosLaboratorio);
        } catch (e) {
            dadosLaboratorio = [];
        }
    }

    let laboratorioShow = false;
    if (dadosLaboratorio.length > 0) {
        var columnsLaboratorio = [
            { title: "Produto", datakey: "laboratorio" },
            { title: "Volume Estimado", datakey: "volume" },
            { title: "Início do Consumo", datakey: "inicioConsumo" },
            { title: "Observação", datakey: "observacoes" },
        ]
    
        var tableBodyLaboratorio = dadosLaboratorio.map(function (laboratorio) {
            return [laboratorio.laboratorio, laboratorio.volume, laboratorio.inicioConsumo, laboratorio.observacoes]
        });
    
        doc.autoTable({
            startY: currentYposition,
            head: headLaboratorio,
            columns: columnsLaboratorio,
            body: tableBodyLaboratorio,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
            },
        });

        currentYposition = doc.previousAutoTable.finalY + 30;
        laboratorioShow = true;
    }


    /* Veiculos */

    let headVeiculos = [
        [
            { content: 'Veículos', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ];

    var dadosVeiculos = $("#jsonTableVeiculo").val();
    dadosVeiculos = JSON.parse(dadosVeiculos);

    let veiculosShow = false;
    if (dadosVeiculos.length > 0) {
        var columns = [
            { title: "Marca", dataKey: "veiculo" },
            { title: "Quantidade", dataKey: "quantdVeiculo" },
            { title: "Modelo", dataKey: "modeloVeiculo" },
            { title: "Observação", dataKey: "observacoes" },
        ];
    
        var tableBody = dadosVeiculos.map(function (vehicle) {
            return [vehicle.veiculo, vehicle.quantdVeiculo, vehicle.modeloVeiculo, vehicle.observacoes];
        });
    
        doc.autoTable({
            startY: currentYposition,
            head: headVeiculos,
            columns: columns,
            body: tableBody,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
            },
        });

        currentYposition = doc.previousAutoTable.finalY + 30;
        veiculosShow = true;
    }
    

    /* Contabilidade */
    let headContabil = [
        [
            { content: 'Contabilidade', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ];

    var dadosContabil = $("#jsonTableContabil").val();
    dadosContabil = JSON.parse(dadosContabil);

    if (dadosContabil.length > 0) {
        var columns = [
            { title: "Municípios", dataKey: "municipios" },
            { title: "CNPJ", dataKey: "CNPJContabil" },
            { title: "Extensão %", dataKey: "extensao" },
            { title: "Aliquota ISS", dataKey: "aliquotaIss" },
            { title: "Dedução Material Permitida", dataKey: "deducaoMaterial" },
        ];
    
        var tableBody = dadosContabil.map(function (control) {
            return [control.municipios, control.CNPJContabil, control.extensao, control.aliquotaIss, control.deducaoMaterial];
        });
    
        doc.autoTable({
            startY: currentYposition,
            head: headContabil,
            columns: columns,
            body: tableBody,
            headStyles: {
                fillColor: ['#3a3a3a'],
                textColor: ['ffffff'],
            },
            bodyStyles: {
                lineColor: 10,
                lineWidth: border = 0.3,
            },
        });

        currentYposition = doc.previousAutoTable.finalY + 30;
    }

    /* =============================================================  */
    /* T.I */

    doc.addPage();
    doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
    doc.line(10, 18, 200, 18);

    let headTi = [
        [
            { content: 'Tecnologia da Informação', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ];

    doc.autoTable({
        startY: 30,
        head: headTi,
        theme: 'grid'
    });

    doc.autoTable({
        html: '#equipamentosTi',
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
        },
        startY: 38
    });
    /* Central de Equipamentos */

    let headEquip = [
        [
            { content: 'Central de Equipamentos', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
        ],
    ];

    doc.autoTable({
        startY: 160,
        head: headEquip,
        theme: 'grid'
    });

    var dadosEquip = $("#jsonTableEquipamento").val();
    dadosEquip = JSON.parse(dadosEquip);

    var columns = [
        { title: "Máquinas e Equipamentos", dataKey: "machAndEquip" },
        { title: "Quantidade Próprio", dataKey: "quantdProprio" },
        { title: "Quantidade Terceiros", dataKey: "quantdTerceiros" },
    ];

    var tableBody = dadosEquip.map(function (equip) {
        return [equip.machAndEquip, equip.quantdProprio, equip.quantdTerceiros];
    });

    doc.autoTable({
        columns: columns,
        body: tableBody,
        headStyles: {
            fillColor: ['#3a3a3a'],
            textColor: ['ffffff'],
        },
        bodyStyles: {
            lineColor: 10,
            lineWidth: border = 0.3,
        },
        startY: 168,
    });

    $('#suprimentos, #controladoria, #contabilidade, #ti, #centralEquipments').hide();
    doc.save("ReuniãoZero - " + nomeObra + ".pdf");

    /* faz o upload do pdf dentro da pasta da obra */
    var fileName = 'ReuniãoZero - ' + nomeObra + '.pdf';

    const jsons = ['jsonTableBetuminoso', 'jsonTableAco', 'jsonTableDiesel', 'jsonTableAgregado', 'jsonTableEpi', 'jsonTableEpc', 'jsonTableLaboratorio'];

    /* filtra os JSONs vazios */
    const validJsons = jsons.map(id => window[id]).filter(json => Object.keys(json).length > 0);

    /* gera o pdf usando os json válidos e deixando tabelas vazias em branco */
    validJsons.forEach(json => {
        doc.text(JSON.stringify(json));
    });

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
            parentId: 7883,
            // parentId: 744514,
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
        const inputDocPdf = $("#idDocReuniaoZero");

        if (idPdf) {
            inputDocPdf.val(idPdf.id);
        } else {
            console.error("Erro ao salvar JSON");
        }

        return response_1.content;

        /* Busca pasta recém criada */
    }).then(async function () {
        var idPasta = $("#idPastaObra").val();

        const response = await fetch(
            "/api/public/ecm/document/listDocumentWithChildren/" + idPasta,
            {
                method: "GET",
            }
        );
        if (!response.ok) {
            throw "Erro ao buscar pasta da obra";
        }

        /* Muda a pasta do documento */
    }).then(async function () {
        var idDoc = $("#idDocReuniaoZero").val();
        var idPasta = $("#idPastaObra").val();

        let document = {
            id: idDoc,
            parentId: idPasta
        }

        const response = await fetch(
            "/api/public/ecm/document/updateDocumentFolder",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                cache: "no-cache",
                body: JSON.stringify(document)
            }
        )
        if (!response.ok) {
            throw "Erro ao mudar pasta do documento";
        }
    })
}