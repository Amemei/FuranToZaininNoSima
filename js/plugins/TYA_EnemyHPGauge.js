/*:
 * @plugindesc 敵ターゲットウィンドウにＨＰゲージを表示させます。
 特定の敵のゲージを非表示にすることもできます。
 * @author 茶の助
 *
 * @help ＨＰゲージを表示させたくない場合は、
 その敵のメモ欄に<ＨＰ非表示>と書いてください。
 */

(function() {

    Window_Base.prototype.gaugeColor = function(rate) {
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        return [color1, color2];
    };

    Window_BattleEnemy.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        if(!$dataEnemies[this._enemies[index]._enemyId].note.match('<ＨＰ非表示>')){
          var hprate = this._enemies[index].hp / this._enemies[index].mhp;
          var color = this.gaugeColor(hprate);
          this.drawGauge(rect.x, rect.y, rect.width, hprate, color[0], color[1]);
        }
        this.resetTextColor();
        var name = this._enemies[index].name();
        this.drawText(name, rect.x, rect.y, rect.width);
    };

})();