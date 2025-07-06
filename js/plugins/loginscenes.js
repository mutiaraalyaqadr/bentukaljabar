/*:
 * @plugindesc Login screen hanya password di judul game. Window RPG Maker + tombol HTML. Tombol Batal keluar game. [Password Only Final - Responsive Fix]
 * @author Kamu
 */

(function() {

  function Window_LoginForm() {
    this.initialize(...arguments);
  }

  Window_LoginForm.prototype = Object.create(Window_Base.prototype);
  Window_LoginForm.prototype.constructor = Window_LoginForm;

  Window_LoginForm.prototype.initialize = function(x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
    this.setBackgroundType(0);
    this.drawForm();
    this.createHtmlInputs();
  };

  Window_LoginForm.prototype.drawForm = function() {
    this.contents.clear();
    this.contents.fontSize = 35;
    this.drawText("Password", 0, 40, 120, 'left');
  };

  Window_LoginForm.prototype.createHtmlInputs = function() {
    // Kolom Password
    this._passwordInput = document.createElement("input");
    this._passwordInput.type = "password";
    this._passwordInput.placeholder = "Password";
    this._passwordInput.style.position = "absolute";
    this._passwordInput.style.left = `calc(50% - 150px)`;
    this._passwordInput.style.top = `calc(50% - 50px)`; // Ditinggikan biar ga nutup teks
    this._passwordInput.style.width = `300px`;
    this._passwordInput.style.height = `60px`;
    this._passwordInput.style.fontSize = `40px`;
    this._passwordInput.style.zIndex = 100;
    document.body.appendChild(this._passwordInput);

    // Fix Backspace/Delete tidak bisa
    this._passwordInput.addEventListener("keydown", function(e) {
      e.stopPropagation();
    });

    setTimeout(() => {
      this._passwordInput.focus();
    }, 50);
  };

  Window_LoginForm.prototype.removeHtmlInputs = function() {
    if (this._passwordInput) {
      document.body.removeChild(this._passwordInput);
    }
  };

  Window_LoginForm.prototype.getPassword = function() {
    return this._passwordInput.value.trim();
  };

  // === Scene_Title Patch ===
  const _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function() {
    _Scene_Title_create.call(this);
    this._loginWindow = null;
    this._loginFilter = null;
    setTimeout(() => this.showLoginForm(), 10);
  };

  Scene_Title.prototype.showLoginForm = function() {
    this._commandWindow.deactivate();

    const blur = new PIXI.filters.BlurFilter();
    blur.blur = 3;

    this._loginFilter = blur;
    if (this._backSprite1) this._backSprite1.filters = [blur];
    if (this._backSprite2) this._backSprite2.filters = [blur];
    if (this._commandWindow) this._commandWindow.filters = [blur];

    const w = 350, h = 350;
    const x = (Graphics.boxWidth - w) / 2;
    const y = (Graphics.boxHeight - h) / 2;
    this._loginWindow = new Window_LoginForm(x, y, w, h);
    this.addChild(this._loginWindow);

    this.createLoginButtons();
  };

  Scene_Title.prototype.createLoginButtons = function() {
    // Tombol OK
    this._loginBtn = document.createElement("button");
    this._loginBtn.innerText = "Ok";
    this._loginBtn.style.position = "absolute";
    this._loginBtn.style.left = `calc(50% - 140px)`;
    this._loginBtn.style.top = `calc(50% + 50px)`;
    this._loginBtn.style.width = `120px`;
    this._loginBtn.style.height = `40px`;
    this._loginBtn.style.fontSize = `18px`;
    this._loginBtn.style.zIndex = 100;
    document.body.appendChild(this._loginBtn);
    this._loginBtn.onclick = this.onLoginConfirm.bind(this);

    // Tombol Batal
    this._cancelBtn = document.createElement("button");
    this._cancelBtn.innerText = "Batal";
    this._cancelBtn.style.position = "absolute";
    this._cancelBtn.style.left = `calc(50% + 20px)`;
    this._cancelBtn.style.top = `calc(50% + 50px)`;
    this._cancelBtn.style.width = `120px`;
    this._cancelBtn.style.height = `40px`;
    this._cancelBtn.style.fontSize = `18px`;
    this._cancelBtn.style.zIndex = 100;
    document.body.appendChild(this._cancelBtn);
    this._cancelBtn.onclick = this.onLoginCancel.bind(this);
  };

  Scene_Title.prototype.clearLoginOverlay = function() {
    this._loginWindow.removeHtmlInputs();
    this.removeChild(this._loginWindow);

    if (this._loginBtn && this._cancelBtn) {
      document.body.removeChild(this._loginBtn);
      document.body.removeChild(this._cancelBtn);
    }

    if (this._backSprite1) this._backSprite1.filters = null;
    if (this._backSprite2) this._backSprite2.filters = null;
    if (this._commandWindow) this._commandWindow.filters = null;
  };

  Scene_Title.prototype.onLoginConfirm = function() {
    const pw = this._loginWindow.getPassword();

    if (pw === "dunia2025") {
      SoundManager.playOk();
      this.clearLoginOverlay();
      this._commandWindow.activate();
    } else {
      SoundManager.playBuzzer();
      alert("Password salah!");
    }
  };

  Scene_Title.prototype.onLoginCancel = function() {
    SoundManager.playCancel();
    this.clearLoginOverlay();
    SceneManager.exit();
  };

})();
