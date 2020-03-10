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

function Dialog() {
  var $selectHtml = $(`<div class="mdc-select mdc-select--outlined">
                    <div class="mdc-select__anchor">
                        <i class="mdc-select__dropdown-icon"></i>
                        <div id="demo-selected-text" class="mdc-select__selected-text" role="button"
                         aria-haspopup="listbox" aria-labelledby="demo-label demo-selected-text"></div>
                        <div class="mdc-notched-outline">
                            <div class="mdc-notched-outline__leading"></div>
                            <div class="mdc-notched-outline__notch">
                                <label class="mdc-floating-label">Department</label>
                            </div>
                            <div class="mdc-notched-outline__trailing"></div>
                        </div>
                    </div>
                    <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">
                        <ul class="mdc-list">
                            <li class="mdc-list-item" data-value="所有" tabindex="0">所有</li>
                            <li class="mdc-list-item" data-value="学号">学号</li>
                            <li class="mdc-list-item" data-value="姓名">姓名</li>
                            <li class="mdc-list-item" data-value="专业">专业</li>
                            <li class="mdc-list-item" data-value="状态">状态</li>
                            <li class="mdc-list-item" data-value="报名部门">报名部门</li>
                        </ul>
                    </div>
                </div>`)
  var inputHtml = `<div class="mdc-text-field mdc-text-field--outlined">
                    <input class="mdc-text-field__input">
                    <div class="mdc-notched-outline">
                        <div class="mdc-notched-outline__leading"></div>
                        <div class="mdc-notched-outline__notch">
                            <label class="mdc-floating-label">Interviewer</label>
                        </div>
                        <div class="mdc-notched-outline__trailing"></div>
                    </div>
                </div>`
  var $dialogHtml =  $(`<div class="mdc-dialog"
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="my-dialog-title"
     aria-describedby="my-dialog-content">
    <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface">
            <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
            <h2 class="mdc-dialog__title" id="my-dialog-title"><!--
     -->_content<!--
   --></h2>
            <div class="mdc-dialog__content" id="my-dialog-content">
                ${$selectHtml.html()}
                ${inputHtml}
            </div>
            
            <footer class="mdc-dialog__actions">
                <button type="button" class="mdc-button mdc-dialog__button cancel" data-mdc-dialog-action="cancel">
                    <span class="mdc-button__label">CANCEL</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button ok" data-mdc-dialog-action="ok">
                    <span class="mdc-button__label">OK</span>
                </button>
            </footer>
        </div>
    </div>
    <div class="mdc-dialog__scrim"></div>
    </div>`)
  this.dialog = mdc.dialog.MDCDialog.attachTo($dialogHtml[0]);
  this.$dialog = $dialogHtml;
  window.setTimeout(() => {
    this.select = mdc.select.MDCSelect.attachTo($selectHtml[0]);
    this.text = mdc.textField.MDCTextField.attachTo($(inputHtml)[0]);
  })
  $('body').append($dialogHtml);
}

Dialog.prototype.open = function () {
  this.dialog.open()
}

Dialog.prototype.confirm = function (content,ok,cancel) {
  this.$dialog.html(this.$dialog.html().replace('_content',content))
  this.$dialog.find('.ok').on('click',function () {
    ok()
  })
  this.$dialog.find('.cancel').on('click',function () {
    cancel()
  })
}

window.dialog = new Dialog()

var relogin = function () {
  snackbar.err("未登录或登录超时")
  setTimeout(function () {
    window.location.href = "login.html";
  }, 500);
}
