function createDataset(fields, constraints, sortFields) {
	try {
		return processResult(callService(fields, constraints, sortFields));
	} catch(e) {
		return processErrorResult(e, constraints);
	}
}

function callService(fields, constraints, sortFields) {
	var databaseData = data();
	var resultFields, queryClauses;

	resultFields = getOutputFields(databaseData.outputValues);
	queryClauses = verifyConstraints(databaseData, constraints);

	var result = DatabaseManager.select(databaseData.fluigService, databaseData.operation, resultFields, queryClauses, databaseData.extraParams);
  log.error("retorno callservice: " + result);

	return result;
}

function defineStructure() {
	var databaseData = data();
	var columns = getOutputFields(databaseData.outputValues);

	for (column in columns) {
		var columnName = removeInvalidChars(columns[column]);
		if (!DatabaseManager.isReservedWord(columnName)) {
			addColumn(columnName);
		} else {
			addColumn('ds_' + columnName);
		}
	}
	if (databaseData.extraParams.key) {
		setKey([databaseData.extraParams.key]);
	}
}

function onSync(lastSyncDate) {
	var databaseData = data();
	var synchronizedDataset = DatasetBuilder.newDataset();

	try {
		var resultDataset = processResult(callService());
		if (resultDataset != null) {
			var values = resultDataset.getValues();
			for (var i = 0; i < values.length; i++) {
				if (databaseData.extraParams.key) {
					synchronizedDataset.addOrUpdateRow(values[i]);
				} else {
					synchronizedDataset.addRow(values[i]);
				}
			}
		}

	} catch(e) {
		log.info('Dataset synchronization error : ' + e.message);

	}
	return synchronizedDataset;
}

function verifyConstraints(params, constraints) {
	var allConstraints = new Array();

	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			if (constraints[i].getFieldName().toLowerCase() == 'sqllimit') {
				params.extraParams['limit'] = constraints[i].getInitialValue();
			} else {
				allConstraints.push(constraints[i]);
			}
		}
	}

	if (allConstraints.length == 0) {
		for (i in params.inputValues) {
			for (j in params.inputValues[i]) {
				var param = params.inputValues[i][j];
				var constraint = DatasetFactory.createConstraint(param.fieldName, param.initialValue, param.finalValue, param.constraintType);
				constraint.setLikeSearch(param.likeSearch);
				constraint.setFieldType(DatasetFieldType.valueOf(param.fieldType));
				allConstraints.push(constraint);
			}
		}
	}
	return allConstraints;
}

function getOutputFields(outputValues) {
	var outputFields = new Array();
	if (outputValues != null) {
		for (field in outputValues) {
			if (outputValues[field].result) {
				outputFields.push(field);
			}
		}
	}
	return outputFields;
}

function processResult(result) {
	var databaseData = data();
	var dataset = DatasetBuilder.newDataset();
	var columns = getOutputFields(databaseData.outputValues);

	for (column in columns) {
		dataset.addColumn(columns[column]);
	}

	for (var i = 0; i < result.size(); i++) {
		var datasetRow = new Array();
		var item = result.get(i);
		for (param in columns) {
			datasetRow.push(item.get(columns[param]));
		}
		dataset.addRow(datasetRow);
    log.error("retorno processResult: " + dataset);
	}

	return dataset;
}

function processErrorResult(error, constraints) {
	var dataset = DatasetBuilder.newDataset();

	dataset.addColumn('error');
	dataset.addRow([error.message]);

	return dataset;
}

function removeInvalidChars(columnName) {
	var invalidChars = '#';
	var newChar = '_';
	for (var i = 0; i < invalidChars.length; i++) {
		columnName = columnName.split(invalidChars[i]).join(newChar);
	}

	return columnName;
}

function data() {
	return {
  "fluigService" : "RM",
  "operation" : "GCCUSTO",
  "tableType" : "TABLE",
  "parameters" : [ ],
  "inputValues" : {
    "ATIVO" : [ {
      "fieldName" : "ATIVO",
      "initialValue" : "T",
      "finalValue" : "T",
"constraintType" :  ConstraintType.MUST,
      "likeSearch" : false,
      "fieldType" : "STRING"
    } ],
    "CAMPOLIVRE" : [ ],
    "CODCCUSTO" : [ {
      "fieldName" : "CODCCUSTO",
      "initialValue" : "1",
      "finalValue" : "",
"constraintType" :  ConstraintType.MUST_NOT,
      "likeSearch" : false,
      "fieldType" : "STRING"
    }, {
      "fieldName" : "CODCCUSTO",
      "initialValue" : "1.1",
      "finalValue" : "",
"constraintType" :  ConstraintType.MUST_NOT,
      "likeSearch" : false,
      "fieldType" : "STRING"
    }, {
      "fieldName" : "CODCCUSTO",
      "initialValue" : "1.2.043",
      "finalValue" : "",
"constraintType" :  ConstraintType.MUST_NOT,
      "likeSearch" : false,
      "fieldType" : "STRING"
    } ],
    "CODCLASSIFICA" : [ ],
    "CODCOLCONTA" : [ ],
    "CODCOLCONTAGER" : [ ],
    "CODCOLIGADA" : [ ],
    "CODCONTA" : [ ],
    "CODCONTAGER" : [ ],
    "CODREDUZIDO" : [ ],
    "DATAINCLUSAO" : [ ],
    "ENVIASPED" : [ ],
    "ID" : [ ],
    "NOME" : [ ],
    "PERMITELANC" : [ ],
    "RECCREATEDBY" : [ ],
    "RECCREATEDON" : [ ],
    "RECMODIFIEDBY" : [ ],
    "RECMODIFIEDON" : [ ],
    "RESPONSAVEL" : [ ]
  },
  "inputAssignments" : { },
  "outputValues" : {
    "ATIVO" : {
      "result" : true,
      "type" : "varchar"
    },
    "CAMPOLIVRE" : {
      "result" : false,
      "type" : "varchar"
    },
    "CODCCUSTO" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCLASSIFICA" : {
      "result" : false,
      "type" : "varchar"
    },
    "CODCOLCONTA" : {
      "result" : false,
      "type" : "smallint"
    },
    "CODCOLCONTAGER" : {
      "result" : false,
      "type" : "smallint"
    },
    "CODCOLIGADA" : {
      "result" : true,
      "type" : "smallint"
    },
    "CODCONTA" : {
      "result" : false,
      "type" : "varchar"
    },
    "CODCONTAGER" : {
      "result" : false,
      "type" : "varchar"
    },
    "CODREDUZIDO" : {
      "result" : false,
      "type" : "varchar"
    },
    "DATAINCLUSAO" : {
      "result" : false,
      "type" : "datetime"
    },
    "ENVIASPED" : {
      "result" : false,
      "type" : "varchar"
    },
    "ID" : {
      "result" : false,
      "type" : "int"
    },
    "NOME" : {
      "result" : true,
      "type" : "varchar"
    },
    "PERMITELANC" : {
      "result" : false,
      "type" : "varchar"
    },
    "RECCREATEDBY" : {
      "result" : false,
      "type" : "varchar"
    },
    "RECCREATEDON" : {
      "result" : false,
      "type" : "datetime"
    },
    "RECMODIFIEDBY" : {
      "result" : false,
      "type" : "varchar"
    },
    "RECMODIFIEDON" : {
      "result" : false,
      "type" : "datetime"
    },
    "RESPONSAVEL" : {
      "result" : false,
      "type" : "int"
    }
  },
  "outputAssignments" : { },
  "extraParams" : {
    "queryOrderField" : "NOME",
    "queryOrderDirection" : "ASC"
  }
}
;
}