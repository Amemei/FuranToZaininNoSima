//=============================================================================
// Yanfly Engine Plugins - Event Chase Player
// YEP_EventChasePlayer.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_EventChasePlayer = true;

var Yanfly = Yanfly || {};
Yanfly.ECP = Yanfly.ECP || {};

//=============================================================================
 /*:
 * @plugindesc v1.00 When a player is in the proximity of a certain event,
 * the event will start chasing or fleeing from the player.
 * @author Yanfly Engine Plugins
 *
 * @param Sight Lock
 * @desc This is the number of frames for how long an event chases
 * the player if 'this._seePlayer = true' is used.
 * @default 300
 *
 * @param See Player
 * @desc Does the event have to be able to see the player by default?
 * NO - false     YES - true
 * @default true
 *
 * @param Alert Timer
 * @desc This is the number of frames that must occur before the
 * alert balloon will show up on the same event.
 * @default 120
 *
 * @param Alert Balloon
 * @desc This is the default balloon used when the player is seen.
 * Refer to balloon ID's.
 * @default 1
 *
 * @param Alert Sound
 * @desc This is the default sound played when the player is seen.
 * @default Attack1
 *
 * @param Alert Common Event
 * @desc The default common event played when the player is seen.
 * Use 0 if you do not wish to use a Common Event.
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows you to make events that will chase the player or flee
 * from the player when the player enters within range of the event or when the
 * event sees the player.
 *
 * ============================================================================
 * How to Use
 * ============================================================================
 *
 * Insert these lines into the script call window within the Movement Route
 * event to give an event the chase or flee flag.
 *
 * Note: This doesn’t work with players.
 *
 * Script Call lines
 *  this._chaseRange = x       Event will chase player if reaching x range.
 *  this._fleeRange = x        Event will flee from player if reaching x range.
 *  this._chaseSpeed = x       Event's movement speed when chasing.
 *  this._fleeSpeed = x        Event's movement speed when fleeing.
 *  this._sightLock = x        Event will flee/chase player for x frames.
 *  this._seePlayer = true     Requires the event to be able to see player.
 *  this._seePlayer = false    Doesn't require event to be able to see player.
 *  this._alertBalloon = x     This balloon will play when player is seen.
 *  this._alertSound = x       This sound will play when player is seen.
 *  this._alertCommonEvent = x This event will play when player is seen.
 *
 * It is best to play this inside of a custom move route for the event at a
 * high frequency rate. Keep in mind these effects only occur after the setting
 * is made and ran, which means upon loading a map, if the event with a low
 * frequency hasn't loaded up 'this._chaseRange = x' in its movement queue yet,
 * the event will not chase the player just yet.
 */
 /*:ja
 * @plugindesc プレイヤーが近づいた際に、イベントがプレイヤーを追いかけたり
 * プレイヤーから逃げるアクションを取ります
 * @author Yanfly Engine Plugins
 *
 * @param Sight Lock
 * @desc 'seePlayer'がtrueの時、イベントがプレイヤーを追いかける時間を設定します(フレーム単位)
 * @default 300
 *
 * @param See Player
 * @desc イベントがプレイヤーを認識する必要があるか設定します
 * NO - false     YES - true
 * @default true
 *
 * @param Alert Timer
 * @desc イベント上でフキダシを表示するまでにかかるフレーム数を指定します
 * @default 120
 *
 * @param Alert Balloon
 * @desc プレイヤーが認識された際に表示される、フキダシを指定します
 * @default 1
 *
 * @param Alert Sound
 * @desc プレイヤーが認識された際に表示される、サウンドを指定します
 * @default Attack1
 *
 * @param Alert Common Event
 * @desc プレイヤーが認識された際に再生される、コモンイベントを指定します
 * コモンイベントを利用しない場合は、0を指定してください
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * このプラグインでは、プレイヤーを追いかけるイベント、もしくは
 * プレイヤーから逃げるイベントを作成することができます。
 * プレイヤーがイベントから一定の距離範囲内に入った時や
 * イベントがプレイヤーを認識した際に発動させることができます。
 *
 * ============================================================================
 * How to Use
 * ============================================================================
 *
 * 下記のコードをスクリプトコールウィンドウ内の、
 * Movement Routeイベント内に挿入することで、そのイベントに
 * 追跡もしくは逃走のフラグを付与することができます。
 *
 * 注＊プレイヤーに対しては無効です。
 *
 * <スクリプトコール>
 *  this._chaseRange = x       
 *              →x の距離内に入った時、イベントがプレイヤーを追いかけます
 *  this._fleeRange = x        
 *              →x の距離内に入った時、イベントはプレイヤーから逃げます
 *  this._chaseSpeed = x       
 *              →追いかける時のイベントの速度 x を決定します
 *  this._fleeSpeed = x        
 *              →逃げる時のイベントの速度 x を決定します
 *  this._sightLock = x        
 *              →追いかける/逃げる際のイベントフレームレート x を決定します
 *  this._seePlayer = true    
 *              →イベントはプレイヤーを認識する必要があります
 *  this._seePlayer = false 
 *              →イベントはプレイヤーを認識する必要がありません
 *  this._alertBalloon = x   
 *              →プレイヤーが認識されると、x というフキダシを表示します
 *  this._alertSound = x  
 *              →プレイヤーが認識されると、x というサウンドを再生します
 *  this._alertCommonEvent = x
 *              →プレイヤーが認識されると、x というイベントを再生します
 *
 * カスタムした移動ルート内でイベントを再生させる際は、
 * 移動頻度はなるべく高く設定するようにしてください。
 * 
 * 設定が完了し有効になるまでは、これらのエフェクトは発動しません。
 * 移動頻度の低いイベントですと、マップロード中に'this._chaseRange = x'の
 * 読み込みを完了できず、プレイヤーを追いかけなくなってしまう可能性があります。
 * 
 */

//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_EventChasePlayer');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.ECPSightLock = Number(Yanfly.Parameters['Sight Lock']);
Yanfly.Param.ECPSeePlayer = String(Yanfly.Parameters['See Player']);
Yanfly.Param.ECPAlertTimer = Number(Yanfly.Parameters['Alert Timer']);
Yanfly.Param.ECPAlertBalloon = Number(Yanfly.Parameters['Alert Balloon']);
Yanfly.Param.ECPAlertSound = String(Yanfly.Parameters['Alert Sound']);
Yanfly.Param.ECPAlertEvent = Number(Yanfly.Parameters['Alert Common Event']);

//=============================================================================
// Main Code
//=============================================================================

Yanfly.ECP.Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    Yanfly.ECP.Game_Event_setupPage.call(this);
    this.clearChaseSettings();
};

Game_Event.prototype.clearChaseSettings = function() {
  this._alertBalloon = Yanfly.Param.ECPAlertBalloon;
  this._alertCommonEvent = Yanfly.Param.ECPAlertEvent;
  this._alertLock = 0;
  this._alertPlayer = false;
  this._alertSound = Yanfly.Param.ECPAlertSound;
  this._alertTimer = 0;
  this._chasePlayer = false;
  this._chaseRange = 0;
  this._chaseSpeed = this._moveSpeed;
  this._defaultSpeed = this._moveSpeed;
  this._fleePlayer = false;
  this._fleeRange = 0;
  this._fleeSpeed = this._moveSpeed;
  this._seePlayer = eval(Yanfly.Param.ECPSeePlayer);
  this._sightLock = eval(Yanfly.Param.ECPSightLock);
};

Yanfly.ECP.Game_Event_updateSelfMovement =
    Game_Event.prototype.updateSelfMovement;
Game_Event.prototype.updateSelfMovement = function() {
    if (Imported.YEP_StopAllMove && $gameSystem.isEventMoveStopped()) return;
    this.updateChaseDistance();
    this.updateFleeDistance();
    this.updateChaseMovement();
};

Yanfly.ECP.Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
    Yanfly.ECP.Game_Event_update.call(this);
    this.updateAlert();
};

Game_Event.prototype.canSeePlayer = function() {
    if (!this._seePlayer) return false;
    var sx = this.deltaXFrom($gamePlayer.x);
    var sy = this.deltaYFrom($gamePlayer.y);
    if (Math.abs(sx) > Math.abs(sy)) {
      var direction = (sx > 0) ? 4 : 6;
    } else {
      var direction = (sy > 0) ? 8 : 2;
    }
    if (direction === this.direction()) {
      this._alertLock = this._sightLock;
      return true;
    }
    return false;
};

Game_Event.prototype.updateChaseDistance = function() {
    if (this._erased) return;
    if (this._chaseRange <= 0) return;
    var dis = Math.abs(this.deltaXFrom($gamePlayer.x));
    dis += Math.abs(this.deltaYFrom($gamePlayer.y));
    if (this.chaseConditions(dis)) {
      this._chasePlayer = true;
      this.setMoveSpeed(this._chaseSpeed);
    } else if (this._chasePlayer) {
      this._chasePlayer = false;
      this.setMoveSpeed(this._defaultSpeed);
      if (this._alertTimer <= 0) this._alertPlayer = false;
    }
};

Game_Event.prototype.chaseConditions = function(dis) {
    if (this._alertLock > 0) return true;
    if (dis <= this._chaseRange && this.canSeePlayer()) return true;
    if (dis <= this._chaseRange && !this._seePlayer) {
      this._alertLock = this._sightLock;
      return true;
    }
    return false;
};

Game_Event.prototype.updateFleeDistance = function() {
    if (this._erased) return;
    if (this._fleeRange <= 0) return;
    var dis = Math.abs(this.deltaXFrom($gamePlayer.x));
    dis += Math.abs(this.deltaYFrom($gamePlayer.y));
    if (this.fleeConditions(dis)) {
      this._fleePlayer = true;
      this.setMoveSpeed(this._fleeSpeed);
    } else if (this._fleePlayer) {
      this._fleePlayer = false;
      this.setMoveSpeed(this._defaultSpeed);
      if (this._alertTimer <= 0) this._alertPlayer = false;
    }
};

Game_Event.prototype.fleeConditions = function(dis) {
    if (this._alertLock > 0) return true;
    if (dis <= this._fleeRange && this.canSeePlayer()) return true;
    if (dis <= this._fleeRange && !this._seePlayer) {
      this._alertLock = this._sightLock;
      return true;
    }
    return false;
};

Game_Event.prototype.updateChaseMovement = function() {
    if (this._stopCount > 0 && this._chasePlayer) {
      this.moveTowardPlayer();
    } else if (this._stopCount > 0 && this._fleePlayer) {
      this.moveAwayFromPlayer();
    } else {
      Yanfly.ECP.Game_Event_updateSelfMovement.call(this);
    }
};

Game_Event.prototype.updateAlert = function() {
    if (this._erased) return;
    this._alertLock--;
    if (this.alertConditions()) this.activateAlert();
    if (this._alertPlayer) this._alertTimer--;
};

Game_Event.prototype.alertConditions = function() {
    return (this._chasePlayer || this._fleePlayer) && !this._alertPlayer;
};

Game_Event.prototype.activateAlert = function() {
    if (this._alertBalloon >= 0) this.requestBalloon(this._alertBalloon);
    this._alertPlayer = true;
    this._alertTimer = Yanfly.Param.ECPAlertTimer;
    this.playAlertSound();
    this.playAlertCommonEvent();
};

Game_Event.prototype.playAlertSound = function() {
    if (this._alertSound === '') return;
    var sound = {
      name:   this._alertSound,
      volume: 100,
      pitch:  100,
      pan:    100
    };
    AudioManager.playSe(sound);
};

Game_Event.prototype.playAlertCommonEvent = function() {
    if (this._alertCommonEvent <= 0) return;
    $gameTemp.reserveCommonEvent(this._alertCommonEvent);
};

//=============================================================================
// End of File
//=============================================================================
