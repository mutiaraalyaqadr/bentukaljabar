/*:
 * @plugindesc Tambah tombol "X" kiri atas di Scene_Options untuk kembali ke menu utama (RPG Maker MV compatible).
 * @author Kamu
 */

(function() {
    const _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this.createXButton();
    };

    Scene_Options.prototype.createXButton = function() {
        const x = 10;
        const y = 10;
        const width = 100;
        const height = 100;

        const xButton = new Window_XButton(x, y, width, height);
        this.addWindow(xButton);
        this._xButton = xButton;
    };

    function Window_XButton() {
        this.initialize.apply(this, arguments);
    }

    Window_XButton.prototype = Object.create(Window_Base.prototype);
    Window_XButton.prototype.constructor = Window_XButton;

    Window_XButton.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.setBackgroundType(2); // semi transparan
        this.drawButton();
    };

    Window_XButton.prototype.drawButton = function() {
        this.contents.clear();
        this.contents.fontSize = 40;
        this.changeTextColor(this.normalColor());
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
})();
