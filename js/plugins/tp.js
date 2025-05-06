//=============================================================================
// HideTP.js
//=============================================================================

/*:
 * @plugindesc Menyembunyikan bar TP dari semua tampilan (battle, menu, dsb)
 * @author ChatGPT
 */

(function() {
    // Override semua fungsi tampilan TP
    Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
      // Do nothing = TP bar tidak akan digambar
    };
  })();
  