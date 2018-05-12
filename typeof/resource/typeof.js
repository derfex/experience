(function () {
  'use strict';

  // # Вспомогательные функции.

  // ## Коррелирует ли `typeof` с `[[Class]]`.
  function _isCorrectType(type, _class_) {
    return _class_.slice(8, -1).toLowerCase() === type;
  }

  // ## Некоторые выражения функция `eval()` интерпретирует неверно.
  function _eval(expression) {
    return !~_eval.expressionsKeys.indexOf(expression)
      ? eval(expression)
      : _eval.expressions[expression];
  }

  _eval.expressions = {
    '{}': {},
  };
  _eval.expressionsKeys = Object.keys(_eval.expressions);

  // ## Некоторые выражения не могут быть преобразованы к строке самостоятельно.
  function _toString(data) {
    return !~_toString.expressionsKeys.indexOf(data[0])
      ? data[1]
      : _toString.expressions[data[0]];
  }

  _toString.expressions = {
    'Object.create(null)': '{} (без прототипа)',
    'Symbol("abc")': '—',
  };
  _toString.expressionsKeys = Object.keys(_toString.expressions);

  // ## Получить данные по массиву выражений.
  function _getDataByExpressions(expressions) {
    const dataArray = [];
    expressions.forEach(expression => {
      const value = _eval(expression);
      dataArray.push([
        expression,
        value,
        typeof value,
        Object.prototype.toString.call(value),
      ]);
    });
    return dataArray;
  }

  // ## Получить HTML таблицы с данными.
  function _getHTMLTableData(dataArray) {
    let HTML = `
        <table>
          <colgroup>
            <col width="160"><col width="400"><col width="80"><col width="200">
          </colgroup>
          <thead>
            <tr><th>code</th><th>value</th><th>typeof</th><th>[[Class]]</th></tr>
          </thead>
          <tbody>
      `;

    dataArray.forEach(data => {
      const attrClass = ' class="' + (_isCorrectType(data[2], data[3]) ? 'info' : 'warn') + '"';
      HTML += '            <tr' + attrClass + '><td>' + data[0] + '</td><td>' + _toString(data) + '</td><td>' +
        data[2] + '</td><td>' + data[3] + '</td></tr>' + '\n';
    });

    HTML += `
          </tbody>
        </table>
        `;
    return HTML;
  }

  // ## Получить HTML таблицы с данными.
  function _outputInConsole(dataArray) {
    console.clear();
    console.group('               [[Class]]   |   typeof   |   value   |   code');
    dataArray.forEach(data => {
      const row = [
        data[3],
        data[2],
        data[1],
        data[0],
      ];
      console[_isCorrectType(data[2], data[3]) ? 'info' : 'warn'](row);
    });
    console.groupEnd();
  }


  // # Данные.

  // ## Набор выражений.
  const expressions = [
    {
      value: 'arguments',
      fromSpecification: true,
    },
    {
      value: '[1,2,3]',
      fromSpecification: true,
    },
    {
      value: 'new Array(1, 2, 3)',
      fromSpecification: true,
    },
    {
      value: 'true',
      fromSpecification: true,
    },
    {
      value: 'new Boolean(true)',
      fromSpecification: true,
    },
    {
      value: 'new Date()',
      fromSpecification: true,
    },
    {
      value: 'new Error()',
      fromSpecification: true,
    },
    {
      value: 'new Function("")',
      fromSpecification: true,
    },
    {
      value: 'Math.max',
    },
    {
      value: '() => {}',
      fromSpecification: true,
    },
    {
      value: 'window.history',
    },
    {
      value: 'document',
    },
    {
      value: 'document.body',
    },
    {
      value: 'JSON',
      fromSpecification: true,
    },
    {
      value: 'window.location',
    },
    {
      value: 'Math',
      fromSpecification: true,
    },
    {
      value: 'null',
      fromSpecification: true,
    },
    {
      value: 'NaN',
    },
    {
      value: 'Infinity',
    },
    {
      value: '-Infinity',
    },
    {
      value: '1.2',
      fromSpecification: true,
    },
    {
      value: 'Math.PI',
    },
    {
      value: 'new Number(1.2)',
      fromSpecification: true,
    },
    {
      value: '{}',
      fromSpecification: true,
    },
    {
      value: 'new Object()',
      fromSpecification: true,
    },
    {
      value: 'Object.create(null)',
    },
    {
      value: '/abc/g',
      fromSpecification: true,
    },
    {
      value: 'new RegExp("abc")',
      fromSpecification: true,
    },
    {
      value: '""',
    },
    {
      value: '"abc"',
      fromSpecification: true,
    },
    {
      value: 'new String("abc")',
      fromSpecification: true,
    },
    {
      value: 'Symbol("abc")',
    },
    {
      value: 'undefined',
      fromSpecification: true,
    },
  ];

  // Набор выражений, для которых есть описание в спецификации.
  const expressionsFromSpecification = [];

  // Расширенный набор выражений.
  const expressionsExtended = [];

  expressions.forEach(expressionData => {
    const {
      value,
      fromSpecification,
    } = expressionData;
    if (fromSpecification) {
      expressionsFromSpecification.push(value);
    }
    expressionsExtended.push(value);
  });


  // Список выражений по спецификации.
  const dataSpecification = _getDataByExpressions(expressionsFromSpecification);

  const pOutputSpecification = document.getElementById('outputSpecification');
  pOutputSpecification.innerHTML = _getHTMLTableData(dataSpecification);

  // Расширенный список выражений.
  const dataExtended = _getDataByExpressions(expressionsExtended);

  const pOutputExtended = document.getElementById('outputExtended');
  pOutputExtended.innerHTML = _getHTMLTableData(dataExtended);

  _outputInConsole(dataExtended);
})();