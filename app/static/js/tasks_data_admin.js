var buttons =[
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
    { 
      data: "ticket_comment",
      render: function(data, type, row) {
        // replace \r\n with <br> tag to support line breaks
        return type === 'display' && data ? data.replace(/\r\n/g, '<br>') : data;
      }
    },
    { data: "priority" },
    { data: "status" },
    { data: "executor" },
    { data: "deadline" },
    { data: "time_started" },
    { data: "time_finished" },
    { data: "time_wasted" },
    { 
      data: "comment",
      render: function(data, type, row) {
        // replace \r\n with <br> tag to support line breaks
        return type === 'display' && data ? data.replace(/\r\n/g, '<br>') : data;
      }
    },
    {
      data: null,
      className: 'exclude',
      render: function(data, type, row, meta) {
            return'<div class="d-flex mt-2">\
            <button class="btn btn-warning btn-sm action-btn mx-2" data-bs-toggle="modal" \
            data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>\
            <button class="btn btn-danger btn-sm action-btn mx-2" data-bs-toggle="modal" \
            data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>\
            </div>'
        }
    } 
]