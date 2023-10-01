// Get the current URL
var currentUrl = window.location.href;

// Define the default endpoint
var endpoint = '/api/tasks/get';

// Check if the URL contains '/all_tasks'
if (currentUrl.includes('/all_tasks')) {
  endpoint = '/api/tasks/get_all';
}

// Глобальная переменная для хранения текущей страницы
var currentPage = 1;
var table;

// Функция для обновления данных таблицы
function updateTable() {
  $.get(endpoint, function (data) {
    // Получите текущую страницу перед обновлением
    currentPage = table.page();

    // Очистите старую таблицу и обновите данные
    table.clear().rows.add(data).draw();

    // Восстановите текущую страницу после обновления
    table.page(currentPage).draw(false);
  });
}

// Создание DataTable и установка интервала обновления в 5 секунд
$(document).ready(function() {
  table = $('#myTable').DataTable({
    dom: '<"justify-content-between align-items-center"lfB><"table-responsive"rt><"justify-content-between align-items-center"ip>',
    buttons: buttons,
    stateSave: true,
    responsive: true,
    pagingType: 'simple',
    searching: true,
    ordering: true,
    data: [], // Пустой массив данных
    language: language,
    columns: columns,
    order: [[0, 'desc']],

    createdRow: function(row, data, dataIndex) {
      if (data.status === 'В Работе') {
        $(row).addClass('table-primary');
      }
      if (data.status === 'Выполнено') {
        $(row).addClass('table-success');
      }
      if (data.status === 'Отложено') {
        $(row).addClass('table-danger');
      }
      if (data.status === 'Закрыто') {
        $(row).addClass('table-info');
      }
    },

    rowCallback: function(row, data, index) {
      $(row).on('dblclick', function(event) {
        // Check if the clicked element is in the first column
        if ($(event.target).closest('td').index() === 0) {
          return; // Ignore clicks on the first column
        }
        // Get the ID of the clicked row
        var id = $(row).find('td:eq(0)').text(); // Assumes the ID is in the first column
        // Construct the URL and redirect to it
        window.location.href = '/task/' + id;
      })
      // Double tap == Double click
      $(row).doubletap(function(event) {
        // Check if the clicked element is in the first column
        if ($(event.target).closest('td').index() === 0) {
          return; // Ignore clicks on the first column
        }
        // Get the ID of the clicked row
        var id = $(row).find('td:eq(0)').text(); // Assumes the ID is in the first column
        // Construct the URL and redirect to it
        window.location.href = '/task/' + id;
      })
    }
  });

  // Вызовите функцию обновления данных для первоначальной загрузки и установки интервала
  updateTable();
  setInterval(updateTable, 5000); // 5000 миллисекунд = 5 секунд
});
