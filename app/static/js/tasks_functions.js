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
var userRole = '{{ current_user.role }}';
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
        if (userRole === 'User') {
          redact = '<button class="btn btn-primary btn-sm action-btn">Редактировать</button>';
          return redact;
        } else {
          btn1 = '<button class="btn btn-warning btn-sm action-btn mx-2" data-bs-toggle="modal" data-bs-target="#editModal" data-id="' + row.id + '">Редактировать</button>';
          btn2 = '<button class="btn btn-danger btn-sm action-btn mx-2" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="' + row.id + '">Удалить</button>';
          return btn1 + btn2;
        }
      }
    }
]