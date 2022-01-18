//=============================================================================
// Yanfly Engine Plugins - Save Event Locations
// YEP_SaveEventLocations.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_SaveEventLocations = true;

var Yanfly = Yanfly || {};
Yanfly.SEL = Yanfly.SEL || {};

//=============================================================================
 /*:
 * @plugindesc v1.00 Enable specified maps to memorize the locations of
 * events when leaving and loading them upon reentering map.
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Normally in RPG Maker MV, leaving a map and returning to it will reset the
 * map positions of all the events. For certain types of maps, such as puzzles,
 * you would want the map to retain their locations.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Map Notetag:
 *   <Save Event Locations>
 *   This will cause the map to save every event's location on that map. After
 *   leaving and returning to that map, the events will be reloaded onto their
 *   last saved positions in addition to the direction they were facing.
 *
 * Event Notetag:
 *   <Save Event Location>
 *   This will enable this specific event to save its location on this map.
 *   After leaving and returning to the map, the event will be reloaded onto
 *   its last saved position in addition to the direction it was facing.
 *
 * If you wish to reset the position of the Event, simply use the Event Editor
 * and use "Set Event Location" to anchor the event's location to the desired
 * point as if you would normally.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Plugin Command
 *   ResetAllEventLocations    This resets all the event locations on the map.
 */
/*:ja
 * @plugindesc マップに出入りする際でも、マップ上のイベントの位置を
 * 保存・維持させることができるようになります。
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 *  RPGツクールMVでは通常、マップを離脱する際/マップに戻る際には
 * マップ上のすべてのイベント位置がリセットされてしまいます。
 * パズルのような特定のマップ作成においては、上記の機能は煩わしいものでした。
 * 
 * このプラグインでは、マップ上の全て/指定の
 * イベントの位置を保持することが可能になります
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Map Notetag:
 *   <Save Event Locations>
 *   マップ上の全てのイベント位置をマップに保存させます。
 *   マップに入り直すと、イベントは最後に保存された
 *   元の位置/元の向きでロードされます。
 *
 * Event Notetag:
 *   <Save Event Location>
 *   マップ上の特定のイベント位置をマップに保存させます。
 *   マップに入り直すと、イベントは最後に保存された
 *   元の位置/元の向きでロードされます。
 *
 * イベントの位置をリセットしたい場合、イベントエディタを開いて、
 * 通常通り「イベント位置を設定する」を選んでください。
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Plugin Command
 *   ResetAllEventLocations    マップ上の全てのイベント位置をリセットします。
 */


//=============================================================================

//=============================================================================
// DataManager
//=============================================================================

DataManager.processSELNotetags1 = function() {
	if (!$dataMap) return;
	if (!$dataMap.note) return;
	var notedata = $dataMap.note.split(/[\r\n]+/);
  $dataMap.saveEventLocations = false;
	for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		if (line.match(/<(?:SAVE EVENT LOCATION|save event locations)>/i)) {
			$dataMap.saveEventLocations = true;
		}
	}
};

DataManager.processSELNotetags2 = function(obj) {
	var notedata = obj.note.split(/[\r\n]+/);
  obj.saveEventLocation = false;
	for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		if (line.match(/<(?:SAVE EVENT LOCATION|save event locations)>/i)) {
			obj.saveEventLocation = true;
		}
	}
};

//=============================================================================
// Game_System
//=============================================================================

Yanfly.SEL.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  Yanfly.SEL.Game_System_initialize.call(this);
	this.initSavedEventLocations();
};

Game_System.prototype.initSavedEventLocations = function() {
	this._savedEventLocations = {};
};

Game_System.prototype.savedEventLocations = function() {
	if (this._savedEventLocations === undefined) this.initSavedEventLocations();
	return this._savedEventLocations;
};

Game_System.prototype.isSavedEventLocation = function(mapId, eventId) {
	if (this._savedEventLocations === undefined) this.initSavedEventLocations();
	return this._savedEventLocations[[mapId, eventId]] !== undefined;
};

Game_System.prototype.getSavedEventX = function(mapId, eventId) {
	if (this._savedEventLocations === undefined) this.initSavedEventLocations();
	return this._savedEventLocations[[mapId, eventId]][0];
};

Game_System.prototype.getSavedEventY = function(mapId, eventId) {
	if (this._savedEventLocations === undefined) this.initSavedEventLocations();
	return this._savedEventLocations[[mapId, eventId]][1];
};

Game_System.prototype.getSavedEventDir = function(mapId, eventId) {
	if (this._savedEventLocations === undefined) this.initSavedEventLocations();
	return this._savedEventLocations[[mapId, eventId]][2];
};

Game_System.prototype.saveEventLocation = function(mapId, event) {
	if (this._savedEventLocations === undefined) this.initSavedEventLocations();
	var eventId = event.eventId();
	var eventX = event.x;
	var eventY = event.y;
	var eventDir = event.direction();
	this._savedEventLocations[[mapId, eventId]] = [eventX, eventY, eventDir];
};

//=============================================================================
// Game_Map
//=============================================================================

Yanfly.SEL.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    if ($dataMap) DataManager.processSELNotetags1();
		Yanfly.SEL.Game_Map_setup.call(this, mapId);
};

Game_Map.prototype.isSaveEventLocations = function() {
  	return $dataMap.saveEventLocations;
};

Game_Map.prototype.resetAllEventLocations = function() {
		for (var i = 0; i < this.events().length; ++i) {
			var ev = this.events()[i];
			ev.resetLocation();
		}
};

//=============================================================================
// Game_Event
//=============================================================================

Yanfly.SEL.Game_Event_locate = Game_Event.prototype.locate;
Game_Event.prototype.locate = function(x, y) {
		DataManager.processSELNotetags2(this.event());
		Yanfly.SEL.Game_Event_locate.call(this, x, y);
		this.loadLocation();
};

Yanfly.SEL.Game_Event_updateMove = Game_Event.prototype.updateMove;
Game_Event.prototype.updateMove = function() {
    Yanfly.SEL.Game_Event_updateMove.call(this);
		this.saveLocation();
};

Game_Event.prototype.isSaveLocation = function() {
		if ($gameMap.isSaveEventLocations()) return true;
		return this.event().saveEventLocation;
};

Game_Event.prototype.saveLocation = function() {
		if (!this.isSaveLocation()) return;
		$gameSystem.saveEventLocation($gameMap.mapId(), this);
};

Game_Event.prototype.isLoadLocation = function() {
		if (!this.isSaveLocation()) return false;
		return $gameSystem.isSavedEventLocation($gameMap.mapId(), this.eventId());
};

Game_Event.prototype.loadLocation = function() {
		if (!this.isLoadLocation()) return;
		var x = $gameSystem.getSavedEventX($gameMap.mapId(), this.eventId());
		var y = $gameSystem.getSavedEventY($gameMap.mapId(), this.eventId());
		this.setPosition(x, y);
		var dir = $gameSystem.getSavedEventDir($gameMap.mapId(), this.eventId());
		this.setDirection(dir);
};

Game_Event.prototype.resetLocation = function() {
		Yanfly.SEL.Game_Event_locate.call(this, this.event().x, this.event().y);
		this.setDirection(this._originalDirection);
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.SEL.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.SEL.Game_Interpreter_pluginCommand.call(this, command, args)
	if (command === 'ResetAllEventLocations') $gameMap.resetAllEventLocations();
};

//=============================================================================
// End of File
//=============================================================================
