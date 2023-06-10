$(document).ready(function() {
    
    var mdeditor = editormd({
        id: "editor",
        path: "https://cdn.jsdelivr.net/npm/editor.md@1.5.0/lib/",
        height: 640,
        saveHTMLToTextarea: true,
        // Добавляем настройки для загрузки изображений
        imageUpload : true,
        imageFormats : ["jpg", "jpeg", "gif", "png"],
        imageUploadURL : "/api/upload", // URL для загрузки изображений на сервер
        lang : {
          name : "ru",
          description : "Онлайн-редактор.",
          tocTitle    : "Оглавление",
          toolbar : {
              undo             : "Отменить(Ctrl+Z)",
              redo             : "Повторить(Ctrl+Y)",
              bold             : "Жирный",
              del              : "Зачеркнутый",
              italic           : "Курсив",
              quote            : "Цитата",
              ucwords          : "Первая буква слова преобразуется в верхний регистр",
              uppercase        : "Выделенный текст преобразуется в верхний регистр",
              lowercase        : "Выделенный текст преобразуется в нижний регистр",
              h1               : "Заголовок 1",
              h2               : "Заголовок 2",
              h3               : "Заголовок 3",
              h4               : "Заголовок 4",
              h5               : "Заголовок 5",
              h6               : "Заголовок 6",
              "list-ul"        : "Неупорядоченный список",
              "list-ol"        : "Упорядоченный список",
              hr               : "Горизонтальный разделитель",
              link             : "Ссылка",
              "reference-link" : "Якорная ссылка",
              image            : "Изображение",
              code             : "Code inline",
              "preformatted-text" : "Preformatted text / Code block (Tab indent)",
              "code-block"     : "Code block (Multi-languages)",
              table            : "Tables",
              datetime         : "Datetime",
              emoji            : "Emoji",
              "html-entities"  : "HTML Entities",
              pagebreak        : "Page break",
              watch            : "Unwatch",
              unwatch          : "Watch",
              preview          : "HTML Preview (Press Shift + ESC exit)",
              fullscreen       : "Fullscreen (Press ESC exit)",
              clear            : "Clear",
              search           : "Search",
              help             : "Help",
              info             : "Немного о редакторе",
          },
          buttons : {
              enter  : "Enter",
              cancel : "Cancel",
              close  : "Close"
          },
          dialog : {
              link : {
                  title    : "Link",
                  url      : "Address",
                  urlTitle : "Title",
                  urlEmpty : "Error: Please fill in the link address."
              },
              referenceLink : {
                  title    : "Reference link",
                  name     : "Name",
                  url      : "Address",
                  urlId    : "ID",
                  urlTitle : "Title",
                  nameEmpty: "Error: Reference name can't be empty.",
                  idEmpty  : "Error: Please fill in reference link id.",
                  urlEmpty : "Error: Please fill in reference link url address."
              },
              image : {
                  title    : "Image",
                  url      : "Address",
                  link     : "Link",
                  alt      : "Title",
                  uploadButton     : "Upload",
                  imageURLEmpty    : "Error: picture url address can't be empty.",
                  uploadFileEmpty  : "Error: upload pictures cannot be empty!",
                  formatNotAllowed : "Error: only allows to upload pictures file, upload allowed image file format:"
              },
              preformattedText : {
                  title             : "Preformatted text / Codes", 
                  emptyAlert        : "Error: Please fill in the Preformatted text or content of the codes."
              },
              codeBlock : {
                  title             : "Code block",         
                  selectLabel       : "Languages: ",
                  selectDefaultText : "select a code language...",
                  otherLanguage     : "Other languages",
                  unselectedLanguageAlert : "Error: Please select the code language.",
                  codeEmptyAlert    : "Error: Please fill in the code content."
              },
              htmlEntities : {
                  title : "HTML Entities"
              },
              help : {
                  title : "Help"
              }
          }
        },
        onImageUpload : function(file) {
            var formData = new FormData();
            formData.append("editormd-image-file", file);
    
            $.ajax({
                url: editor.settings.imageUploadURL,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function(result) {
                    if (result.success === 1) {
                        var url = result.url;
                        editor.insertValue("![" + file.name + "](" + url + ")");
                    } else {
                        alert(result.message);
                    }
                }
            });
        }
    });
    
    $('#save').click(function() {
        var data = mdeditor.getMarkdown();
        $.ajax({
            url: '/wiki/save',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
              console.log(response);
            },
            error: function(error) {
              console.log(error);
            }
          });
    });

    var initialContent = $('#markdown-content').text();
    var editor = new SimpleMDE({ element: document.getElementById("editor") });
    editor.value(initialContent);

  });
  