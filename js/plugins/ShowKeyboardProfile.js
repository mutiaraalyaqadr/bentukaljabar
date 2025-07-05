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
      if (this.visible && this.isClicked()) {
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
      if (this.visible && this.isClicked()) {
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
  
    this._currentIndex = 0;
  
    // Load semua gambar slide
    this._guides = [
      new Sprite(ImageManager.loadPicture("baloninteraksi")),
      new Sprite(ImageManager.loadPicture("arahpanah")),
      new Sprite(ImageManager.loadPicture("darah")),
      new Sprite(ImageManager.loadPicture("lawan")),
      new Sprite(ImageManager.loadPicture("tamat"))
    ];
  
    // Tambahkan semua ke scene, tapi sembunyikan selain index 0
    for (let i = 0; i < this._guides.length; i++) {
      this._guides[i].visible = (i === 0);
      this.addChild(this._guides[i]);
    }
  
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
      this.showSlide(this._currentIndex + 1);
    });
    this.addChild(this._nextButton);
  
    this._backButton = new Window_NavButton(10, centerY, 80, 100, "<", () => {
      this.showSlide(this._currentIndex - 1);
    });
    this.addChild(this._backButton);
  };
  
  Scene_PanduanKeyboard.prototype.showSlide = function(index) {
    if (index < 0 || index >= this._guides.length) return;
  
    this._guides[this._currentIndex].visible = false;
    this._guides[index].visible = true;
    this._currentIndex = index;
  };
  
  Scene_PanduanKeyboard.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
  
    // Tombol navigasi hanya aktif jika memungkinkan
    this._backButton.visible = this._currentIndex > 0;
    this._nextButton.visible = this._currentIndex < this._guides.length - 1;
  
    if (Input.isTriggered('cancel')) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
  
    if (Input.isTriggered('right') && this._currentIndex < this._guides.length - 1) {
      SoundManager.playCursor();
      this.showSlide(this._currentIndex + 1);
    }
  
    if (Input.isTriggered('left') && this._currentIndex > 0) {
      SoundManager.playCursor();
      this.showSlide(this._currentIndex - 1);
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

  function Scene_Info() {
    this.initialize.apply(this, arguments);
  }
  
  Scene_Info.prototype = Object.create(Scene_Base.prototype);
  Scene_Info.prototype.constructor = Scene_Info;
  
  Scene_Info.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this._currentSlide = 0; // 0 = options, 1+ = gambar
  };
  
  Scene_Info.prototype.create = function() {
    Scene_Base.prototype.create.call(this);

    this._backgroundSprite = new Sprite(ImageManager.loadPicture("info_slide1_bg"));
    this.addChild(this._backgroundSprite);
    this._backgroundSprite.visible = true;

    //Option window
    this._optionsWindow = new Window_Options();
    this._optionsWindow.x = (Graphics.width - this._optionsWindow.width) / 2;
    this._optionsWindow.y = (Graphics.height - this._optionsWindow.height) / 2;
    this.addChild(this._optionsWindow);

    this._slides = [];
    const slide1 = new Sprite(ImageManager.loadPicture("info_slide1"));
    const slide2 = new Sprite(ImageManager.loadPicture("info_slide2"));
    slide1.visible = false;
    slide2.visible = false;
    this._slides.push(slide1, slide2);
    this.addChild(slide1);
    this.addChild(slide2);

    this._xButton = new Window_XButton(10, 10, 100, 100);
    this.addChild(this._xButton);

    const centerY = (Graphics.height - 60) / 2;
    this._nextButton = new Window_NavButton(Graphics.width - 90, centerY, 80, 100, ">", () => {
        this.changeSlide(this._currentSlide + 1);
    });
    this.addChild(this._nextButton);

    this._backButton = new Window_NavButton(10, centerY, 80, 100, "<", () => {
        this.changeSlide(this._currentSlide - 1);
    });
    this.addChild(this._backButton);

    this.updateSlideVisibility();
};
  
Scene_Info.prototype.changeSlide = function(index) {
  SoundManager.playCursor();
  this._currentSlide = index.clamp(0, this._slides.length); // Mencegah out of range
  this.updateSlideVisibility();

  // Menampilkan background khusus untuk slide pertama (Slide 0)
  if (this._currentSlide === 0) {
      this._backgroundSprite.visible = true;  // Tampilkan background pada slide pertama
  } else {
      this._backgroundSprite.visible = false;  // Sembunyikan background di slide lainnya
  }
};
  
Scene_Info.prototype.updateSlideVisibility = function() {
  // Slide 0 = options
  const isOptionSlide = this._currentSlide === 0;
  this._optionsWindow.visible = isOptionSlide;
  this._optionsWindow.active = isOptionSlide;

  // Slide gambar
  this._slides.forEach((slide, i) => {
      slide.visible = (this._currentSlide === i + 1);
  });

  // Navigasi tombol: < muncul kalau bukan di awal, > muncul kalau belum di akhir
  this._backButton.visible = this._currentSlide > 0;
  this._nextButton.visible = this._currentSlide < this._slides.length;
};
  
  Scene_Info.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
  
    if (Input.isTriggered('cancel')) {
      SoundManager.playCancel();
      SceneManager.pop();
    }
  
    // Keyboard navigasi
    if (Input.isTriggered('right') && this._currentSlide < this._slides.length) {
      this.changeSlide(this._currentSlide + 1);
    }
  
    if (Input.isTriggered('left') && this._currentSlide > 0) {
      this.changeSlide(this._currentSlide - 1);
    }
  };  

  Scene_Info.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite(ImageManager.loadPicture("volume_bg"));
    this.addChild(this._backgroundSprite);
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
    this._commandWindow.setHandler('options', this.commandInfo.bind(this));

  };

  const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
  Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand('♥ Permainan Baru', 'newGame');
    this.addCommand('♥ Lanjut Permainan', 'continue', this.isContinueEnabled());
    this.addCommand('♥ Panduan Bermain', 'panduan');
    this.addCommand('♥ Info', 'options');
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

  Scene_Title.prototype.commandInfo = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Info);
  };  

})();
