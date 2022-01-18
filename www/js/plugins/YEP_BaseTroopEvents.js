//=============================================================================
// Yanfly Engine Plugins - Base Troop Events
// YEP_BaseTroopEvents.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_BaseTroopEvents = true;

var Yanfly = Yanfly || {};
Yanfly.BTE = Yanfly.BTE || {};

//=============================================================================
/*:
 * @plugindesc v1.00 Enabling this plugin will cause all troops to have
 * events occur in every fight.
 * @author Yanfly Engine Plugins
 *
 * @param Base Troop ID
 * @desc Change this value to the Troop ID you want all of the recurring
 * troop events to draw from.
 * @default 1
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * For all the eventers out there who love to customize their battles through
 * custom event pages, you can now save yourself some time by drawing all the
 * event pages from a base troop event to occur in every fight. All of the
 * events will be present in every single battle.
 */

/*:ja
 * @plugindesc 全ての敵グループに対して、
 * 毎回戦闘で発生するイベントを設定します。
 * 
 * @author Yanfly Engine Plugins
 *
 * @param Base Troop ID
 * @desc 全イベントの参照元となる、敵グループのIDを指定してください
 * @default 1
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * イベントページから、戦闘をカスタマイズしたい開発者向けのプラグインです。
 * ベースとなる敵グループへの登録で、全ての戦闘でそのイベントが実行されます。
 * 一括で反映ができるので、開発時間を短縮することが出来ます。
 */



//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_BaseTroopEvents');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.BaseTroopID = Number(Yanfly.Parameters['Base Troop ID']);

//=============================================================================
// DataManager
//=============================================================================

Yanfly.BTE.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Yanfly.BTE.DataManager_isDatabaseLoaded.call(this)) return false;
		this.processBTEPages();
		return true;
};

DataManager.processBTEPages = function() {
	for (var n = 1; n < $dataTroops.length; n++) {
		var base_troop = $dataTroops[Yanfly.Param.BaseTroopID];
		var troop = $dataTroops[n];
		if (n !== Yanfly.Param.BaseTroopID && Yanfly.Param.BaseTroopID > 0) {
      if (troop._baseTroopEventsMade) continue;
      Yanfly.Util.extend(troop.pages, base_troop.pages);
      troop._baseTroopEventsMade = true;
		}
	}
};

//=============================================================================
// New Function
//=============================================================================

Yanfly.Util = Yanfly.Util || {};

Yanfly.Util.extend = function (mainArray, otherArray) {
    otherArray.forEach(function(i) {
      mainArray.push(i)
    }, this);
}

//=============================================================================
// End of File
//=============================================================================
