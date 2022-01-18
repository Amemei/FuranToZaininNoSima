/*:
 * @plugindesc シンボルエンカウント作成の補助を行います。
 詳しい使い方はヘルプを参照してください。
 * @author 茶の助
 *
 * @help 敵シンボルにしたいイベントのメモ欄に<se>と入力し、
 自立移動のタイプを「近づく」にしてください。
 
 ■プレイヤーとそのイベントの向きに応じて、
 　先制攻撃・不意打ちが起こるようになります。
 　設定した変数に数値が代入され、
 　０の場合は通常、１の場合は先制攻撃、２の場合は不意打ちになります。
 　変数は戦闘後にリセットされます。
 
 ■デフォルトの「近づく」ではプレイヤーが２０マス以内にいる場合に
 　自動的に追尾するようになっていますが、
 　敵の背後にいる場合はプレイヤーを見失い、近づかないようになります。
 *
 * @param situationVariables
 * @desc 使用する変数番号
 * @default 1
 */

(function() {

    var parameters = PluginManager.parameters('TYA_SymbolEncount');
    var situationVariables = Number(parameters['situationVariables']);

    var _BattleManager_onEncounter = BattleManager.onEncounter;
    BattleManager.onEncounter = function() {
        _BattleManager_onEncounter.call(this);
        
        switch ($gameVariables.value(situationVariables)) {
        case 0:
            this._preemptive = false
            this._surprise = false
            break;
        case 1:
            this._preemptive = true;
            break;
        case 2:
            this._preemptive = false;
            this._surprise = true;
            break;
        }
    };
    
    Game_Event.prototype.isNearThePlayer = function() {
        var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        var np = sx + sy < 20;
        if (this.event().meta.se) {
            var _player = $gamePlayer;
            var _enemy = this;
            switch (_enemy._direction) {
            case 2:
                if (_player.y < _enemy.y) { np = false; }
                break;
            case 8:
                if (_player.y > _enemy.y) { np = false; }
                break;
            case 4:
                if (_player.x > _enemy.x) { np = false; }
                break;
            case 6:
                if (_player.x < _enemy.x) { np = false; }
                break;
            }
        }
        return np;
    };
    
    Game_Event.prototype.encountSituation = function () {
        var _player = $gamePlayer;
        var _enemy = this;
        if (_player._direction == _enemy._direction) {
            switch (_enemy._direction) {
            case 2:
                 if (_player.y <= _enemy.y) {
                     $gameVariables.setValue(situationVariables, 1);
                 } else {
                     $gameVariables.setValue(situationVariables, 2);
                 }
                 break;
            case 8:
                if (_player.y >= _enemy.y) {
                     $gameVariables.setValue(situationVariables, 1);
                 } else {
                     $gameVariables.setValue(situationVariables, 2);
                 }
                 break;
            case 4:
                if (_player.x >= _enemy.x) {
                     $gameVariables.setValue(situationVariables, 1);
                } else {
                     $gameVariables.setValue(situationVariables, 2);
                }
                break;
            case 6:
                if (_player.x <= _enemy.x) {
                     $gameVariables.setValue(situationVariables, 1);
                } else {
                     $gameVariables.setValue(situationVariables, 2);
                }
                break;
            }
        } else {
            $gameVariables.setValue(situationVariables, 0);
        }
    };

    Game_Event.prototype.lock = function() {
        if (!this._locked) {
        var se = this.event().meta.se;
            if (se) {
                this.encountSituation();
            }
            this._prelockDirection = this.direction();
            if (!se) {
                this.turnTowardPlayer();
            }
            this._locked = true;
        }
    };

    Game_Interpreter.prototype.command301 = function() {
        if (!$gameParty.inBattle()) {
            var troopId;
            if (this._params[0] === 0) {  // Direct designation
                troopId = this._params[1];
            } else if (this._params[0] === 1) {  // Designation with a variable
                troopId = $gameVariables.value(this._params[1]);
            } else {  // Same as Random Encounter
                troopId = $gamePlayer.makeEncounterTroopId();
            }
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, this._params[2], this._params[3]);
                BattleManager.onEncounter(); //
                BattleManager.setEventCallback(function(n) {
                    this._branch[this._indent] = n;
                }.bind(this));
                $gamePlayer.makeEncounterCount();
                SceneManager.push(Scene_Battle);
            }
        }
        return true;
    };

    var _Scene_Battle_prototype_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_prototype_terminate.call(this);
        
        $gameVariables.setValue(situationVariables, 0);
    };

})();