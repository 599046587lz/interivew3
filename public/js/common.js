var $back = $('.topBar #back')

$back.on('click',function () {
  window.history.back();
})



function Snackbar() {
  var $snackbarHtml = $
    (`<div class="mdc-snackbar">
            <div class="mdc-snackbar__surface">
                <i class="material-icons sign done">done_all</i>
                <i class="material-icons sign error">error_outline</i>
                <div class="mdc-snackbar__label" role="status" aria-live="polite">
                </div>
                <div class="mdc-snackbar__actions">
                    <button type="button" class="mdc-button mdc-snackbar__action">
                    <i class="material-icons cancel">clear</i>
                    </button>
                     <button type="button" class="mdc-button mdc-snackbar__action">
                    <i class="material-icons ok">done</i>
                    </button>
                </div>
            </div>
        </div>`)
  $('body').append($snackbarHtml);
  this.element = $snackbarHtml[0]
  this.snackbar = mdc.snackbar.MDCSnackbar.attachTo(this.element)
  this.$snackbar = $snackbarHtml
}

Snackbar.prototype.success = function (content) {
  this.popup('success',content)
}
Snackbar.prototype.err = function(content){
  this.popup('error',content)
}
Snackbar.prototype.confirm = function(content,cancel,ok) {
  this.$snackbar.find('.cancel').on('click',function () {
    cancel()
  })
  this.$snackbar.find('.ok').on('click',function () {
    ok()
  })
  this.popup('confirm',content)
}

Snackbar.prototype.popup = function(type,content){
  this.$snackbar.removeClass('success error confirm');
  this.$snackbar.addClass(type);
  this.snackbar.labelText = content;
  this.snackbar.open()
}

window.snackbar = new Snackbar()

var relogin = function () {
  err("未登录或登录超时")
  setTimeout(function () {
    window.location.href = "login.html";
  }, 500);
}
