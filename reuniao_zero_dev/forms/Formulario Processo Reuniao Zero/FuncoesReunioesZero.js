/* campos zoom */

function setSelectedZoomItem(selectedItem) {
    if (selectedItem.inputId == "coordenador") {
        $("#emailCoordenador").val(selectedItem["mail"]);
    }
    else if (selectedItem.inputId == "gerenteContrato") {
        $("#emailGerente").val(selectedItem["mail"]);
        $("#valorGerente").val(selectedItem["login"]);
    }
    else if (selectedItem.inputId == "encarregadoAdm") {
        $("#emailEncarregado").val(selectedItem["mail"]);
    }
    else if (selectedItem.inputId == "engenheiroSST") {
        $("#emailEngenheiro").val(selectedItem["mail"]);
    }
}

function removedZoomItem(removedItem) {
    if (removedItem.inputId == "coordenador") {
        $("#emailCoordenador").val("");
    }
    else if (removedItem.inputId == "gerenteContrato") {
        $("#emailGerente").val("");
        $("#valorGerente").val("");
    }
    else if (removedItem.inputId == "encarregadoAdm") {
        $("#emailEncarregado").val("");
    }
    else if (removedItem.inputId == "engenheiroSST") {
        $("#emailEngenheiro").val("");
    }
}

/* Tabelas do sistema */
/* Suprimentos/Compras */

function SalvaTableSuprimentos() {
    $('#saveButton').click(function () {
        var dataSuprimentos = [];

        $('#insumosObra tbody tr').each(function () {
            var rowData = [];
            var hasData = false;

            $(this).find('[id^=volumeInfo], [id^=inicioConsumo], [id^=observacao]').each(function () {
                var value = $(this).val();

                if (value.trim() !== '') {
                    hasData = true;
                }

                rowData.push(value);
            });

            if (hasData) {
                var labelItem = $(this).find('label').text();
                rowData.unshift(labelItem);
                dataSuprimentos.push(rowData);
            }
        });

        $("#suprimentosData").val(JSON.stringify(dataSuprimentos));
    });
}
function EditaTableSuprimentos() {
    var dados = JSON.parse($('#suprimentosData').val());
    var validRowIndex = 0;

    $('#insumosObra tbody tr').each(function (rowIndex) {
        var checkboxInsumos = $(this).find('td input[type="checkbox"]').is(':checked');

        if (checkboxInsumos) {
            var inputsVaziosInsumos = $(this).find('td input').toArray().every(function (input) {
                return $(input).val().trim() === '';
            });

            if (!inputsVaziosInsumos && validRowIndex < dados.length) {
                $(this).find('td input').each(function (colIndex) {
                    if (colIndex >= 0 && colIndex < dados[validRowIndex].length) {
                        $(this).val(dados[validRowIndex][colIndex] || '');
                    }
                });
                validRowIndex++;
            }
        }
    });

    $('#insumosObra tbody td input').on('blur', function () {
        var rowIndex = $(this).closest('tr').index();
        var colIndex = $(this).parent().index();

        if (!dados[rowIndex]) {
            dados[rowIndex] = [];
        }

        dados[rowIndex][colIndex] = $(this).val();

        $('#suprimentosData').val(JSON.stringify(dados));
    });
}
function MostraTableSuprimentos() {
    var dados = JSON.parse($('#suprimentosData').val());
    console.log(dados);

    var tbody = $('<tbody></tbody>');

    for (var i = 0; i < dados.length; i++) {
        var row = $("<tr></tr>");

        for (var j = 0; j < dados[i].length; j++) {
            var cell = $("<td></td>").text(dados[i][j]);
            row.append(cell);
        }

        tbody.append(row);
    }

    $('#insumosObra tbody').replaceWith(tbody);

    MostraTableVeiculo();

}

/* Veiculos */
function jsonVeiculos(veiculo, quantdVeiculo, modeloVeiculo, observacoes) {
    return {
        veiculo: veiculo,
        quantdVeiculo: quantdVeiculo,
        modeloVeiculo: modeloVeiculo,
        observacoes: observacoes
    };
}
function SalvaTableVeiculo() {

    $('#saveButtonVeiculo').click(function () {
        var listTableVeiculo = [];

        if ($(".trTableSuprimento").length > 0) {
            $(".trTableSuprimento").each(function () {
                var veiculo = $(this).find("#veiculo").val();
                var quantdVeiculo = $(this).find("#quantdVeiculo").val();
                var modeloVeiculo = $(this).find("#modeloVeiculo").val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonVeiculos(veiculo, quantdVeiculo, modeloVeiculo, observacoes);

                if (json.veiculo) {
                    listTableVeiculo.push(json);
                }
            })

            $("#jsonTableVeiculo").val(JSON.stringify(listTableVeiculo));
        }
    });
}
function MostraTableVeiculo() {
    var veiculoSuprimentos = $("#jsonTableVeiculo").val();
    veiculoSuprimentos = JSON.parse(veiculoSuprimentos);

    for (i = 0; i < veiculoSuprimentos.length; i++) {
        $("#tbodyVeiculos").append('\
            <tr class="trTableSuprimento">\
                <td><input type="text" class="form-control" name="veiculo" id="veiculo" value="' + veiculoSuprimentos[i].veiculo + '"></td>\
                <td><input type="text" class="form-control" name="quantdVeiculo" id="quantdVeiculo" value="' + veiculoSuprimentos[i].quantdVeiculo + '"></td>\
                <td><input type="text" class="form-control" name="modeloVeiculo" id="modeloVeiculo" value="' + veiculoSuprimentos[i].modeloVeiculo + '"></td>\
                <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + veiculoSuprimentos[i].observacoes + '"></td>\
            </tr>\
        ')
    }
}

/* Betuminoso */
function jsonBetuminoso(betuminoso, volume, inicioConsumo, observacoes) {
    return {
        betuminoso: betuminoso,
        volume: volume,
        inicioConsumo: inicioConsumo,
        observacoes: observacoes
    };
}
function SalvaTableBetuminoso() {

    var plusId = 14;
    $('#saveButtonBetuminoso').click(function () {
        var listTableBetuminoso = [];

        if ($(".trTableBetuminoso").length > 0) {
            $(".trTableBetuminoso").each(function () {
                var idBetuminoso = "inicioConsumo" + plusId++;

                var betuminoso = $(this).find("#betuminoso").val();
                var volume = $(this).find("#volume").val();
                var inicioConsumo = $(this).find("#" + idBetuminoso).val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonBetuminoso(betuminoso, volume, inicioConsumo, observacoes);

                if (json.betuminoso) {
                    listTableBetuminoso.push(json);
                }
            })

            $("#jsonTableBetuminoso").val(JSON.stringify(listTableBetuminoso));
        }
    });
}

var editaBetuminoso = 25;
function EditaTableBetuminoso() {
    $('#saveButtonBetuminoso').click(function () {
        var listTableBetuminoso = [];
        var oldData = [];

        // Carrega o JSON existente e separa os dados com IDs abaixo de 25
        var existingData = $("#jsonTableBetuminoso").val();
        if (existingData) {
            var parsedData = JSON.parse(existingData);
            oldData = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber < 25;
            });
            listTableBetuminoso = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber >= 25;
            });
        }

        // Adiciona os novos dados (IDs >= 25)
        if ($(".trTableBetuminoso").length > 0) {
            $(".trTableBetuminoso").each(function () {
                var inicioConsumoId = $(this).find("[id^=inicioConsumo]").attr("id");
                var idNumber = parseInt(inicioConsumoId.replace(/\D/g, ''), 10);

                if (idNumber >= 25) {
                    var betuminoso = $(this).find("#betuminoso").val();
                    var volume = $(this).find("#volume").val();
                    var inicioConsumo = $(this).find("#" + inicioConsumoId).val();
                    var observacoes = $(this).find("#observacoes").val();

                    // Verifica se o valor de inicioConsumo já existe no array para IDs >= 25
                    var isDuplicate = listTableBetuminoso.some(function (item) {
                        return item.inicioConsumo === inicioConsumo;
                    });

                    if (!isDuplicate && inicioConsumo) { // Adiciona se não for duplicado e se inicioConsumo não for vazio
                        var json = jsonBetuminoso(betuminoso, volume, inicioConsumo, observacoes);

                        if (json.betuminoso) {
                            listTableBetuminoso.push(json);
                        }
                    }
                }
            });
        }

        // Combina os dados antigos com os novos preservando todos
        var combinedData = oldData.concat(listTableBetuminoso);

        // Salva o array atualizado como JSON
        $("#jsonTableBetuminoso").val(JSON.stringify(combinedData));
    });
}

function MostraTableBetuminoso() {
    var betuminosoInsumos = $("#jsonTableBetuminoso").val();

    if (!betuminosoInsumos.trim()) {
        $("#tbodyBetuminoso").empty();
        return;
    }

    var parsedData;
    try {
        parsedData = JSON.parse(betuminosoInsumos);
    } catch (e) {
        $("#tbodyBetuminoso").empty();
        return;
    }

    // Verifica se o JSON contém dados
    if (parsedData && parsedData.length > 0) {
        $("#tbodyBetuminoso").empty();
        var i;
        for (i = 0; i < parsedData.length; i++) {
            var plusId = i + 14;
            var dataConsumo = 'inicioConsumo' + plusId;

            $("#tbodyBetuminoso").append('\
                <tr class="trTableBetuminoso">\
                    <td><input type="text" class="form-control" name="betuminoso" id="betuminoso" value="' + parsedData[i].betuminoso + '"></td>\
                    <td><input type="text" class="form-control" name="volume" id="volume" value="' + parsedData[i].volume + '"></td>\
                    <td><input type="text" class="form-control" name="inicioConsumo" id="' + dataConsumo + '" value="' + parsedData[i].inicioConsumo + '"></td>\
                    <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + parsedData[i].observacoes + '"></td>\
                </tr>\
            ');
        }
    } else {
        $("#tbodyBetuminoso").empty(); // Limpa a tabela
    }
}

/* Aço */
function jsonAco(aco, volume, inicioConsumo, observacoes) {
    return {
        aco: aco,
        volume: volume,
        inicioConsumo: inicioConsumo,
        observacoes: observacoes
    };
}
function SalvaTableAco() {

    var plusId = 36;
    $('#saveButtonAco').click(function () {
        var listTableAco = [];

        if ($(".trTableAco").length > 0) {
            $(".trTableAco").each(function () {
                var idAco = "inicioConsumo" + plusId++;

                var aco = $(this).find("#aco").val();
                var volume = $(this).find("#volume").val();
                var inicioConsumo = $(this).find("#" + idAco).val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonAco(aco, volume, inicioConsumo, observacoes);

                if (json.aco) {
                    listTableAco.push(json);
                }
            })

            $("#jsonTableAco").val(JSON.stringify(listTableAco));
        }
    });
}

var editaAco = 47;
function EditaTableAco() {
    $('#saveButtonAco').click(function () {
        var listTableAco = [];
        var oldData = [];

        // Carrega o JSON existente e separa os dados com IDs abaixo de 47
        var existingData = $("#jsonTableAco").val();
        if (existingData) {
            var parsedData = JSON.parse(existingData);
            oldData = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber < 47;
            });
            listTableAco = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber >= 47;
            });
        }

        // Adiciona os novos dados (IDs >= 47)
        if ($(".trTableAco").length > 0) {
            $(".trTableAco").each(function () {
                var inicioConsumoId = $(this).find("[id^=inicioConsumo]").attr("id");
                var idNumber = parseInt(inicioConsumoId.replace(/\D/g, ''), 10);

                if (idNumber >= 47) {
                    var aco = $(this).find("#aco").val();
                    var volume = $(this).find("#volume").val();
                    var inicioConsumo = $(this).find("#" + inicioConsumoId).val();
                    var observacoes = $(this).find("#observacoes").val();

                    // Verifica se o valor de inicioConsumo já existe no array para IDs >= 47
                    var isDuplicate = listTableAco.some(function (item) {
                        return item.inicioConsumo === inicioConsumo;
                    });

                    if (!isDuplicate && inicioConsumo) { // Adiciona se não for duplicado e se inicioConsumo não for vazio
                        var json = jsonAco(aco, volume, inicioConsumo, observacoes);

                        if (json.aco) {
                            listTableAco.push(json);
                        }
                    }
                }
            });
        }

        // Combina os dados antigos com os novos preservando todos
        var combinedData = oldData.concat(listTableAco);

        // Salva o array atualizado como JSON
        $("#jsonTableAco").val(JSON.stringify(combinedData));
    });
}

function MostraTableAco() {
    var acoInsumos = $("#jsonTableAco").val();

    if (!acoInsumos.trim()) {
        $("#tbodyAco").empty();
        return;
    }

    var parsedData;
    try {
        parsedData = JSON.parse(acoInsumos);
    } catch (e) {
        $("#tbodyAco").empty();
        return;
    }

    // Verifica se o JSON contém dados
    if (parsedData && parsedData.length > 0) {
        $("#tbodyAco").empty();
        var i;
        for (i = 0; i < parsedData.length; i++) {
            var plusId = i + 36;
            var dataConsumo = 'inicioConsumo' + plusId;

            $("#tbodyAco").append('\
                <tr class="trTableAco">\
                    <td><input type="text" class="form-control" name="aco" id="aco" value="' + parsedData[i].aco + '"></td>\
                    <td><input type="text" class="form-control" name="volume" id="volume" value="' + parsedData[i].volume + '"></td>\
                    <td><input type="text" class="form-control" name="inicioConsumo" id="' + dataConsumo + '" value="' + parsedData[i].inicioConsumo + '"></td>\
                    <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + parsedData[i].observacoes + '"></td>\
                </tr>\
            ');
        }
    } else {
        $("#tbodyAco").empty(); // Limpa a tabela
    }
}

/* Diesel */
function jsonDiesel(diesel, volume, inicioConsumo, observacoes) {
    return {
        diesel: diesel,
        volume: volume,
        inicioConsumo: inicioConsumo,
        observacoes: observacoes
    };
}
function SalvaTableDiesel() {

    var plusId = 58;
    $('#saveButtonDiesel').click(function () {
        var listTableDiesel = [];

        if ($(".trTableDiesel").length > 0) {
            $(".trTableDiesel").each(function () {
                var idDiesel = "inicioConsumo" + plusId++;

                var diesel = $(this).find("#diesel").val();
                var volume = $(this).find("#volume").val();
                var inicioConsumo = $(this).find("#" + idDiesel).val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonDiesel(diesel, volume, inicioConsumo, observacoes);

                if (json.diesel) {
                    listTableDiesel.push(json);
                }
            })

            $("#jsonTableDiesel").val(JSON.stringify(listTableDiesel));
        }
    });
}

var editaDiesel = 69;
function EditaTableDiesel() {
    $('#saveButtonDiesel').click(function () {
        var listTableDiesel = [];
        var oldData = [];

        // Carrega o JSON existente e separa os dados com IDs abaixo de 69
        var existingData = $("#jsonTableDiesel").val();
        if (existingData) {
            var parsedData = JSON.parse(existingData);
            oldData = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber < 69;
            });
            listTableDiesel = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber >= 69;
            });
        }

        // Adiciona os novos dados (IDs >= 69)
        if ($(".trTableDiesel").length > 0) {
            $(".trTableDiesel").each(function () {
                var inicioConsumoId = $(this).find("[id^=inicioConsumo]").attr("id");
                var idNumber = parseInt(inicioConsumoId.replace(/\D/g, ''), 10);

                if (idNumber >= 69) {
                    var diesel = $(this).find("#diesel").val();
                    var volume = $(this).find("#volume").val();
                    var inicioConsumo = $(this).find("#" + inicioConsumoId).val();
                    var observacoes = $(this).find("#observacoes").val();

                    // Verifica se o valor de inicioConsumo já existe no array para IDs >= 69
                    var isDuplicate = listTableDiesel.some(function (item) {
                        return item.inicioConsumo === inicioConsumo;
                    });

                    if (!isDuplicate && inicioConsumo) { // Adiciona se não for duplicado e se inicioConsumo não for vazio
                        var json = jsonDiesel(diesel, volume, inicioConsumo, observacoes);

                        if (json.diesel) {
                            listTableDiesel.push(json);
                        }
                    }
                }
            });
        }

        // Combina os dados antigos com os novos preservando todos
        var combinedData = oldData.concat(listTableDiesel);

        // Salva o array atualizado como JSON
        $("#jsonTableDiesel").val(JSON.stringify(combinedData));
    });
}

function MostraTableDiesel() {
    var dieselInsumos = $("#jsonTableDiesel").val();

    if (!dieselInsumos.trim()) {
        $("#tbodyDiesel").empty();
        return;
    }

    var parsedData;
    try {
        parsedData = JSON.parse(dieselInsumos);
    } catch (e) {
        $("#tbodyDiesel").empty();
        return;
    }

    // Verifica se o JSON contém dados
    if (parsedData && parsedData.length > 0) {
        $("#tbodyDiesel").empty();
        var i;
        for (i = 0; i < parsedData.length; i++) {
            var plusId = i + 58;
            var dataConsumo = 'inicioConsumo' + plusId;

            $("#tbodyDiesel").append('\
                <tr class="trTableDiesel">\
                    <td><input type="text" class="form-control" name="diesel" id="diesel" value="' + parsedData[i].diesel + '"></td>\
                    <td><input type="text" class="form-control" name="volume" id="volume" value="' + parsedData[i].volume + '"></td>\
                    <td><input type="text" class="form-control" name="inicioConsumo" id="' + dataConsumo + '" value="' + parsedData[i].inicioConsumo + '"></td>\
                    <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + parsedData[i].observacoes + '"></td>\
                </tr>\
            ');
        }
    } else {
        $("#tbodyDiesel").empty(); // Limpa a tabela
    }
}

/* Agregado */
function jsonAgregado(agregado, volume, inicioConsumo, observacoes) {
    return {
        agregado: agregado,
        volume: volume,
        inicioConsumo: inicioConsumo,
        observacoes: observacoes
    };
}
function SalvaTableAgregado() {

    var plusId = 80;

    $('#saveButtonAgregado').click(function () {
        var listTableAgregado = [];

        if ($(".trTableAgregado").length > 0) {
            $(".trTableAgregado").each(function () {
                var idAgregado = "inicioConsumo" + plusId++;

                var agregado = $(this).find("#agregado").val();
                var volume = $(this).find("#volume").val();
                var inicioConsumo = $(this).find("#" + idAgregado).val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonAgregado(agregado, volume, inicioConsumo, observacoes);

                if (json.agregado) {
                    listTableAgregado.push(json);
                }
            })

            $("#jsonTableAgregado").val(JSON.stringify(listTableAgregado));
        }
    });
}

var editaAgregado = 91;
function EditaTableAgregado() {
    $('#saveButtonAgregado').click(function () {
        var listTableAgregado = [];
        var oldData = [];

        // Carrega o JSON existente e separa os dados com IDs abaixo de 91
        var existingData = $("#jsonTableAgregado").val();
        if (existingData) {
            var parsedData = JSON.parse(existingData);
            oldData = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber < 91;
            });
            listTableAgregado = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber >= 91;
            });
        }

        // Adiciona os novos dados (IDs >= 91)
        if ($(".trTableAgregado").length > 0) {
            $(".trTableAgregado").each(function () {
                var inicioConsumoId = $(this).find("[id^=inicioConsumo]").attr("id");
                var idNumber = parseInt(inicioConsumoId.replace(/\D/g, ''), 10);

                if (idNumber >= 91) {
                    var agregado = $(this).find("#agregado").val();
                    var volume = $(this).find("#volume").val();
                    var inicioConsumo = $(this).find("#" + inicioConsumoId).val();
                    var observacoes = $(this).find("#observacoes").val();

                    // Verifica se o valor de inicioConsumo já existe no array para IDs >= 91
                    var isDuplicate = listTableAgregado.some(function (item) {
                        return item.inicioConsumo === inicioConsumo;
                    });

                    if (!isDuplicate && inicioConsumo) { // Adiciona se não for duplicado e se inicioConsumo não for vazio
                        var json = jsonAgregado(agregado, volume, inicioConsumo, observacoes);

                        if (json.agregado) {
                            listTableAgregado.push(json);
                        }
                    }
                }
            });
        }

        // Combina os dados antigos com os novos preservando todos
        var combinedData = oldData.concat(listTableAgregado);

        // Salva o array atualizado como JSON
        $("#jsonTableAgregado").val(JSON.stringify(combinedData));
    });
}
function MostraTableAgregado() {
    var agregadoInsumos = $("#jsonTableAgregado").val();

    if (!agregadoInsumos.trim()) {
        $("#tbodyAgregado").empty();
        return;
    }

    var parsedData;
    try {
        parsedData = JSON.parse(agregadoInsumos);
    } catch (e) {
        $("#tbodyAgregado").empty();
        return;
    }

    // Verifica se o JSON contém dados
    if (parsedData && parsedData.length > 0) {
        $("#tbodyAgregado").empty();
        var i;
        for (i = 0; i < parsedData.length; i++) {
            var plusId = i + 80;
            var dataConsumo = 'inicioConsumo' + plusId;

            $("#tbodyAgregado").append('\
                <tr class="trTableAgregado">\
                    <td><input type="text" class="form-control" name="agregado" id="agregado" value="' + parsedData[i].agregado + '"></td>\
                    <td><input type="text" class="form-control" name="volume" id="volume" value="' + parsedData[i].volume + '"></td>\
                    <td><input type="text" class="form-control" name="inicioConsumo" id="' + dataConsumo + '" value="' + parsedData[i].inicioConsumo + '"></td>\
                    <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + parsedData[i].observacoes + '"></td>\
                </tr>\
            ');
        }
    } else {
        $("#tbodyAgregado").empty(); // Limpa a tabela
    }
}

/* EPI */
function jsonEpi(epi, volume, inicioConsumo, observacoes) {
    return {
        epi: epi,
        volume: volume,
        inicioConsumo: inicioConsumo,
        observacoes: observacoes
    };
}
function SalvaTableEpi() {

    var plusId = 102;

    $('#saveButtonEpi').click(function () {
        var listTableEpi = [];

        if ($(".trTableEpi").length > 0) {
            $(".trTableEpi").each(function () {
                var idEpi = "inicioConsumo" + plusId++;

                var epi = $(this).find("#epi").val();
                var volume = $(this).find("#volume").val();
                var inicioConsumo = $(this).find("#" + idEpi).val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonEpi(epi, volume, inicioConsumo, observacoes);

                if (json.epi) {
                    listTableEpi.push(json);
                }
            })

            $("#jsonTableEpi").val(JSON.stringify(listTableEpi));
        }
    });
}

var editaEpi = 115;
function EditaTableEpi() {
    $('#saveButtonEpi').click(function () {
        var listTableEpi = [];
        var oldData = [];

        // Carrega o JSON existente e separa os dados com IDs abaixo de 115
        var existingData = $("#jsonTableEpi").val();
        if (existingData) {
            var parsedData = JSON.parse(existingData);
            oldData = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber < 115;
            });
            listTableEpi = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber >= 115;
            });
        }

        // Adiciona os novos dados (IDs >= 115)
        if ($(".trTableEpi").length > 0) {
            $(".trTableEpi").each(function () {
                var inicioConsumoId = $(this).find("[id^=inicioConsumo]").attr("id");
                var idNumber = parseInt(inicioConsumoId.replace(/\D/g, ''), 10);

                if (idNumber >= 115) {
                    var epi = $(this).find("#epi").val();
                    var volume = $(this).find("#volume").val();
                    var inicioConsumo = $(this).find("#" + inicioConsumoId).val();
                    var observacoes = $(this).find("#observacoes").val();

                    // Verifica se o valor de inicioConsumo já existe no array para IDs >= 115
                    var isDuplicate = listTableEpi.some(function (item) {
                        return item.inicioConsumo === inicioConsumo;
                    });

                    if (!isDuplicate && inicioConsumo) { // Adiciona se não for duplicado e se inicioConsumo não for vazio
                        var json = jsonEpi(epi, volume, inicioConsumo, observacoes);

                        if (json.epi) {
                            listTableEpi.push(json);
                        }
                    }
                }
            });
        }

        // Combina os dados antigos com os novos preservando todos
        var combinedData = oldData.concat(listTableEpi);

        // Salva o array atualizado como JSON
        $("#jsonTableEpi").val(JSON.stringify(combinedData));
    });
}
function MostraTableEpi() {
    var epiInsumos = $("#jsonTableEpi").val();

    if (!epiInsumos.trim()) {
        $("#tbodyEpi").empty();
        return;
    }

    var parsedData;
    try {
        parsedData = JSON.parse(epiInsumos);
    } catch (e) {
        $("#tbodyEpi").empty();
        return;
    }

    // Verifica se o JSON contém dados
    if (parsedData && parsedData.length > 0) {
        $("#tbodyEpi").empty();
        var i;
        for (i = 0; i < parsedData.length; i++) {
            var plusId = i + 102;
            var dataConsumo = 'inicioConsumo' + plusId;

            $("#tbodyEpi").append('\
                <tr class="trTableEpi">\
                    <td><input type="text" class="form-control" name="epi" id="epi" value="' + parsedData[i].epi + '"></td>\
                    <td><input type="text" class="form-control" name="volume" id="volume" value="' + parsedData[i].volume + '"></td>\
                    <td><input type="text" class="form-control" name="inicioConsumo" id="' + dataConsumo + '" value="' + parsedData[i].inicioConsumo + '"></td>\
                    <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + parsedData[i].observacoes + '"></td>\
                </tr>\
            ');
        }
    } else {
        $("#tbodyEpi").empty(); // Limpa a tabela
    }
}

/* EPC */
function jsonEpc(epc, volume, inicioConsumo, observacoes) {
    return {
        epc: epc,
        volume: volume,
        inicioConsumo: inicioConsumo,
        observacoes: observacoes
    };
}
function SalvaTableEpc() {

    var plusId = 123;

    $('#saveButtonEpc').click(function () {
        var listTableEpc = [];

        if ($(".trTableEpc").length > 0) {
            $(".trTableEpc").each(function () {
                var idEpc = "inicioConsumo" + plusId++;

                var epc = $(this).find("#epc").val();
                var volume = $(this).find("#volume").val();
                var inicioConsumo = $(this).find("#" + idEpc).val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonEpc(epc, volume, inicioConsumo, observacoes);

                if (json.epc) {
                    listTableEpc.push(json);
                }
            })

            $("#jsonTableEpc").val(JSON.stringify(listTableEpc));
        }
    });
}

var editaEpc = 136;
function EditaTableEpc() {
    $('#saveButtonEpc').click(function () {
        var listTableEpc = [];
        var oldData = [];

        // Carrega o JSON existente e separa os dados com IDs abaixo de 136
        var existingData = $("#jsonTableEpc").val();
        if (existingData) {
            var parsedData = JSON.parse(existingData);
            oldData = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber < 136;
            });
            listTableEpc = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber >= 136;
            });
        }

        // Adiciona os novos dados (IDs >= 136)
        if ($(".trTableEpc").length > 0) {
            $(".trTableEpc").each(function () {
                var inicioConsumoId = $(this).find("[id^=inicioConsumo]").attr("id");
                var idNumber = parseInt(inicioConsumoId.replace(/\D/g, ''), 10);

                if (idNumber >= 136) {
                    var epc = $(this).find("#epc").val();
                    var volume = $(this).find("#volume").val();
                    var inicioConsumo = $(this).find("#" + inicioConsumoId).val();
                    var observacoes = $(this).find("#observacoes").val();

                    // Verifica se o valor de inicioConsumo já existe no array para IDs >= 136
                    var isDuplicate = listTableEpc.some(function (item) {
                        return item.inicioConsumo === inicioConsumo;
                    });

                    if (!isDuplicate && inicioConsumo) { // Adiciona se não for duplicado e se inicioConsumo não for vazio
                        var json = jsonEpc(epc, volume, inicioConsumo, observacoes);

                        if (json.epc) {
                            listTableEpc.push(json);
                        }
                    }
                }
            });
        }

        // Combina os dados antigos com os novos preservando todos
        var combinedData = oldData.concat(listTableEpc);

        // Salva o array atualizado como JSON
        $("#jsonTableEpc").val(JSON.stringify(combinedData));
    });
}
function MostraTableEpc() {
    var epcInsumos = $("#jsonTableEpc").val();

    if (!epcInsumos.trim()) {
        $("#tbodyEpc").empty();
        return;
    }

    var parsedData;
    try {
        parsedData = JSON.parse(epcInsumos);
    } catch (e) {
        $("#tbodyEpc").empty();
        return;
    }

    // Verifica se o JSON contém dados
    if (parsedData && parsedData.length > 0) {
        $("#tbodyEpc").empty();
        var i;
        for (i = 0; i < parsedData.length; i++) {
            var plusId = i + 123;
            var dataConsumo = 'inicioConsumo' + plusId;

            $("#tbodyEpc").append('\
                <tr class="trTableEpc">\
                    <td><input type="text" class="form-control" name="epc" id="epc" value="' + parsedData[i].epc + '"></td>\
                    <td><input type="text" class="form-control" name="volume" id="volume" value="' + parsedData[i].volume + '"></td>\
                    <td><input type="text" class="form-control" name="inicioConsumo" id="' + dataConsumo + '" value="' + parsedData[i].inicioConsumo + '"></td>\
                    <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + parsedData[i].observacoes + '"></td>\
                </tr>\
            ');
        }
    } else {
        $("#tbodyEpc").empty(); // Limpa a tabela
    }
}

/* Laboratorio */
function jsonLaboratorio(laboratorio, volume, inicioConsumo, observacoes) {
    return {
        laboratorio: laboratorio,
        volume: volume,
        inicioConsumo: inicioConsumo,
        observacoes: observacoes
    };
}
function SalvaTableLaboratorio() {

    var plusId = 145;

    $('#saveButtonLaboratorio').click(function () {
        var listTableLaboratorio = [];

        if ($(".trTableLaboratorio").length > 0) {
            $(".trTableLaboratorio").each(function () {
                var idLaboratorio = "inicioConsumo" + plusId++;

                var laboratorio = $(this).find("#laboratorio").val();
                var volume = $(this).find("#volume").val();
                var inicioConsumo = $(this).find("#" + idLaboratorio).val();
                var observacoes = $(this).find("#observacoes").val();

                var json = jsonLaboratorio(laboratorio, volume, inicioConsumo, observacoes);

                if (json.laboratorio) {
                    listTableLaboratorio.push(json);
                }
            })

            $("#jsonTableLaboratorio").val(JSON.stringify(listTableLaboratorio));
        }
    });
}

var editaLaboratorio = 156;
function EditaTableLaboratorio() {
    $('#saveButtonLaboratorio').click(function () {
        var listTableLaboratorio = [];
        var oldData = [];

        // Carrega o JSON existente e separa os dados com IDs abaixo de 156
        var existingData = $("#jsonTableLaboratorio").val();
        if (existingData) {
            var parsedData = JSON.parse(existingData);
            oldData = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber < 156;
            });
            listTableLaboratorio = parsedData.filter(function (item) {
                var idNumber = parseInt(item.inicioConsumo.replace(/\D/g, ''), 10);
                return idNumber >= 156;
            });
        }

        // Adiciona os novos dados (IDs >= 156)
        if ($(".trTableLaboratorio").length > 0) {
            $(".trTableLaboratorio").each(function () {
                var inicioConsumoId = $(this).find("[id^=inicioConsumo]").attr("id");
                var idNumber = parseInt(inicioConsumoId.replace(/\D/g, ''), 10);

                if (idNumber >= 156) {
                    var laboratorio = $(this).find("#laboratorio").val();
                    var volume = $(this).find("#volume").val();
                    var inicioConsumo = $(this).find("#" + inicioConsumoId).val();
                    var observacoes = $(this).find("#observacoes").val();

                    // Verifica se o valor de inicioConsumo já existe no array para IDs >= 156
                    var isDuplicate = listTableLaboratorio.some(function (item) {
                        return item.inicioConsumo === inicioConsumo;
                    });

                    if (!isDuplicate && inicioConsumo) { // Adiciona se não for duplicado e se inicioConsumo não for vazio
                        var json = jsonLaboratorio(laboratorio, volume, inicioConsumo, observacoes);

                        if (json.laboratorio) {
                            listTableLaboratorio.push(json);
                        }
                    }
                }
            });
        }

        // Combina os dados antigos com os novos preservando todos
        var combinedData = oldData.concat(listTableLaboratorio);

        // Salva o array atualizado como JSON
        $("#jsonTableLaboratorio").val(JSON.stringify(combinedData));
    });
}
function MostraTableLaboratorio() {
    var laboratorioInsumos = $("#jsonTableLaboratorio").val();

    if (!laboratorioInsumos.trim()) {
        $("#tbodyLaboratorio").empty();
        return;
    }

    var parsedData;
    try {
        parsedData = JSON.parse(laboratorioInsumos);
    } catch (e) {
        $("#tbodyLaboratorio").empty();
        return;
    }

    // Verifica se o JSON contém dados
    if (parsedData && parsedData.length > 0) {
        $("#tbodyLaboratorio").empty();
        var i;
        for (i = 0; i < parsedData.length; i++) {
            var plusId = i + 14;
            var dataConsumo = 'inicioConsumo' + plusId;

            $("#tbodyLaboratorio").append('\
                <tr class="trTableLaboratorio">\
                    <td><input type="text" class="form-control" name="laboratorio" id="laboratorio" value="' + parsedData[i].laboratorio + '"></td>\
                    <td><input type="text" class="form-control" name="volume" id="volume" value="' + parsedData[i].volume + '"></td>\
                    <td><input type="text" class="form-control" name="inicioConsumo" id="' + dataConsumo + '" value="' + parsedData[i].inicioConsumo + '"></td>\
                    <td><input type="text" class="form-control" name="observacoes" id="observacoes" value="' + parsedData[i].observacoes + '"></td>\
                </tr>\
            ');
        }
    } else {
        $("#tbodyLaboratorio").empty(); // Limpa a tabela
    }
}

/* T.I. */
function SalvaTableTi() {
    $('#saveButtonTi').click(function () {
        var dataTi = [];

        $('#equipamentosTi tbody tr').each(function () {
            var rowData = [];

            var quantdTi = $(this).find('[id^=quantdTi]').val().trim();
            var funcaoTi = $(this).find('[id^=funcaoTi]').val().trim();
            var setorTi = $(this).find('[id^=setorTi]').val().trim();

            if (quantdTi !== '') {

                if (funcaoTi === '' && setorTi === '') {
                    funcaoTi = ';';
                    setorTi = ';';
                }
                // Caso 2: Se quantdTi está preenchido, mas um dos outros está vazio
                else {
                    if (funcaoTi === '') {
                        funcaoTi = ';';
                    }
                    if (setorTi === '') {
                        setorTi = ';';
                    }
                }

                rowData.push(quantdTi);
                rowData.push(funcaoTi);
                rowData.push(setorTi);

                var labelItem = $(this).find('label').text();
                rowData.unshift(labelItem);

                dataTi.push(rowData);
            }
        });

        // Salvando os dados no campo oculto
        $("#tiData").val(JSON.stringify(dataTi));
    });
}
function MostraTableTi() {
    var dadosTi = JSON.parse($('#tiData').val());
    console.log(dadosTi);

    var tbody = $('<tbody></tbody>');

    for (var i = 0; i < dadosTi.length; i++) {
        var row = $("<tr></tr>");

        for (var j = 0; j < dadosTi[i].length; j++) {
            var cell = $("<td></td>").text(dadosTi[i][j]);
            row.append(cell);
        }

        tbody.append(row);
    }

    $('#equipamentosTi tbody').replaceWith(tbody);
}
function EditaTableTi() {
    var dadosTi = JSON.parse($('#tiData').val());
    var validRowIndex = 0;

    $('#equipamentosTi tbody tr').each(function (rowIndex) {
        var checkboxesTi = $(this).find('td input[type="checkbox"]').is(':checked');

        if (checkboxesTi) {
            var inputsVaziosTi = $(this).find('td input').toArray().every(function (input) {
                return $(input).val().trim() === '';
            });

            if (!inputsVaziosTi && validRowIndex < dadosTi.length) {
                $(this).find('td input').each(function (colIndex) {
                    if (colIndex >= 0 && colIndex < dadosTi[validRowIndex].length) {
                        $(this).val(dadosTi[validRowIndex][colIndex] || '');
                    }
                });
                validRowIndex++
            }
        }
    });

    $('#equipamentosTi tbody td input').on('blur', function () {
        var rowIndex = $(this).closest('tr').index();
        var colIndex = $(this).parent().index();

        // Certifique-se de que o índice de linha existe antes de tentar atualizar
        if (!dadosTi[rowIndex]) {
            dadosTi[rowIndex] = [];
        }

        dadosTi[rowIndex][colIndex] = $(this).val();

        $('#tiData').val(JSON.stringify(dadosTi));
    });
}

/* Central de Equipamentps */
function SalvaTableEquipamentos() {

    var plusId = 1;
    $('#saveButtonEquipamento').click(function () {
        var listTableEquipamento = [];

        if ($(".trTableEquip").length > 0) {
            $(".trTableEquip").each(function () {
                var idSwitch = 'switchEquip_' + plusId++;

                var json = {
                    machAndEquip: $(this).find("#machAndEquip").val(),
                    idSwitch: $(this).find("#" + idSwitch).prop('checked'),
                    quantdProprio: $(this).find("#quantdProprio").val(),
                    quantdTerceiros: $(this).find("#quantdTerceiros").val(),
                }

                if ($(this).find("#" + idSwitch).length > 0) {
                    json.idSwitch = $(this).find("#" + idSwitch).prop('checked');
                } else {
                    json.idSwitch = false;
                }

                listTableEquipamento.push(json);
            })

            $("#jsonTableEquipamento").val(JSON.stringify(listTableEquipamento));
        }
    })
}
function MostraTableEquipamento() {
    var dadosEquip = $("#jsonTableEquipamento").val();
    dadosEquip = JSON.parse(dadosEquip);

    for (i = 0; i < dadosEquip.length; i++) {

        var plusId = i + 1;
        var idSwitch = 'switchEquip_' + plusId;

        var isChecked = dadosEquip[i].idSwitch;

        $("#tbodyEquipments").append('\
            <tr class="trTableEquip">\
                <td><input type="text" class="form-control" name="machAndEquip" id="machAndEquip" value="' + dadosEquip[i].machAndEquip + '"></td>\
                <td><input type="checkbox" name="switchEquip" id="' + idSwitch + '" value="' + dadosEquip[i].idSwitch + '" data-on-color="success" data-off-color="danger" data-on-text="PRÓPRIO" data-off-text="TERCEIRO" size="small" ' + (isChecked ? 'checked' : '') + '></td>\
                <td class="hideTdProp" style="display: ' + (isChecked ? 'table-cell' : 'none') + ';"><input type="number" class="form-control" name="quantdProprio" id="quantdProprio" value="' + dadosEquip[i].quantdProprio + '"></td>\
                <td class="hideTdTerc" style="display: ' + (!isChecked ? 'table-cell' : 'none') + ';"><input type="number" class="form-control" name="quantdTerceiros" id="quantdTerceiros" value="' + dadosEquip[i].quantdTerceiros + '"></td>\
            </tr>\
        ');

        FLUIGC.switcher.init('#' + idSwitch);

        FLUIGC.switcher.onChange($('#' + idSwitch), function (event, state) {

            var linha = $(this).closest('tr');

            if (state) {
                linha.find('.hideTdTerc').hide();
                linha.find('.hideTdProp').show();
            } else {
                linha.find('.hideTdTerc').show();
                linha.find('.hideTdProp').hide();
            }

            /* Limitar view da table e th's */
            if (idSwitch === 'switchEquip_1') {
                if (!state) {
                    $('.hideThProp').hide();
                    $('.hideThTerc').show();
                } else {
                    $('.hideThProp').show();
                    $('.hideThTerc').hide();
                }
            }
        })
    }
}

/* Contabilidade */
function SalvaTableContabil() {

    $('#saveButtonContabilidade').click(function () {
        var listTableContabil = [];

        if ($(".trTableContabil").length > 0) {
            $(".trTableContabil").each(function () {
                var json = {
                    municipios: $(this).find("#municipios").val(),
                    CNPJContabil: $(this).find("#CNPJContabil").val(),
                    extensao: $(this).find("#extensao").val(),
                    aliquotaIss: $(this).find("#aliquotaIss").val(),
                    deducaoMaterial: $(this).find("#deducaoMaterial").val(),
                };

                if (json.municipios) {
                    listTableContabil.push(json);
                }

            })

            $("#jsonTableContabil").val(JSON.stringify(listTableContabil));
        }
    })
}
function MostraTableContabil() {
    var dadosContabil = $("#jsonTableContabil").val();
    dadosContabil = JSON.parse(dadosContabil);

    for (i = 0; i < dadosContabil.length; i++) {

        var municipiosName = dadosContabil[i].municipios.split(" ");

        if (municipiosName.length > 1) {
            var municipios = municipiosName.join(" ");

            $("#tbodyContabilidade").append('\
            <tr class="trTableContabil">\
                <td><input type="text" class="form-control" name="municipios" id="municipios" value="' + municipios + '"></td>\
                <td><input type="text" class="form-control" name="CNPJContabil" id="CNPJContabil" value=' + dadosContabil[i].CNPJContabil + '></td>\
                <td><input type="text" class="form-control" name="extensao" id="extensao" value=' + dadosContabil[i].extensao + '></td>\
                <td><input type="text" class="form-control" name="aliquotaIss" id="aliquotaIss" value=' + dadosContabil[i].aliquotaIss + '></td>\
                <td><input type="text" class="form-control" name="deducaoMaterial" id="deducaoMaterial" value=' + dadosContabil[i].deducaoMaterial + '></td>\
            </tr>\
        ')
        } else {
            $("#tbodyContabilidade").append('\
            <tr class="trTableContabil">\
                <td><input type="text" class="form-control" name="municipios" id="municipios" value="' + dadosContabil[i].municipios + '"></td>\
                <td><input type="text" class="form-control" name="CNPJContabil" id="CNPJContabil" value=' + dadosContabil[i].CNPJContabil + '></td>\
                <td><input type="text" class="form-control" name="extensao" id="extensao" value=' + dadosContabil[i].extensao + '></td>\
                <td><input type="text" class="form-control" name="aliquotaIss" id="aliquotaIss" value=' + dadosContabil[i].aliquotaIss + '></td>\
                <td><input type="text" class="form-control" name="deducaoMaterial" id="deducaoMaterial" value=' + dadosContabil[i].deducaoMaterial + '></td>\
            </tr>\
        ')
        }
    }
}
// UTILS

// function gerarPDF() {

//     var options = {
//         orientation: 'p',
//         precision: 90,
//         margins: {
//             top: 5,
//             right: 10,
//             bottom: 10,
//             left: 5,
//         },
//         unit: 'mm',
//     };

//     var doc = new jsPDF(options);
//     var nomeObra = $("#nomeObra").val();

//     /*Inicia a criação do pdf*/

//     doc.text("Relatório Reunião Zero", 105, 10, options = { align: 'center' })
//     doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
//     doc.line(10, 18, 200, 18);

//     /* Tabelas */
//     /* Quadro Técnico */

//     const quadTec = $('#quadtec .row div');
//     const data = [];

//     quadTec.each(function () {
//         const label = $(this).find('label').text().trim();
//         const input = $(this).find('.select2-selection__choice').attr("title");

//         if (label && input) {
//             const existingLabelIndex = data.findIndex(item => item[0] === label);

//             if (existingLabelIndex === -1) {
//                 data.push([label, input]);
//             } else {
//                 data[existingLabelIndex][1] = input;
//             }
//         }
//     });

//     const quadTecColumns = ['label', 'valor']

//     doc.autoTable(quadTecColumns, data, {
//         theme: 'grid',
//         head: [['Quadro Técnico']],
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//             fontSize: 14,
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//             cellWidth: number = 90,
//         },
//         startY: 30,
//     })

//     /* =============================================================  */
//     /* Apresentação da Obra */

//     const apresentaObra = $('#tableApresentaObra .row div');
//     const dataObra = [];
//     const checkboxVal = {};

//     apresentaObra.each(function () {
//         const labels = $(this).find('label').text().trim();
//         const inputs = $(this).find('input');
//         const spans = $(this).find('span').text().trim();
//         const options = $(this).find('option:selected').text().trim();

//         if (inputs.is(':checkbox')) {
//             const sliderVal = inputs.prop('checked') ? 'Sim' : 'Não';
//             const checkboxId = inputs.attr('id');

//             if (!checkboxVal.hasOwnProperty(checkboxId)) {
//                 checkboxVal[checkboxId] = sliderVal;
//                 dataObra.push([labels, sliderVal, spans, options]);
//             }
//         } else {
//             dataObra.push([labels, spans || inputs.val() || options]);
//         }
//     });

//     const apresentaObraColumns = ['label', 'valor']

//     doc.autoTable(apresentaObraColumns, dataObra, {
//         theme: 'grid',
//         head: [['Apresentação da Obra']],
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//             fontSize: 14,
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//             cellWidth: number = 90,
//         },
//         startY: 75,
//     })

//     /* =============================================================  */
//     /* Controladoria */

//     const controladoriaTable = $('#tableControladoria .panel-body .row div');
//     const dataTableControl = [];

//     controladoriaTable.each(function () {
//         const labels = $(this).find('label').text();
//         const inputs = $(this).find('input').val();

//         dataTableControl.push([labels, inputs]);
//     });

//     const tableControlColumns = ['label', 'valor']

//     doc.autoTable(tableControlColumns, dataTableControl, {
//         theme: 'grid',
//         head: [['Controladoria']],
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//             fontSize: 14,
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//             cellWidth: number = 90,
//         },
//         startY: 240,
//     })

//     /* =============================================================  */
//     /* Meio Ambiente */
//     doc.addPage();
//     doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
//     doc.line(10, 18, 200, 18);

//     const meioAmbiente = $('#tableMeioAmbiente .panel-body .row div');
//     const dataMeioAmbiente = [];
//     const checkboxValMeioAmbiente = {};

//     meioAmbiente.each(function () {
//         const labels = $(this).find('label').text();
//         const inputs = $(this).find('input');
//         const texts = $(this).find('textarea').val();

//         if (inputs.is(':checkbox')) {
//             const sliderMeioAmbiente = inputs.prop('checked') ? 'Sim' : 'Não';
//             const checkboxId = inputs.attr('id');

//             if (!checkboxValMeioAmbiente.hasOwnProperty(checkboxId)) {
//                 checkboxValMeioAmbiente[checkboxId] = sliderMeioAmbiente;
//                 dataMeioAmbiente.push([labels, sliderMeioAmbiente, texts]);
//             }
//         } else {
//             dataMeioAmbiente.push([labels, inputs.val(), texts]);
//         }
//     });

//     const meioAmbienteColumns = ['label', 'valor', 'texts']

//     doc.autoTable(meioAmbienteColumns, dataMeioAmbiente, {
//         theme: 'grid',
//         head: [['Meio Ambiente']],
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//             fontSize: 14,
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//         },
//         columnStyles: {
//             0: { cellWidth: number = 100 },
//             1: { cellWidth: number = 10 },
//             2: { cellWidth: number = 70 },
//         },
//         startY: 30,
//     })

//     /* =============================================================  */
//     /* SST */

//     doc.addPage();
//     doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
//     doc.line(10, 18, 200, 18);

//     const sst = $('#tableSegurancaTrabalho .panel-body .row div');
//     const dataSst = [];
//     const checkboxValSST = {};

//     sst.each(function () {
//         const labels = $(this).find('label').text();
//         const inputs = $(this).find('input');

//         if (inputs.is(':checkbox')) {
//             const sliderSST = inputs.prop('checked') ? 'Sim' : 'Não';
//             const checkboxId = inputs.attr('id');

//             if (!checkboxValSST.hasOwnProperty(checkboxId)) {
//                 checkboxValSST[checkboxId] = sliderSST;
//                 dataSst.push([labels, sliderSST]);
//             }
//         } else {
//             dataSst.push([labels, inputs.val()]);
//         }
//     });

//     const sstColumns = ['label', 'valor']

//     doc.autoTable(sstColumns, dataSst, {
//         theme: 'grid',
//         head: [['Segurança do Trabalho']],
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//             fontSize: 14,
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//             cellWidth: number = 90,
//         },
//         startY: 30,
//     })

//     /*Suprimentos/Compras */
//     /* Insumos */

//     /* Header */
//     let headSuprimentos = [
//         [
//             { content: 'Suprimentos/Compras', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ];

//     doc.autoTable({
//         startY: 140,
//         head: headSuprimentos,
//         theme: 'grid'
//     });

//     /* Body */
//     doc.autoTable({
//         html: '#insumosObra',
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//         },
//         startY: 148
//     });

//     /* =============================================================  */
//     /* Betuminoso */

//     doc.addPage();
//     doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
//     doc.line(10, 18, 200, 18);

//     let currentY = 30;
    
//     /* Betuminoso */
//     let headBetuminoso = [
//         [
//             { content: 'Betuminoso', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ];
    
//     var dadosBetuminoso = $("#jsonTableBetuminoso").val();
    
//     if (!dadosBetuminoso.trim()) {
//         dadosBetuminoso = [];
//     } else {
//         try {
//             dadosBetuminoso = JSON.parse(dadosBetuminoso);
//         } catch (e) {
//             dadosBetuminoso = [];
//         }
//     }

//     let betuminosoShow = false;
//     if (dadosBetuminoso.length > 0) {
//         var columnsBetuminoso = [
//             { title: "Produto", datakey: "betuminoso" },
//             { title: "Volume Estimado", datakey: "volume" },
//             { title: "Início do Consumo", datakey: "inicioConsumo" },
//             { title: "Observação", datakey: "observacoes" },
//         ];
        
//         var tableBodyBetuminoso = dadosBetuminoso.map(function (betuminoso) {
//             return [betuminoso.betuminoso, betuminoso.volume, betuminoso.inicioConsumo, betuminoso.observacoes];
//         });
        
//         doc.autoTable({
//             startY: currentY,
//             head: headBetuminoso,
//             columns: columnsBetuminoso,
//             body: tableBodyBetuminoso,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: 0.3,
//             },
//         });
        
//         // Atualiza currentY para a próxima posição após a primeira tabela
        
//         currentY = doc.previousAutoTable.finalY + 30;
//         betuminosoShow = true;
//     }
    
//     /* Aço */
//     let headAco = [
//         [
//             { content: 'Aço', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ];
    
//     var dadosAco = $("#jsonTableAco").val();
    
//     if (!dadosAco.trim()) {
//         dadosAco = [];
//     } else {
//         try {
//             dadosAco = JSON.parse(dadosAco);
//         } catch (e) {
//             dadosAco = [];
//         }
//     }

//     let acoShow = false;
//     if (dadosAco.length > 0) {
//         var columnsAco = [
//             { title: "Produto", datakey: "aco" },
//             { title: "Volume Estimado", datakey: "volume" },
//             { title: "Início do Consumo", datakey: "inicioConsumo" },
//             { title: "Observação", datakey: "observacoes" },
//         ];
        
//         var tableBodyAco = dadosAco.map(function (aco) {
//             return [aco.aco, aco.volume, aco.inicioConsumo, aco.observacoes];
//         });
        
//         doc.autoTable({
//             startY: currentY,
//             head: headAco,
//             columns: columnsAco,
//             body: tableBodyAco,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: 0.3,
//             }
//         });

//         currentY = doc.previousAutoTable.finalY + 30;
//         acoShow = true;
//     }


//     /* Diesel */
//     let headDiesel = [
//         [
//             { content: 'Diesel', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ]
    
//     var dadosDiesel = $("#jsonTableDiesel").val();
//     if (!dadosDiesel.trim()) {
//         dadosDiesel = [];
//     } else {
//         try {
//             dadosDiesel = JSON.parse(dadosDiesel);
//         } catch (e) {
//             dadosDiesel = [];
//         }
//     }

//     if (dadosDiesel.length > 0) {
//         var columns = [
//             { title: "Produto", datakey: "diesel" },
//             { title: "Volume Estimado", datakey: "volume" },
//             { title: "Início do Consumo", datakey: "inicioConsumo" },
//             { title: "Observação", datakey: "observacoes" },
//         ]
    
//         var tableBody = dadosDiesel.map(function (diesel) {
//             return [diesel.diesel, diesel.volume, diesel.inicioConsumo, diesel.observacoes]
//         });
    
//         doc.autoTable({
//             startY: currentY,
//             head: headDiesel,
//             columns: columns,
//             body: tableBody,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: border = 0.3,
//             },
//         });

//         currentY = doc.previousAutoTable.finalY + 30;
//     }


//     /* =============================================================  */
//     /* Epi */

//     doc.addPage();
//     doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
//     doc.line(10, 18, 200, 18);

//     let currentYaxis = 30;

//     let headAgregado = [
//         [
//             { content: 'Agregado', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ]

//     var dadosAgregado = $("#jsonTableAgregado").val();

//     if (!dadosAgregado.trim()) {
//         dadosAgregado = [];
//     } else {
//         try {
//             dadosAgregado = JSON.parse(dadosAgregado);
//         } catch (e) {
//             dadosAgregado = [];
//         }
//     }

//     let agregadoShow = false;
//     if (dadosAgregado.length > 0) {
//         var columnsAgregado = [
//             { title: "Produto", datakey: "agregado" },
//             { title: "Volume Estimado", datakey: "volume" },
//             { title: "Início do Consumo", datakey: "inicioConsumo" },
//             { title: "Observação", datakey: "observacoes" },
//         ]
    
//         var tableBodyAgregado = dadosAgregado.map(function (agregado) {
//             return [agregado.agregado, agregado.volume, agregado.inicioConsumo, agregado.observacoes]
//         });
    
//         doc.autoTable({
//             startY: currentYaxis,
//             head: headAgregado,
//             columns: columnsAgregado,
//             body: tableBodyAgregado,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: border = 0.3,
//             },
//         });

//         currentYaxis = doc.previousAutoTable.finalY + 30;
//         agregadoShow = true;
//     }


//     /* Epi */

//     let headEpi = [
//         [
//             { content: 'Epi', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ]

//     var dadosEpi = $("#jsonTableEpi").val();

//     if (!dadosEpi.trim()) {
//         dadosEpi = [];
//     } else {
//         try {
//             dadosEpi = JSON.parse(dadosEpi);
//         } catch (e) {
//             dadosEpi = [];
//         }
//     }

//     let epiShow = false;
//     if (dadosEpi.length > 0) {
//         var columnsEpi = [
//             { title: "Produto", datakey: "epi" },
//             { title: "Volume Estimado", datakey: "volume" },
//             { title: "Início do Consumo", datakey: "inicioConsumo" },
//             { title: "Observação", datakey: "observacoes" },
//         ]
    
//         var tableBodyEpi = dadosEpi.map(function (epi) {
//             return [epi.epi, epi.volume, epi.inicioConsumo, epi.observacoes]
//         });
        
//         doc.autoTable({
//             startY: currentYaxis,
//             head: headEpi,
//             columns: columnsEpi,
//             body: tableBodyEpi,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: border = 0.3,
//             },
//         });

//         currentYaxis = doc.previousAutoTable.finalY + 30;
//         epiShow = true;
//     }


//     /* Epc */

//     let headEpc = [
//         [
//             { content: 'Epc', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ]

//     var dadosEpc = $("#jsonTableEpc").val();

//     if (!dadosEpc.trim()) {
//         dadosEpc = [];
//     } else {
//         try {
//             dadosEpc = JSON.parse(dadosEpc);
//         } catch (e) {
//             dadosEpc = [];
//         }
//     }

//     if (dadosEpc.length > 0) {
//         var columnsEpc = [
//             { title: "Produto", datakey: "epc" },
//             { title: "Volume Estimado", datakey: "volume" },
//             { title: "Início do Consumo", datakey: "inicioConsumo" },
//             { title: "Observação", datakey: "observacoes" },
//         ]
    
//         var tableBodyEpc = dadosEpc.map(function (epc) {
//             return [epc.epc, epc.volume, epc.inicioConsumo, epc.observacoes]
//         });
    
//         doc.autoTable({
//             startY: currentYaxis,
//             head: headEpc,
//             columns: columnsEpc,
//             body: tableBodyEpc,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: border = 0.3,
//             },
//         });

//         currentYaxis = doc.previousAutoTable.finalY + 30;
//     }


//     /* =============================================================  */
//     /* Laboratorio */

//     doc.addPage();
//     doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
//     doc.line(10, 18, 200, 18);

//     let currentYposition = 30;


//     let headLaboratorio = [
//         [
//             { content: 'Laboratorio', colspan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ]

//     var dadosLaboratorio = $("#jsonTableLaboratorio").val();

//     if (!dadosLaboratorio.trim()) {
//         dadosLaboratorio = [];
//     } else {
//         try {
//             dadosLaboratorio = JSON.parse(dadosLaboratorio);
//         } catch (e) {
//             dadosLaboratorio = [];
//         }
//     }

//     let laboratorioShow = false;
//     if (dadosLaboratorio.length > 0) {
//         var columnsLaboratorio = [
//             { title: "Produto", datakey: "laboratorio" },
//             { title: "Volume Estimado", datakey: "volume" },
//             { title: "Início do Consumo", datakey: "inicioConsumo" },
//             { title: "Observação", datakey: "observacoes" },
//         ]
    
//         var tableBodyLaboratorio = dadosLaboratorio.map(function (laboratorio) {
//             return [laboratorio.laboratorio, laboratorio.volume, laboratorio.inicioConsumo, laboratorio.observacoes]
//         });
    
//         doc.autoTable({
//             startY: currentYposition,
//             head: headLaboratorio,
//             columns: columnsLaboratorio,
//             body: tableBodyLaboratorio,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: border = 0.3,
//             },
//         });

//         currentYposition = doc.previousAutoTable.finalY + 30;
//         laboratorioShow = true;
//     }


//     /* Veiculos */

//     let headVeiculos = [
//         [
//             { content: 'Veículos', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ];

//     var dadosVeiculos = $("#jsonTableVeiculo").val();
//     dadosVeiculos = JSON.parse(dadosVeiculos);

//     let veiculosShow = false;
//     if (dadosVeiculos.length > 0) {
//         var columns = [
//             { title: "Marca", dataKey: "veiculo" },
//             { title: "Quantidade", dataKey: "quantdVeiculo" },
//             { title: "Modelo", dataKey: "modeloVeiculo" },
//             { title: "Observação", dataKey: "observacoes" },
//         ];
    
//         var tableBody = dadosVeiculos.map(function (vehicle) {
//             return [vehicle.veiculo, vehicle.quantdVeiculo, vehicle.modeloVeiculo, vehicle.observacoes];
//         });
    
//         doc.autoTable({
//             startY: currentYposition,
//             head: headVeiculos,
//             columns: columns,
//             body: tableBody,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: border = 0.3,
//             },
//         });

//         currentYposition = doc.previousAutoTable.finalY + 30;
//         veiculosShow = true;
//     }
    

//     /* Contabilidade */
//     let headContabil = [
//         [
//             { content: 'Contabilidade', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ];

//     var dadosContabil = $("#jsonTableContabil").val();
//     dadosContabil = JSON.parse(dadosContabil);

//     if (dadosContabil.length > 0) {
//         var columns = [
//             { title: "Municípios", dataKey: "municipios" },
//             { title: "CNPJ", dataKey: "CNPJContabil" },
//             { title: "Extensão %", dataKey: "extensao" },
//             { title: "Aliquota ISS", dataKey: "aliquotaIss" },
//             { title: "Dedução Material Permitida", dataKey: "deducaoMaterial" },
//         ];
    
//         var tableBody = dadosContabil.map(function (control) {
//             return [control.municipios, control.CNPJContabil, control.extensao, control.aliquotaIss, control.deducaoMaterial];
//         });
    
//         doc.autoTable({
//             startY: currentYposition,
//             head: headContabil,
//             columns: columns,
//             body: tableBody,
//             headStyles: {
//                 fillColor: ['#3a3a3a'],
//                 textColor: ['ffffff'],
//             },
//             bodyStyles: {
//                 lineColor: 10,
//                 lineWidth: border = 0.3,
//             },
//         });

//         currentYposition = doc.previousAutoTable.finalY + 30;
//     }

//     /* =============================================================  */
//     /* T.I */

//     doc.addPage();
//     doc.addImage('responsive_logo.png', 'PNG', 10, 5, 55, 10, 'logo_castilho', 'NONE', 0);
//     doc.line(10, 18, 200, 18);

//     let headTi = [
//         [
//             { content: 'Tecnologia da Informação', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ];

//     doc.autoTable({
//         startY: 30,
//         head: headTi,
//         theme: 'grid'
//     });

//     doc.autoTable({
//         html: '#equipamentosTi',
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//         },
//         startY: 38
//     });
//     /* Central de Equipamentos */

//     let headEquip = [
//         [
//             { content: 'Central de Equipamentos', colSpan: 3, styles: { halign: 'left', fontSize: 14, fillColor: ['#3a3a3a'] } }
//         ],
//     ];

//     doc.autoTable({
//         startY: 160,
//         head: headEquip,
//         theme: 'grid'
//     });

//     var dadosEquip = $("#jsonTableEquipamento").val();
//     dadosEquip = JSON.parse(dadosEquip);

//     var columns = [
//         { title: "Máquinas e Equipamentos", dataKey: "machAndEquip" },
//         { title: "Quantidade Próprio", dataKey: "quantdProprio" },
//         { title: "Quantidade Terceiros", dataKey: "quantdTerceiros" },
//     ];

//     var tableBody = dadosEquip.map(function (equip) {
//         return [equip.machAndEquip, equip.quantdProprio, equip.quantdTerceiros];
//     });

//     doc.autoTable({
//         columns: columns,
//         body: tableBody,
//         headStyles: {
//             fillColor: ['#3a3a3a'],
//             textColor: ['ffffff'],
//         },
//         bodyStyles: {
//             lineColor: 10,
//             lineWidth: border = 0.3,
//         },
//         startY: 168,
//     });

//     $('#suprimentos, #controladoria, #contabilidade, #ti, #centralEquipments').hide();
//     doc.save("ReuniãoZero - " + nomeObra + ".pdf");

//     /* faz o upload do pdf dentro da pasta da obra */
//     var fileName = 'ReuniãoZero - ' + nomeObra + '.pdf';

//     const jsons = ['jsonTableBetuminoso', 'jsonTableAco', 'jsonTableDiesel', 'jsonTableAgregado', 'jsonTableEpi', 'jsonTableEpc', 'jsonTableLaboratorio'];

//     /* filtra os JSONs vazios */
//     const validJsons = jsons.map(id => window[id]).filter(json => Object.keys(json).length > 0);

//     /* gera o pdf usando os json válidos e deixando tabelas vazias em branco */
//     validJsons.forEach(json => {
//         doc.text(JSON.stringify(json));
//     });

//     fetch(`/api/public/2.0/contentfiles/upload/?fileName=${fileName}`,
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/octet-stream",
//             },
//             cache: "no-cache",
//             body: doc.output('blob')
//         }
//     ).then(function (response) {
//         if (!response.ok) {
//             throw "Erro ao enviar o arquivo";
//         }

//         /* Cria o documento dentro do Fluig */

//     }).then(async function () {
//         let document = {
//             companyId: window.parent.WCMAPI.organizationId,
//             description: fileName,
//             immutable: true,
//             parentId: 7883,
//             // parentId: 744514,
//             isPrivate: false,
//             downloadEnabled: true,
//             attachments: [{
//                 fileName: fileName,
//             }],
//         };

//         const response = await fetch(
//             "/api/public/ecm/document/createDocument",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json;charset=utf-8",
//                 },
//                 cache: "no-cache",
//                 body: JSON.stringify(document)

//             }
//         );
//         if (!response.ok) {
//             throw "Erro ao Salvar documento na Pasta Indicada";
//         }
//         /* Atribui o pdf ao idDoc para ser salvo no sistema */

//         const response_1 = await response.json();
//         const idPdf = response_1.content;
//         const inputDocPdf = $("#idDocReuniaoZero");

//         if (idPdf) {
//             inputDocPdf.val(idPdf.id);
//         } else {
//             console.error("Erro ao salvar JSON");
//         }

//         return response_1.content;

//         /* Busca pasta recém criada */
//     }).then(async function () {
//         var idPasta = $("#idPastaObra").val();

//         const response = await fetch(
//             "/api/public/ecm/document/listDocumentWithChildren/" + idPasta,
//             {
//                 method: "GET",
//             }
//         );
//         if (!response.ok) {
//             throw "Erro ao buscar pasta da obra";
//         }

//         /* Muda a pasta do documento */
//     }).then(async function () {
//         var idDoc = $("#idDocReuniaoZero").val();
//         var idPasta = $("#idPastaObra").val();

//         let document = {
//             id: idDoc,
//             parentId: idPasta
//         }

//         const response = await fetch(
//             "/api/public/ecm/document/updateDocumentFolder",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json;charset=utf-8",
//                 },
//                 cache: "no-cache",
//                 body: JSON.stringify(document)
//             }
//         )
//         if (!response.ok) {
//             throw "Erro ao mudar pasta do documento";
//         }
//     })
// }

function validaCampos() {
    var valida = true;

    if ($("#atividade").val() == 0) {
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
            }
            else {
                $(this).removeClass("has-error");
            }
        })
    }

    if ($("#atividade").val() == 7) {
        // Checagem das tabelas com checkboxes
        $("tr").each(function() {
            const checkbox = $(this).find("input[type='checkbox']");

            if (checkbox.is(":checked")) {
                $(this).find(".form-control").each(function() {
                    if ($(this).val() == "" || $(this).val() == null) {
                        $(this).addClass("has-error");
    
                        if (valida === true) {
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
                });
            } else {
                $(this).find(".form-control").removeClass("has-error");
            }
        });

        $(".trTableContabil .form-control").each(function() {
            if ($(this).val() == "" || $(this).val() == null) {
                $(this).addClass("has-error");

                if (valida == true) {
                    valida = false;
                }
            } else {
                $(this).removeClass("has-error");
            }
        })

        $(".trTableSuprimento .form-control").each(function() {
            if ($(this).val() == "" || $(this).val() == null) {
                $(this).addClass("has-error");

                if (valida == true) {
                    valida = false;
                }
            } else {
                $(this).removeClass("has-error");
            }
        })
        
        $(".trTableEquip .form-control").first().each(function() {
            if ($(this).val() == "" || $(this).val() == null) {
                $(this).addClass("has-error");

                if (valida == true) {
                    valida = false;
                }
            } else {
                $(this).removeClass("has-error");
            }
        })
    }

    if ($("#atividade").val() == 7 || $("#atividade").val() == 10) {
        $(".inputSST").each(function () {
            if ($(this).val() == "" || $(this).val() == null) {
                $(this).addClass("has-error");

                if (valida == true) {
                    valida = false;
                }
            } else {
                $(this).removeClass("has-error");
            }
        })
    }


    return valida;
}

// Funções das tabelas

/* -- Linhas para cada tabela --- 21

Betuminoso --- 14 à 35
Aço - 36 à 57
Diesel - 58 à 79
Agregado - 80 à 101
EPI - 102 à 122
EPC - 123 à 144
Laboratorio - 145 à 166

*/


/* Tabela Suprimentos */
function linhaTableSuprimentos() {
    var newLinhaTableSuprimento =
        '<tr class="trTableSuprimento">' +
        '<td><input type="text" class="form-control" name="veiculo" id="veiculo"></td>' +
        '<td><input type="text" class="form-control" name="quantdVeiculo" id="quantdVeiculo"></td>' +
        '<td><input type="text" class="form-control" name="modeloVeiculo" id="modeloVeiculo"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyVeiculos').append(newLinhaTableSuprimento);
}

/* Betuminoso */
var plusBetuminoso = 14;
function linhaTableBetuminoso() {
    var newLinhaTableBetuminoso =
        '<tr class="trTableBetuminoso">' +
        '<td><input type="text" class="form-control" name="betuminoso" id="betuminoso"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + plusBetuminoso + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyBetuminoso').append(newLinhaTableBetuminoso);

    FLUIGC.calendar("#inicioConsumo" + plusBetuminoso);
    plusBetuminoso++;
}

function linhaEditaBetuminoso() {
    var newLinhaEditaBetuminoso =
        '<tr class="trTableBetuminoso">' +
        '<td><input type="text" class="form-control" name="betuminoso" id="betuminoso"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + editaBetuminoso + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyBetuminoso').append(newLinhaEditaBetuminoso);

    FLUIGC.calendar("#inicioConsumo" + editaBetuminoso);
    editaBetuminoso++;
}

/* Aço */
var plusAco = 36;
function linhaTableAco() {
    var newLinhaTableAco =
        '<tr class="trTableAco">' +
        '<td><input type="text" class="form-control" name="aco" id="aco"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + plusAco + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyAco').append(newLinhaTableAco);
    FLUIGC.calendar("#inicioConsumo" + plusAco);

    plusAco++;
}
function linhaEditaAco() {
    var newLinhaEditaAco =
        '<tr class="trTableAco">' +
        '<td><input type="text" class="form-control" name="aco" id="aco"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + editaAco + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyAco').append(newLinhaEditaAco);
    FLUIGC.calendar("#inicioConsumo" + editaAco);

    editaAco++;
}

/* Diesel */
var plusDiesel = 58;
function linhaTableDiesel() {
    var newLinhaTableDiesel =
        '<tr class="trTableDiesel">' +
        '<td><input type="text" class="form-control" name="diesel" id="diesel"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + plusDiesel + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyDiesel').append(newLinhaTableDiesel);
    FLUIGC.calendar("#inicioConsumo" + plusDiesel);

    plusDiesel++;
}
function linhaEditaDiesel() {
    var newLinhaEditaDiesel =
        '<tr class="trTableDiesel">' +
        '<td><input type="text" class="form-control" name="diesel" id="diesel"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + editaDiesel + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyDiesel').append(newLinhaEditaDiesel);
    FLUIGC.calendar("#inicioConsumo" + editaDiesel);

    editaDiesel++;
}

/* Agregado */
var plusAgregado = 80;
function linhaTableAgregado() {
    var newLinhaTableAgregado =
        '<tr class="trTableAgregado">' +
        '<td><input type="text" class="form-control" name="agregado" id="agregado"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + plusAgregado + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyAgregado').append(newLinhaTableAgregado);
    FLUIGC.calendar("#inicioConsumo" + plusAgregado);

    plusAgregado++;
}
function linhaEditaAgregado() {
    var newLinhaEditaAgregado =
        '<tr class="trTableAgregado">' +
        '<td><input type="text" class="form-control" name="agregado" id="agregado"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + editaAgregado + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyAgregado').append(newLinhaEditaAgregado);
    FLUIGC.calendar("#inicioConsumo" + editaAgregado);

    editaAgregado++;
}

/* EPI */
var plusEpi = 102;
function linhaTableEpi() {
    var newLinhaTableEpi =
        '<tr class="trTableEpi">' +
        '<td><input type="text" class="form-control" name="epi" id="epi"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + plusEpi + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyEpi').append(newLinhaTableEpi);
    FLUIGC.calendar("#inicioConsumo" + plusEpi);

    plusEpi++;
}
function linhaEditaEpi() {
    var newLinhaEditaEpi =
        '<tr class="trTableEpi">' +
        '<td><input type="text" class="form-control" name="epi" id="epi"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + editaEpi + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyEpi').append(newLinhaEditaEpi);
    FLUIGC.calendar("#inicioConsumo" + editaEpi);

    editaEpi++;
}

/* EPI */
var plusEpc = 123;
function linhaTableEpc() {
    var newLinhaTableEpc =
        '<tr class="trTableEpc">' +
        '<td><input type="text" class="form-control" name="epc" id="epc"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + plusEpc + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyEpc').append(newLinhaTableEpc);
    FLUIGC.calendar("#inicioConsumo" + plusEpc);

    plusEpc++;
}
function linhaEditaEpc() {
    var newLinhaEditaEpc =
        '<tr class="trTableEpc">' +
        '<td><input type="text" class="form-control" name="epc" id="epc"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + editaEpc + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyEpc').append(newLinhaEditaEpc);
    FLUIGC.calendar("#inicioConsumo" + editaEpc);

    editaEpc++;
}

/* Laboratorio */
var plusLaboratorio = 145;
function linhaTableLaboratorio() {
    var newLinhaTableLaboratorio =
        '<tr class="trTableLaboratorio">' +
        '<td><input type="text" class="form-control" name="Laboratorio" id="Laboratorio"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + plusLaboratorio + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyLaboratorio').append(newLinhaTableLaboratorio);
    FLUIGC.calendar("#inicioConsumo" + plusLaboratorio);

    plusLaboratorio++;
}
function linhaEditaLaboratorio() {
    var newLinhaEditaLaboratorio =
        '<tr class="trTableLaboratorio">' +
        '<td><input type="text" class="form-control" name="Laboratorio" id="Laboratorio"></td>' +
        '<td><input type="text" class="form-control" name="volume" id="volume"></td>' +
        '<td><input type="text" class="form-control" name="inicioConsumo" id="inicioConsumo' + editaLaboratorio + '"></td>' +
        '<td><input type="text" class="form-control" name="observacoes" id="observacoes"></td>' +
        '</tr>';

    $('#tbodyLaboratorio').append(newLinhaEditaLaboratorio);
    FLUIGC.calendar("#inicioConsumo" + editaLaboratorio);

    editaLaboratorio++;
}

/* Tabela Controladoria */
function linhaTableContabil() {
    var newLinhaTableContabil =
        '<tr class="trTableContabil">' +
        '<td><input type="text" class="form-control" name="municipios" id="municipios" placeholder="Município"></td>' +
        '<td><input type="text" class="form-control" name="CNPJContabil" id="CNPJContabil" placeholder="CNPJ"></td>' +
        '<td><input type="text" class="form-control" name="extensao" id="extensao" placeholder="Extensão"></td>' +
        '<td><input type="text" class="form-control" name="aliquotaIss" id="aliquotaIss" placeholder="Aliquota ISS"></td>' +
        '<td><input type="text" class="form-control" name="deducaoMaterial" id="deducaoMaterial" placeholder="Dedução Material"></td>' +
        '</tr>';

    $('#tbodyContabilidade').append(newLinhaTableContabil);
}

/* Tabela Central de Equipamentos */
var plusId = 1;
function linhaTableEquip() {

    // Função para verificar se um ID já está em uso
    function getNextAvailableId() {
        while ($('#switchEquip_' + plusId).length > 0) {
            plusId++;
        }
        return plusId;
    }

    // Obter o próximo ID disponível
    var idSwitchNumber = getNextAvailableId();
    var idSwitch = 'switchEquip_' + idSwitchNumber;
    plusId++; // Incrementa o plusId para o próximo uso

    var newLinhaTableEquip =
        '<tr class="trTableEquip">' +
        '<td><input type="text" class="form-control" name="machAndEquip" id="machAndEquip"></td>' +
        '<td><input type="checkbox" name="switchEquip" id="' + idSwitch + '" data-on-color="success" data-off-color="danger" data-on-text="PRÓPRIO" data-off-text="TERCEIRO" size="small"></td>' +
        '<td class="hideTdProp" style="display: none;"><input type="number" class="form-control" name="quantdProprio" id="quantdProprio"></td>' +
        '<td class="hideTdTerc"><input type="number" class="form-control" name="quantdTerceiros" id="quantdTerceiros"></td>' +
        '</tr>';

    $('#tbodyEquipments').append(newLinhaTableEquip);

    FLUIGC.switcher.init('#' + idSwitch);

    FLUIGC.switcher.onChange($('#' + idSwitch), function (event, state) {

        var linha = $(this).closest('tr');

        if (state) {
            linha.find('.hideTdTerc').hide();
            linha.find('.hideTdProp').show();
        } else {
            linha.find('.hideTdTerc').show();
            linha.find('.hideTdProp').hide();
        }

        /* Limitar view da table e th's */
        if (idSwitchNumber === 1) {
            if (state) {
                $('.hideThProp').show();
                $('.hideThTerc').hide();
            } else {
                $('.hideThProp').hide();
                $('.hideThTerc').show();
            }
        }
    });
}

function RetornaDescriçãoDoDocumentoPorId(ID) {
    var retorno = null;
    parent.WCMAPI.Create({
        // url: "http://fluig.castilho.com.br:1010" + "/api/public/2.0/folderdocuments/get/" + ID, //Prod
        url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/2.0/folderdocuments/get/" + ID, //Dev
        method: "GET",
        async: false,
        success: function (data) {
            retorno = data.content.documentDescription;
        },
    });
    return retorno;
}

async function CarregaListaDeRegionais() {
    $("#regionalObra").empty();

    if($("#coligada").val() == "castilho") {
        parent.WCMAPI.Create({
            method: "GET",
            // url: parent.WCMAPI.serverURL + "/api/public/ecm/document/listDocument/49", //Prod
            // url: parent.WCMAPI.serverURL + "/api/public/ecm/document/listDocument/13697", //Homolog
            url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/ecm/document/listDocument/7883", //Dev
            error: function (x, e) {
                console.log(x);
                console.log(e);
                if (x.status == 500) {
                    alert("Busca regionais das obras: Erro Interno do Servidor: entre em contato com o Administrador.");
                }
            },
            success: function (retorno) {
                //  for (var i = 0; i < 7; i++) { // Prod
                for (var i = 0; i < 5; i++) {
    
                    var optionText = retorno.content[i].description;
    
                    var option = "<option value=" + retorno.content[i].id + ">" + optionText + "</option>";
                    $("#regionalObra").append(option);
                }
    
                $("#regionalObra").change(function () {
                    var selectedOptionText = $("#regionalObra option:selected").text();
                    $("#valorSpan").val(selectedOptionText);
                });
    
                // Atualiza o valor do input hidden com o valor inicial do select
                var initialOptionText = $("#regionalObra option:selected").text();
                $("#valorSpan").val(initialOptionText);
            }
        });
    }

    else if($("#coligada").val() == "dromos") {
        parent.WCMAPI.Create({
            method: "GET",
            // url: parent.WCMAPI.serverURL + "/api/public/ecm/document/listDocument/1245095", //Prod
            url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/ecm/document/listDocument/20304", //Dev
            error: function (x, e) {
                console.log(x);
                console.log(e);
                if (x.status == 500) {
                    alert("Busca regionais das obras: Erro Interno do Servidor: entre em contato com o Administrador.");
                }
            },
            success: function (retorno) {
                //  for (var i = 0; i < 7; i++) { // Prod
                for (var i = 0; i < 5; i++) {
    
                    var optionText = retorno.content[i].description;
    
                    var option = "<option value=" + retorno.content[i].id + ">" + optionText + "</option>";
                    $("#regionalObra").append(option);
                }
    
                $("#regionalObra").change(function () {
                    var selectedOptionText = $("#regionalObra option:selected").text();
                    $("#valorSpan").val(selectedOptionText);
                });
    
                // Atualiza o valor do input hidden com o valor inicial do select
                var initialOptionText = $("#regionalObra option:selected").text();
                $("#valorSpan").val(initialOptionText);
            }
        });
    }
}

/* ==================================================== */
/*  Area delimitada para a seção de criação, edição e inclusão de novas obras */

// function AplicaPermissaoNasPastaParaAObra() {
//     var idPastaObra = $("#idPastaObra").val();

//     parent.WCMAPI.Create({
//         method: "GET",
//         url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/ecm/document/listDocument/" + idPastaObra, //Dev
//         error: function (x, e) {
//             console.log(x);
//             console.log(e);
//             if (x.status == 500) {
//                 // alert("Listar documentos das pastas da obra: Erro Interno do Servidor: entre em contato com o Administrador.");
//             }
//         },
//         success: async function (retorno) {
//             console.log(retorno.content);

//             for (var i = 0; i < retorno.content.length; i++) {
//                 try {
//                     var dados = await BuscaPermissoesDaPasta(retorno.content[i].id, 1000);

//                     var groups = [];
//                     var ds = DatasetFactory.getDataset("group", null, [], null);

//                     for (var j = 0; j < ds.values.length; j++) {
//                         groups.push(ds.values[j]["groupPK.groupId"]);
//                     }

//                     dados.push({ securityLevel: 2, securityVersion: false, inheritSecurity: false, downloadEnabled: false, showContent: true, attributionType: 2, attributionValue: groups[28] });
//                     dados.push({ securityLevel: 3, securityVersion: false, inheritSecurity: false, downloadEnabled: false, showContent: true, attributionType: 2, attributionValue: groups[25] });

//                     var data = {
//                         documentId: retorno.content[i].id,
//                         documentPermissionVO: dados,
//                     };

//                     parent.WCMAPI.Create({
//                         method: "POST",
//                         url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/2.0/documents/setDocumentPermissions/", //Dev
//                         contentType: "application/json",
//                         data: JSON.stringify(data),
//                         success: function () {
//                             console.log(data);
//                         },
//                         error: function (x, e) {
//                             console.log(x);
//                             console.log(e);
//                             if (x.status == 500) {
//                                 //alert("Alterar permisão das pastas da obra: Erro Interno do Servidor: entre em contato com o Administrador.");
//                             }
//                         },
//                     });
//                 } catch (error) {
//                     console.error("Erro ao buscar permissões para o documento " + retorno.content[i].id, error);
//                 }
//             }
//         },
//     });
// }

// function RetornaListPermissao(list) {
//     var permissao = [];
//     for (var i = 0; i < list.length; i++) {
//         permissao.push({ securityLevel: list[i][2], downloadEnabled: false, showContent: true, attributionType: list[i][2], attributionValue: list[i][0] });
//     }
//     return permissao;
// }

// function CriaPastaObra(json) {
//     var id = CriarPasta(json[0].parentFolder, json[0].nome, json[0].permissao, json[0].inheritSecurity);
//     console.log(id);

//     for (var i = 0; i < json[0].pastasChild.length; i++) {
//         json[0].pastasChild[i].parentFolder = id;
//         CriaPastaObra([json[0].pastasChild[i]]);
//     }
//     return id;
// }

// function CriarPastasDaObra() {
//     var nomePasta = $("#nomeObra").val();
//     var ccusto = $("#centroCusto").val();

//     const groups = [];
//     const ds = DatasetFactory.getDataset("group", null, [], null);

//     for (var j = 0; j < ds.values.length; j++) {
//         groups.push(ds.values[j]["groupPK.groupId"]);
//     }

//     var json = [
//         {
//             //Pasta Obra
//             nome: ccusto + " - " + nomePasta,
//             parentFolder: $("#regionalObra").val(),
//             permissao: RetornaListPermissao([
//                 [groups[25], 0, 2],
//                 [groups[28], 1, 2],
//                 [$("#usuario").val(), 2, 1],
//             ]),
//             inheritSecurity: false,
//             pastasChild: [
//                 {
//                     //Pasta Acompanhamento e Planejamento da Obra
//                     nome: "pasta_01",
//                     parentFolder: "",
//                     inheritSecurity: false,
//                     permissao: RetornaListPermissao([
//                         [groups[25], 0, 2],
//                         [groups[28], 1, 2],
//                         [$("#usuario").val(), 2, 1],
//                     ]),
//                 },
//                 {
//                     //Pasta Suprimentos
//                     nome: "pasta_02",
//                     parentFolder: "",
//                     inheritSecurity: false,
//                     permissao: RetornaListPermissao([
//                         [groups[25], 0, 2],
//                         [groups[28], 1, 2],
//                         [$("#usuario").val(), 2, 1],
//                     ]),
//                     pastasChild: [],
//                 },
//             ],
//         },
//     ];

//     $("#idPastaObra").val(CriaPastaObra(json));
// }

/*Criação de Pastas e subpastas*/
async function CriaPastasDaObra() {
    try {
        var ccusto = $("#centroCusto").val();
        var nomePasta = ccusto + " - " + $("#nomeObra").val();

        var IDPastaDaRegional = $("#regionalObra").val();
        var pastas = await BuscaPastaModelo();

        var json = [];
        for (const Pasta of pastas) {
            json.push(await BuscaParametrosDaPasta(Pasta));
        }

        var parentId = await CriarPasta(IDPastaDaRegional, nomePasta, [], false);

        for (const Pasta of json) {
            await CriarPasta(parentId, Pasta.description, Pasta.permissao, Pasta.children, false);
        }

        $("#idPastaObra").val(parentId);

    } catch (error) {
        console.error("Erro ao Criar Pastas da Obra");
        console.error(error);
    }
}

async function BuscaParametrosDaPasta(pasta) {
    try {
        var children = [];

        for (const Pasta of pasta.children) {
            children.push(await BuscaParametrosDaPasta(Pasta));
        }

        var json = {
            description: pasta.description,
            permissao: await BuscaPermissoesDaPasta(pasta.id, pasta.version),
            children: children
        }

        return json;
    } catch (error) {
        console.error("Erro ao Buscar parametros da Pasta: " + pasta.id);
        console.error(error);
    }
}

function BuscaPermissoesDaPasta(id, version) {
    return new Promise((resolve, reject) => {
        parent.WCMAPI.Create({
            method: "GET",
            // url: "http://fluig.castilho.com.br:1010/" + "/api/public/2.0/documents/getDocumentPermissions/" + id + "/" + version, //Prod
            url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/2.0/documents/getDocumentPermissions/" + id + "/" + version, //Dev
            contentType: "application/json",
            success: function (retorno) {
                resolve(retorno.content);
            },
            error: function (x, e) {
                console.log(x);
                console.log(e);
                if (x.status == 500) {
                    alert("Erro ao buscar documentos em check-out: Erro Interno do Servidor: entre em contato com o Administrador.");
                }
                reject();
            }
        });
    });
}

function BuscaPastaModelo() {
    return new Promise((resolve, reject) => {
        parent.WCMAPI.Create({
            method: "GET",
            // url: parent.WCMAPI.serverURL + "/api/public/ecm/document/listDocumentWithChildren/744518", //Prod
            // url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/ecm/document/listDocumentWithChildren/7704", //Dev
            url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/ecm/document/listDocumentWithChildren/15917", //Dev
            contentType: "application/json",
            success: function (retorno) {
                console.log(retorno)
                resolve(retorno.content[0].children)
            },
            error: function (x, e) {
                console.log(x);
                console.log(e);
                if (x.status == 500) {
                    alert("Erro ao buscar documentos em check-out: Erro Interno do Servidor: entre em contato com o Administrador.");
                }
                reject();
            },
        });
    })
}

var CriarPasta = function (parentId, nomePasta, listPermissions, children, inheritSecurity) {
    return new Promise((resolve, reject) => {

        var dados = {
            documentDescription: nomePasta,
            parentFolderId: parentId,
            inheritSecurity: inheritSecurity,
            permissions: listPermissions,
        };

        parent.WCMAPI.Create({
            // url: "http://fluig.castilho.com.br:1010" + "/api/public/2.0/folderdocuments/create", //Prod
            url: "http://desenvolvimento.castilho.com.br:3232" + "/api/public/2.0/folderdocuments/create", //Dev
            contentType: "application/json",
            data: JSON.stringify(dados),
            method: "POST",
            success: function (data) {

                var folderId = data.content.documentId;

                if (children.length > 0) {
                    var promises = children.map(Pasta =>
                        CriarPasta(folderId, Pasta.description, Pasta.permissao, Pasta.children, Pasta.inheritSecurity)
                    );

                    Promise.all(promises).then(() => {
                        resolve(folderId);
                    }).catch((error) => {
                        console.error("Erro ao criar subpastas");
                        reject(error);
                    });
                } else {
                    resolve(folderId);
                }
            },
            error: function (x, e) {
                console.error("Cria pasta");
                console.log(x);
                console.log(e);
                FLUIGC.toast({
                    message: "Erro ao criar a pasta da obra.",
                    type: "danger",
                });
                reject();
            }
        });
    });
};