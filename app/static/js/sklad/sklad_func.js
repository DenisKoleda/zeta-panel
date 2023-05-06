var apiEndpoint;
var columns = [];
var path;
switch (window.location.pathname) {
    case '/sklad/pc':
        var apiEndpoint = '/api/sklad/pc/get';
        var columns = [
            { data: "id" },
            { data: "name" },
            { data: "conf" },
            { data: "ip" },
            { data: "user" },
            { data: "smart" },
            { data: "comment" },
            {
                data: null,
                className: 'exclude',
                render: function(data, type, row, meta) {
                return'<div class="d-flex mt-2">\
                    <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
                    <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
                    </div>'
                }
            }
        ];
        var path = 'pc'
        break;
    case '/sklad/badgeev':
        var apiEndpoint = '/api/sklad/badgeev/get';
        var columns = [
            { data: "id" },
            { data: "ip" },
            { data: "vlan" },
            { data: "cores" },
            { data: "config" },
            { data: "status" },
            { data: "smart" },
            { data: "switch" },
            { data: "switch_port" },
            { data: "rack" },
            { data: "comment" },
            {
                data: null,
                className: 'exclude',
                render: function(data, type, row, meta) {
                return'<div class="d-flex mt-2">\
                    <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
                    <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
                    </div>'
                }
            }
        ];
        var path = 'badgeev'
        break;
    case '/sklad/ram':
        var apiEndpoint = '/api/sklad/ram/get';
        var columns = [
            { data: "id" },
            { data: "name" },
            { data: "type" },
            { data: "size" },
            { data: "frequency" },
            { data: "count" },
            {
                data: null,
                className: 'exclude',
                render: function(data, type, row, meta) {
                return'<div class="d-flex mt-2">\
                    <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
                    <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
                    </div>'
                }
            }
        ];
        var path = 'ram'
        break;
    case '/sklad/motherboard':
        var apiEndpoint = '/api/sklad/motherboard/get';
        var columns = [
            { data: "id" },
            { data: "name" },
            { data: "ram" },
            { data: "m2" },
            { data: "count" },
            {
                data: null,
                className: 'exclude',
                render: function(data, type, row, meta) {
                return'<div class="d-flex mt-2">\
                    <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
                    <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
                    </div>'
                }
            }
        ];
        var path = 'motherboard'
        break;
    case '/sklad/harddrive':
        var apiEndpoint = '/api/sklad/harddrive/get';
        var columns = [
            { data: "id" },
            { data: "name" },
            { data: "type" },
            { data: "size" },
            { data: "count" },
            {
                data: null,
                className: 'exclude',
                render: function(data, type, row, meta) {
                return'<div class="d-flex mt-2">\
                    <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
                    <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
                    </div>'
                }
            }
        ];
        var path = 'harddrive'
        break;
    case '/sklad/network':
        var apiEndpoint = '/api/sklad/network/get';
        var columns = [
            { data: "id" },
            { data: "name" },
            { data: "type" },
            { data: "ports" },
            { data: "count" },
            {
                data: null,
                className: 'exclude',
                render: function(data, type, row, meta) {
                return'<div class="d-flex mt-2">\
                    <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
                    <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
                    </div>'
                }
            }
        ];
        var path = 'network'
        break;
    case '/sklad/miscellaneous':
        var apiEndpoint = '/api/sklad/miscellaneous/get';
        var columns = [
            { data: "id" },
            { data: "name" },
            { data: "type" },
            { data: "conf" },
            { data: "count" },
            {
                data: null,
                className: 'exclude',
                render: function(data, type, row, meta) {
                return'<div class="d-flex mt-2">\
                    <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
                    <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
                    data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
                    </div>'
                }
            }
        ];
        var path = 'miscellaneous'
        break;
}

var buttons = [
    {
      extend: 'searchPanes',
      config: {
        cascadePanes: true,
        viewTotal: true,
      }
    },
    'createState', 'savedStates', 'copy',
    {
      extend: 'excelHtml5',
      autoFilter: true,
      sheetName: 'Exported data'
    }, 'print', 'colvis'

  ];