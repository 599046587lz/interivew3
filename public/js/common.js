function addSnackbar() {
    var snackbarHtml =
        `<div class="mdc-snackbar">
            <div class="mdc-snackbar__surface">
                <i class="material-icons sign done">done_all</i>
                <i class="material-icons sign error">error_outline</i>
                <div class="mdc-snackbar__label"role="status"aria-live="polite">
                </div>
                <div class="mdc-snackbar__actions">
                    <button type="button" class="mdc-button mdc-snackbar__action">
                    <i class="material-icons">clear</i>
                    </button>
                </div>
            </div>
        </div>`
    $('body').append(snackbarHtml)
}

addSnackbar()
const snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.querySelector('.mdc-snackbar'))

function success(content) {
    snackbar.root_.classList.add('success')
    snackbar.labelText = content;
    snackbar.open()
}

function err(content) {
    snackbar.root_.classList.add('error')
    snackbar.labelText = content;
    snackbar.open()
}


var relogin = function (){
    err("未登录或登录超时")
    setTimeout(function(){
        window.location.href = "login.html";
    }, 500);
}
