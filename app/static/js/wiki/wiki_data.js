var buttons =[
    {
      extend: 'searchPanes',
      config: {
        columns: [0,1],
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
    { data: "title" },
    { data: "description" },
    { data: "tags" },
]