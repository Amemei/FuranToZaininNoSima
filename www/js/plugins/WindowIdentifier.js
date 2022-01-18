//=============================================================================
// Window Identifier
// by Shaz (based on Ace script by Rhyme)
// Last Updated: 2015.11.18
//=============================================================================

/*:
 * @plugindesc Shows the name of the windows while holding CTRL.
 * @author Shaz, Rhyme
 *
 * @param Font Size
 * @desc Font Size for window names
 * @default 28
 *
 * @param Font Color
 * @desc Color of text for window names (based on windowskin)
 * @default 0
 *
 * @help
 *
 * Hold the CTRL key in a scene to have window names pop up.
 * Remember to disable this on your game's final release!
 *
 */

(function() {

  var parameters = PluginManager.parameters('WindowIdentifier');
  var fontSize = parseInt(parameters['Font Size'] || 28);
  var fontColor = parseInt(parameters['Font Color'] || 0);

  _Window_Base_createContents = Window_Base.prototype.createContents;
  Window_Base.prototype.createContents = function() {
    _Window_Base_createContents.call(this);
    if (!this._windowName) {
      this._windowName = new Sprite();
      this._windowName.bitmap = new Bitmap(500, this.lineHeight());
      this._windowName.bitmap.fontSize = fontSize;
      this._windowName.bitmap.textColor = fontColor;
      this._windowName.bitmap.drawText(this.constructor.toString().match(/function (\w*)/)[1], this.standardPadding(), this.standardPadding(), 500, 0);
      this.addChild(this._windowName);
      this._windowName.opacity = 0;
    }
  };

  _Window_Base_update = Window_Base.prototype.update;
  Window_Base.prototype.update = function() {
    _Window_Base_update.call(this);
    if (Input.isPressed('control')) {
      this._windowName.opacity += 16;
    } else {
      this._windowName.opacity -= 16;
    }
  };
})();
