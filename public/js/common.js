$('#back').on('click', function () {
  window.history.back();
})


function Snackbar() {
  var $snackbar = $
  (`<div class="mdc-snackbar mdc-snackbar--leading">
            <div class="mdc-snackbar__surface">
                <i class="icon"></i>
                <div class="mdc-snackbar__label" role="status" aria-live="polite">
                </div>
                <div class="mdc-snackbar__actions">
                    <button type="button" class="mdc-button mdc-snackbar__action cancel">
                    <i class="material-icons">clear</i>
                    </button>
                     <button type="button" class="mdc-button mdc-snackbar__action ok">
                    <i class="material-icons">done</i>
                    </button>
                </div>
            </div>
        </div>`)
  $('body').append($snackbar);
  this.snackbar = mdc.snackbar.MDCSnackbar.attachTo($snackbar[0])
  this.$snackbar = $snackbar
  this.$cancelButton = $snackbar.find('.cancel')
  this.$okButton = $snackbar.find('.ok')
}
Snackbar.prototype.popup = function (type, content, timeout) {
  this.$snackbar.removeClass('success error confirm');
  this.$snackbar.addClass(type);
  this.snackbar.labelText = content;
  this.snackbar.timeoutMs = timeout || 5000;
  this.snackbar.open()
}
Snackbar.prototype.success = function (content) {
  return this.popup('success', content)
}
Snackbar.prototype.err = function (content) {
  return this.popup('error', content)
}
Snackbar.prototype.confirm = function (content, ok, cancel) {
  var $okButton = this.$okButton
  var $cancelButton =  this.$cancelButton

  var okCallback = function() {
    if (typeof ok === 'function') {
      ok()
    }
    $okButton.off('click', okCallback)
    $cancelButton.off('click', cancelCallback)
  }
  var cancelCallback = function() {
    if (typeof cancel === 'function') {
      cancel()
    }
    $okButton.off('click', okCallback)
    $cancelButton.off('click', cancelCallback)
  }
  
  $okButton.on('click', okCallback)
  $cancelButton.on('click', cancelCallback)
  this.popup('confirm', content, -1)
}

window.snackbar = new Snackbar()

function Dialog() {
  var $dialogHtml = $(`<div class="mdc-dialog"
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
                <div class="mdc-select mdc-select--outlined">
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
                            <li class="mdc-list-item" data-value="information" tabindex="0">所有</li>
                            <li class="mdc-list-item" data-value="sid">学号</li>
                            <li class="mdc-list-item" data-value="name">姓名</li>
                            <li class="mdc-list-item" data-value="major">专业</li>
                            <li class="mdc-list-item" data-value="state">状态</li>
                            <li class="mdc-list-item" data-value="volunteer">报名部门</li>
                        </ul>
                    </div>
                </div>
                
                <div class="mdc-text-field mdc-text-field--outlined">
                    <input class="mdc-text-field__input">
                    <div class="mdc-notched-outline">
                        <div class="mdc-notched-outline__leading"></div>
                        <div class="mdc-notched-outline__notch">
                            <label class="mdc-floating-label">Interviewer</label>
                        </div>
                        <div class="mdc-notched-outline__trailing"></div>
                    </div>
                </div>
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
  $('body').append($dialogHtml);
  this.dialog = mdc.dialog.MDCDialog.attachTo($dialogHtml[0]);
  this.$dialog = $dialogHtml;
}

Dialog.prototype.open = function () {
  this.dialog.open()
}

Dialog.prototype.init = function (content, ok, cancel) {
  this.$dialog.html(this.$dialog.html().replace('_content', content))
  this.select = mdc.select.MDCSelect.attachTo(this.$dialog.find('.mdc-select')[0]);
  this.text = mdc.textField.MDCTextField.attachTo(this.$dialog.find('.mdc-text-field')[0]);
  this.$dialog.find('.ok').unbind('click')
  this.$dialog.find('.cancel').unbind('click')
  this.$dialog.find('.ok').on('click', function () {
    ok()
  })
  this.$dialog.find('.cancel').on('click', function () {
    cancel()
  })
}

Dialog.prototype.reset = function(){
  this.text.value = "";
  this.select.selectedIndex = 0;
}

window.dialog = new Dialog()

var relogin = function () {
  snackbar.err("未登录或登录超时")
  setTimeout(function () {
    window.location.href = "login.html";
  }, 500);
}
