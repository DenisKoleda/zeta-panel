var buttons =[
    {
      extend: 'searchPanes',
      config: {
        columns: [1,2,5,6,7],
        cascadePanes: true,
        viewTotal: true,
      }
    },
    {
      extend: 'createState',
      config: {
          creationModal: true,
          toggle: {
              columns:{
                  search: true,
                  visible: true
              },
              length: true,
              order: true,
              paging: true,
              search: true,
            }
        }
    }, 
    'savedStates', 'copy', 
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
    { data: "comment"},
    {
      data: null,
      className: 'exclude',
      render: function(data, type, row, meta) {
        if (data.status === 'Новый' || data.status === 'Возобновлена') 
        {
            return '<div class="d-flex mt-2">\
            <button class="btn btn-primary btn-sm action-btn me-2" data-status="В Работе" data-name="'+ userName +'" data-id="'+ row.id +'">В работу</button>\
            <button class="btn btn-danger btn-sm action-btn mx-2" data-status="Отложено" data-name="'+ userName +'" data-id="'+ row.id +'">Отложить</button>\
            <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
            data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            </div>';
        } else if (data.status === 'В Работе') 
        {
            return '<div class="d-flex mt-2">\
            <button class="btn btn-success btn-sm action-btn me-2" data-status="Выполнено" data-name="'+ userName +'" data-id="'+ row.id +'">Завершить</button>\
            <button class="btn btn-danger btn-sm action-btn mx-2" data-status="Отложено" data-name="'+ userName +'" data-id="'+ row.id +'">Отложить</button>\
            <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" \
            data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            </div>';
        } else if (data.status === 'Выполнено')
        {
            return '<div class="d-flex mt-2">\
            <button class="btn btn-primary btn-sm action-btn me-2" data-status="В Работе" data-name="'+ userName +'" data-id="'+ row.id +'">Возобновить</button>\
            <button class="btn btn-warning btn-sm action-btn mx-2" data-bs-toggle="modal" \
            data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            </div>';
            
        } else if (data.status === 'Отложено')
        {
            return '<div class="d-flex mt-2">\
            <button class="btn btn-primary btn-sm action-btn me-2" data-status="В Работе" data-name="'+ userName +'" data-id="'+ row.id +'">В работу</button>\
            <button class="btn btn-success btn-sm action-btn mx-2" data-status="Выполнено" data-name="'+ userName +'" data-id="'+ row.id +'">Завершить</button>\
            <button class="btn btn-warning btn-sm mx-2" data-bs-toggle="modal" data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            </div>';
        }
        return '';
    } 
    }
]