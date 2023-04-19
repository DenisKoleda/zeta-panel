$(document).ready(function() {
    var url = window.location.href;
    var apiEndpoint = '';
    if (url.indexOf('pc') !== -1) {
        apiEndpoint = '/api/sklad/get_pc';
    } else if (url.indexOf('ram') !== -1) {
        apiEndpoint = '/api/sklad/get_ram';
    }
    // отправляем GET запрос на сервер и получаем данные
    $.get(apiEndpoint, function(data) {
        // проходимся по каждой строке данных и добавляем их в таблицу
        $.each(data, function(index, row) {
            var newRow = $('<tr>');
            newRow.append($('<td>').attr('data-column-id', $('th:eq(0)').attr('data-column-id')).addClass('border-end').attr('contentEditable', false).text(row.id));
            newRow.append($('<td>').attr('data-column-id', $('th:eq(1)').attr('data-column-id')).addClass('border-end').attr('contentEditable', false).text(row.name));
            newRow.append($('<td>').attr('data-column-id', $('th:eq(2)').attr('data-column-id')).addClass('border-end').attr('contentEditable', false).text(row.conf));
            newRow.append($('<td>').attr('data-column-id', $('th:eq(3)').attr('data-column-id')).addClass('border-end').attr('contentEditable', false).text(row.ip));
            newRow.append($('<td>').attr('data-column-id', $('th:eq(4)').attr('data-column-id')).addClass('border-end').attr('contentEditable', false).text(row.user));
            newRow.append($('<td>').attr('data-column-id', $('th:eq(5)').attr('data-column-id')).attr('contentEditable', false).text(row.smart));
            newRow.append($('<td>').addClass('text-center').append($('<button>').addClass('btn btn-outline-success mx-2').attr('onclick', 'saveRow(this)').text('Сохранить')).append($('<button>').addClass('btn btn-outline-danger ms-2').attr('onclick', 'deleteRow(this)').text('Удалить')));
            $('#TableBody').append(newRow);
        });
    });
    
    


    $('#table').DataTable({
        // добавляем кнопки фильтрации в заголовки столбцов
        initComplete: function() {
            this.api().columns().every(function() {
                var column = this;
                var header = $(column.header());
                var select = $('<select><option value=""></option></select>')
                    .appendTo(header)
                    .on('change', function() {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        column.search(val ? '^' + val + '$' : '', true, false).draw();
                    });
                column.data().unique().sort().each(function(d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                });
            });
        }
    });
});
