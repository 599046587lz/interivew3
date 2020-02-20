var $back = $('.topBar #back')

$back.on('click',function () {
  window.history.back();
})

function addSnackbar(className,content) {
  var $snackbars = $('.mdc-snackbar')
  var bottom = $('.mdc-snackbar').length * 60 + 'px'
  var id = Math.random().toString(36).substr(2);
  var snackbarHtml =
    `<div class="mdc-snackbar ${className}" id="${id}">
            <div class="mdc-snackbar__surface">
                <i class="material-icons sign done">done_all</i>
                <i class="material-icons sign error">error_outline</i>
                <div class="mdc-snackbar__label" role="status" aria-live="polite">
                    ${content}
                </div>
                <div class="mdc-snackbar__actions">
                    <button type="button" class="mdc-button mdc-snackbar__action">
                    <i class="material-icons" id="snackCancel">clear</i>
                    </button>
                     <button type="button" class="mdc-button mdc-snackbar__action">
                    <i class="material-icons" id="snackOk">done</i>
                    </button>
                </div>
            </div>
        </div>`
  $('body').append(snackbarHtml);
  var snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.querySelector(`#${id}`))
  snackbar.root_.addEventListener('MDCSnackbar:closed',function (e) {
    e.target.remove()
  });
  snackbar.root_.style.bottom = bottom;
  snackbar.open();
  return id
}

function success(content) {
  addSnackbar('success', content)
}

function err(content) {
  addSnackbar('error',content)
}

function snackConfirm(content,cancel,ok) {
  var id = addSnackbar('confirm',content)
  var $snackbar = $(`#${id}`);
  $snackbar.find('#snackCancel').on('click',function () {
    cancel()
  })
  $snackbar.find('#snackOk').on('click',function () {
    ok()
  })
}

var relogin = function () {
  err("未登录或登录超时")
  setTimeout(function () {
    window.location.href = "login.html";
  }, 500);
}


