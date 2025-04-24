/*:
 * @plugindesc Menampilkan nilai (dari Variable ID 50) di pojok kanan atas saat berada di map. Cocok untuk skor atau level progress.
 * @author ChatGPT
 *
 * @help
 * Plugin ini akan menampilkan window kecil di pojok kanan atas berisi nilai dari Variable ID 50.
 * Cocok untuk menunjukkan skor, poin, atau progres pemain.
 *
 * Tidak memerlukan plugin command.
 * Ubah nilai Variable ID 50 menggunakan event:
 *   - Control Variables: [0050: Skor] += 10
 */

(function() {
    function ScoreWindow() {
        this.initialize.apply(this, arguments);
    }

    ScoreWindow.prototype = Object.create(Window_Base.prototype);
    ScoreWindow.prototype.constructor = ScoreWindow;

    ScoreWindow.prototype.initialize = function() {
        const width = 160;
        const height = 70;
        const x = Graphics.boxWidth - width; // posisi kanan atas
        const y = 0;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.openness = 255;
        this.refresh();
    };

    ScoreWindow.prototype.refresh = function() {
        this.contents.clear();
        const score = $gameVariables.value(50);
        this.drawText("Nilai: " + score, 0, 0, this.contents.width, 'center');
    };

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this._scoreWindow = new ScoreWindow();
        this.addWindow(this._scoreWindow);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (this._scoreWindow) {
            this._scoreWindow.refresh();
        }
    };
})();
