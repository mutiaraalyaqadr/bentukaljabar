/*:
 * @plugindesc Menambahkan Panduan, Tentang, dan Keluar di Title + Navigasi Gambar Panduan.
 * @author Kamu
 */

(function() {
  // ===== Window_XButton =====
  function Window_XButton() {
      this.initialize.apply(this, arguments);
  }

  Window_XButton.prototype = Object.create(Window_Base.prototype);
  Window_XButton.prototype.constructor = Window_XButton;

  Window_XButton.prototype.initialize = function(x, y, width, height) {
      Window_Base.prototype.initialize.call(this, x, y, width, height);
      this.setBackgroundType(2);
      this.drawButton();
  };

  Window_XButton.prototype.drawButton = function() {
      this.contents.clear();
      this.contents.fontSize = 40;
      this.drawText("X", 0, 0, this.contentsWidth(), "center");
  };

  Window_XButton.prototype.update = function() {
      Window_Base.prototype.update.call(this);
      if (this.isClicked()) {
          SoundManager.playCancel();
          SceneManager.pop();
      }
  };

  Window_XButton.prototype.isClicked = function() {
      if (TouchInput.isTriggered()) {
          const x = TouchInput.x;
          const y = TouchInput.y;
          return x >= this.x && x < this.x + this.width &&
                 y >= this.y && y < this.y + this.height;
      }
      return false;
  };

  // ===== Window_NavButton (tombol < >) =====
  function Window_NavButton() {
      this.initialize.apply(this, arguments);
  }

  Window_NavButton.prototype = Object.create(Window_Base.prototype);
  Window_NavButton.prototype.constructor = Window_NavButton;

  Window_NavButton.prototype.initialize = function(x, y, width, height, text, callback) {
      Window_Base.prototype.initialize.call(this, x, y, width, height);
      this._callback = callback;
      this._text = text;
      this.setBackgroundType(2);
      this.drawButton();
  };

  Window_NavButton.prototype.drawButton = function() {
      this.contents.clear();
      this.contents.fontSize = 40;
      this.drawText(this._text, 0, 0, this.contentsWidth(), "center");
  };

  Window_NavButton.prototype.update = function() {
      Window_Base.prototype.update.call(this);
      if (this.isClicked()) {
          SoundManager.playCursor();
          if (this._callback) this._callback();
      }
  };

  Window_NavButton.prototype.isClicked = function() {
      if (TouchInput.isTriggered()) {
          const x = TouchInput.x;
          const y = TouchInput.y;
          return x >= this.x && x < this.x + this.width &&
                 y >= this.y && y < this.y + this.height;
      }
      return false;
  };

  // ===== Scene Panduan Keyboard =====
  function Scene_PanduanKeyboard() {
    this.initialize.apply(this, arguments);
  }

  Scene_PanduanKeyboard.prototype = Object.create(Scene_Base.prototype);
  Scene_PanduanKeyboard.prototype.constructor = Scene_PanduanKeyboard;

  Scene_PanduanKeyboard.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_PanduanKeyboard.prototype.create = function() {
    Scene_Base.prototype.create.call(this);

    this._guide1 = new Sprite(ImageManager.loadPicture("keyboard_guide1"));
    this._guide2 = new Sprite(ImageManager.loadPicture("keyboard_guide2"));
    this._guide2.visible = false;

    this.addChild(this._guide1);
    this.addChild(this._guide2);

    this.createXButton();
    this.createNavButtons();
  };

  Scene_PanduanKeyboard.prototype.createXButton = function() {
      const xButton = new Window_XButton(10, 10, 100, 100);
      this.addChild(xButton);
      this._xButton = xButton;
  };

  Scene_PanduanKeyboard.prototype.createNavButtons = function() {
    const centerY = (Graphics.height - 60) / 2;

    this._nextButton = new Window_NavButton(Graphics.width - 90, centerY, 80, 100, ">", () => {
      this._guide1.visible = false;
      this._guide2.visible = true;
    });
    this.addChild(this._nextButton);

    this._backButton = new Window_NavButton(10, centerY, 80, 100, "<", () => {
      this._guide1.visible = true;
      this._guide2.visible = false;
    });
    this.addChild(this._backButton);
  };

  Scene_PanduanKeyboard.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
  
    if (Input.isTriggered('cancel')) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
  
    if (Input.isTriggered('right')) {
      SoundManager.playCursor();
      this._guide1.visible = false;
      this._guide2.visible = true;
    }
  
    if (Input.isTriggered('left')) {
      SoundManager.playCursor();
      this._guide1.visible = true;
      this._guide2.visible = false;
    }
  };  

  // ===== Scene Profile =====
  function Scene_Profile() {
    this.initialize.apply(this, arguments);
  }

  Scene_Profile.prototype = Object.create(Scene_Base.prototype);
  Scene_Profile.prototype.constructor = Scene_Profile;

  Scene_Profile.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
  };

  Scene_Profile.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    const sprite = new Sprite(ImageManager.loadPicture("profile_screen"));
    this.addChild(sprite);
    this.createXButton();
  };

  Scene_Profile.prototype.createXButton = function() {
      const xButton = new Window_XButton(10, 10, 100, 100);
      this.addChild(xButton);
      this._xButton = xButton;
  };

  Scene_Profile.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (Input.isTriggered('cancel')) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
  };

  // ===== Window Confirm Exit =====
  function Window_ConfirmExit() {
    this.initialize.apply(this, arguments);
  }

  Window_ConfirmExit.prototype = Object.create(Window_Command.prototype);
  Window_ConfirmExit.prototype.constructor = Window_ConfirmExit;

  Window_ConfirmExit.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.openness = 255;
  };

  Window_ConfirmExit.prototype.windowWidth = function() {
    return 240;
  };

  Window_ConfirmExit.prototype.makeCommandList = function() {
    this.addCommand("Ya", "yes");
    this.addCommand("Tidak", "no");
  };

  // ===== Title Screen Mod =====
  const _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function() {
    _Scene_Title_create.call(this);
    this._confirmWindow = null;
  };

  const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
  Scene_Title.prototype.createCommandWindow = function() {
    _Scene_Title_createCommandWindow.call(this);
    this._commandWindow.setHandler('exit', this.commandKeluar.bind(this));
    this._commandWindow.setHandler('panduan', this.commandPanduan.bind(this));
    this._commandWindow.setHandler('profile', this.commandProfile.bind(this));
  };

  const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
  Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand('♥ Permainan Baru', 'newGame');
    this.addCommand('♥ Lanjut Permainan', 'continue', this.isContinueEnabled());
    this.addCommand('♥ Panduan Bermain', 'panduan');
    this.addCommand('♥ Pengaturan', 'options');
    this.addCommand('♥ Tentang', 'profile');
    this.addCommand('♥ Keluar', 'exit');
  };

  Scene_Title.prototype.commandKeluar = function() {
    SoundManager.playCancel();
    this._commandWindow.deactivate();

    this._confirmWindow = new Window_ConfirmExit();
    this._confirmWindow.x = (Graphics.boxWidth - this._confirmWindow.width) / 2;
    this._confirmWindow.y = (Graphics.boxHeight - this._confirmWindow.height) / 2;
    this._confirmWindow.setHandler('yes', this.confirmExitYes.bind(this));
    this._confirmWindow.setHandler('no', this.confirmExitNo.bind(this));
    this.addWindow(this._confirmWindow);

    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundFilter.blur = 3;

    if (this._backSprite1) this._backSprite1.filters = [this._backgroundFilter];
    if (this._backSprite2) this._backSprite2.filters = [this._backgroundFilter];
    if (this._commandWindow) this._commandWindow.filters = [this._backgroundFilter];

    this._confirmWindow.select(0);
    this._confirmWindow.activate();
  };

  Scene_Title.prototype.confirmExitYes = function() {
    SoundManager.playOk();
    SceneManager.exit();
  };

  Scene_Title.prototype.confirmExitNo = function() {
    SoundManager.playCancel();
    this._confirmWindow.close();
    this._confirmWindow.deactivate();
    this.removeChild(this._confirmWindow);

    if (this._backSprite1) this._backSprite1.filters = null;
    if (this._backSprite2) this._backSprite2.filters = null;
    if (this._commandWindow) this._commandWindow.filters = null;

    this._commandWindow.activate();
  };

  Scene_Title.prototype.commandPanduan = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_PanduanKeyboard);
  };

  Scene_Title.prototype.commandProfile = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Profile);
  };

})();
