$(document).ready(function() {
    var url = window.location.href;
    var apiEndpoint = '';
    if (url.indexOf('pc') !== -1) {
        apiEndpoint = '/api/sklad/get_pc';
    } else if (url.indexOf('ram') !== -1) {
        apiEndpoint = '/api/sklad/get_ram';
    }


    // $('#filter').on('keyup', function() {
    //     table.column(0).search($(this).val()).draw();
    //   });

    $('#myTable thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#myTable thead');


    // отправляем GET запрос на сервер и получаем данные
    $.get(apiEndpoint, function(data) {
        var table = $('#myTable').DataTable({
        orderCellsTop: true,
        // fixedHeader: true,
          "paging": true,
          "searching": true,
          "ordering": true,
          "data": data,
          "columns": [
            {"data": "id"},
            {"data": "name"},
            {"data": "conf"},
            {"data": "ip"},
            {"data": "user"},
            {"data": "smart"},
            {
              "render": function(data, type, row, meta) {
                return '<button class="btn btn-outline-success mx-2" onclick="saveRow(this)">Сохранить</button>' +
                       '<button class="btn btn-outline-danger mx-2" onclick="deleteRow(this)">Удалить</button>';
              },
              "className": "text-center",
              "searchable": false, // add this line to make the column not searchable
              "orderable": false // add this line to make the column not orderable
            }
          ],
          initComplete: function () {
            var api = this.api();
 
            // For each column
            api
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="text" placeholder="' + title + '" />');
 
                    // On every keypress in this input
                    $(
                        'input',
                        $('.filters th').eq($(api.column(colIdx).header()).index())
                    )
                        .off('keyup change')
                        .on('change', function (e) {
                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})'; //$(this).parents('th').find('select').val();
 
                            var cursorPosition = this.selectionStart;
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search(
                                    this.value != ''
                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                        : '',
                                    this.value != '',
                                    this.value == ''
                                )
                                .draw();
                        })
                        .on('keyup', function (e) {
                            e.stopPropagation();
 
                            $(this).trigger('change');
                            $(this)
                                .focus()[0]
                                .setSelectionRange(cursorPosition, cursorPosition);
                        });
                });
            },
        });
      });
});
