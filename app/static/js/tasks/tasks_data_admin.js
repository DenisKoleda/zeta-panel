var buttons =[
    {
      extend: 'searchPanes',
      config: {
        columns: [1,2,3,4,5,6,7],
        cascadePanes: true,
        viewTotal: true,
      }
    },
      'createState', 'savedStates', 'copy', 
    {
      extend: 'excelHtml5',
      autoFilter: true,
      sheetName: 'Exported data',
      exportOptions: {
        columns: ':not(.exclude)'
      }
    },
    {
      extend: 'print',
      exportOptions: {
        columns: ':not(.exclude)'
      }

    },
    'colvis'
    
]
var columns = [
    { data: "id" },
    { data: "date" },
    { data: "user_init" },
    { data: "ticket" },
    { data: "ticket_comment"},
    { data: "priority" },
    { data: "status" },
    { data: "executor" },
    { data: "deadline" },
    { data: "time_started" },
    { data: "time_finished" },
    { data: "time_wasted" },
    { data: "comment",},
    {
      data: null,
      className: 'exclude',
      render: function(data, type, row, meta) {
        if (data.status === 'Выполнено')
        {
            return'<div class="d-flex mt-2">\
            <button class="btn btn-primary btn-sm action-btn me-2" data-status="Возобновлена" data-id="'+ row.id +'">Возобновить</button>\
            <button class="btn btn-success btn-sm action-btn mx-2" data-status="Закрыто" data-id="'+ row.id +'">Закрыть</button>\
            <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
            data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            </div>'
        } else if (data.status === 'Закрыто') {
          return'<div class="d-flex mt-2">\
            <button class="btn btn-primary btn-sm action-btn me-2" data-status="Возобновлена" data-id="'+ row.id +'">Возобновить</button>\
            <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
            data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
            data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
            </div>'
        } else {
          return'<div class="d-flex mt-2">\
            <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" \
            data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            <button class="btn btn-danger btn-sm mx-2" data-bs-toggle="modal" \
            data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
            </div>'
        }
      }
    } 
]