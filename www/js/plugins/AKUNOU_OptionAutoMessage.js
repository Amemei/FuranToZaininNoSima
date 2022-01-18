//=============================================================================
// AKUNOU_OptionAutoMessage.js
// Version: 1.01
// ----------------------------------------------------------------------------
// 河原 つつみ
// 連絡先 ：『アクマの脳髄』http://www.akunou.com/
//=============================================================================

/*:
 * @plugindesc オプションに自動メッセージ送りの変更を追加します。
 * 動作には同作者のオプションベーススクリプトが必須です。
 * @author Tsutumi Kawahara
 *
 * @param Auto Message Term
 * @desc 自動メッセージ送りのオプション画面での表示名を変更します。
 * @default 自動文章送り
 *
 * @param Auto Message List
 * @desc ステータスリスト。表示名: 速度 として表記します。
 * 基本は値が大きいほど遅く、0以下で自動送りしません。
 * @default {"OFF": -1, "遅い": 190, "微妙に遅い": 140, "普通": 70, "微妙に速い": 40, "速い": 20, "最速": 10}
 *
 * @param Auto Message Default
 * @desc 自動メッセージ送りのデフォルトインデックス。
 * ステータスリストの1番目を0として数えて下さい。
 * @default 0
 *
 * @help
 * プラグインコマンド:
 *   必要なし
 * プラグイン ON にするだけで適用されるスクリプトです。
 */

(function() {

	var parameters = PluginManager.parameters('AKUNOU_OptionAutoMessage');
	var autoMessageText = parameters['Auto Message Term'];
	var autoMessageList = JSON.parse(parameters['Auto Message List']);
	var autoMessageDefault = Number(parameters['Auto Message Default']);

	//-------------------------------------------------------------------------
	// ConfigManager
	//-------------------------------------------------------------------------

	ConfigManager.autoMessageKey = autoMessageDefault;

	var akunou5_makeExtraData = ConfigManager.makeExtraData;
	
	ConfigManager.makeExtraData = function(config) {
		akunou5_makeExtraData.call(this, config);
		config.autoMessageKey = this.autoMessageKey;
		return config;
	};

	var akunou5_applyData = ConfigManager.applyData;

	ConfigManager.applyData = function(config) {
		akunou5_applyData.call(this, config);
		this.autoMessageKey = this.readAutoMessage(config, 'autoMessageKey');
	};
	
	ConfigManager.readAutoMessage = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return Number(value).clamp(0, Object.keys(autoMessageList).length-1);
		} else {
			return autoMessageDefault;
		}
	};

	//-------------------------------------------------------------------------
	// Window_Options
	//-------------------------------------------------------------------------

    var akunou5_addExtraOptions = Window_Options.prototype.addExtraOptions;

	Window_Options.prototype.addExtraOptions = function() {
		this.addCommand(autoMessageText, 'autoMessageKey');
		akunou5_addExtraOptions.call(this);
	};

	var akunou5_keyStatusText = Window_Options.prototype.keyStatusText;

	Window_Options.prototype.keyStatusText = function(symbol, value) {
		if (symbol === 'autoMessageKey') {
			return String(Object.keys(autoMessageList)[value]);
		} else {
			return akunou5_keyStatusText.call(this, symbol, value);
		}
	};

	var akunou5_keyLength = Window_Options.prototype.keyLength;

	Window_Options.prototype.keyLength = function(symbol) {
		if (symbol === 'autoMessageKey') {
			return Number(Object.keys(autoMessageList).length)-1;
		} else {
			return akunou5_keyLength.call(this, symbol);
		}
	};

	var akunou5_defaultAll = Window_Options.prototype.defaultAll;

	Window_Options.prototype.defaultAll = function() {
		akunou5_defaultAll.call(this);
		this.changeValue('autoMessageKey', autoMessageDefault);
	};

	//-------------------------------------------------------------------------
	// Window_Message
	//-------------------------------------------------------------------------

	var akunou5_initMembers = Window_Message.prototype.initMembers;
	
	Window_Message.prototype.initMembers = function() {
		this._autoCount = 0;
		akunou5_initMembers.call(this);
	};

	Window_Message.prototype.updateInput = function() {
		if (this.isAnySubWindowActive()) {
			return true;
		}
		if (this.pause) {
			if (this.isAutoMessage()) {
				this._autoCount--;
			}
			if (this.isTriggered() || this.isAutoNext()) {
				Input.update();
				this.pause = false;
				if (!this._textState) {
					this.terminateMessage();
				}
			}
			return true;
		}
		return false;
	};

	var akunou5_startPause = Window_Message.prototype.startPause;

	Window_Message.prototype.startPause = function() {
		akunou5_startPause.call(this);
		if (this.isAutoMessage()) {
			this._autoCount = autoMessageList[Object.keys(autoMessageList)[ConfigManager['autoMessageKey']]];
		}
	};

	Window_Message.prototype.isAutoMessage = function() {
		if (autoMessageList[Object.keys(autoMessageList)[ConfigManager['autoMessageKey']]] >= 0) {
			return true;
		}
		return false;
	};

	Window_Message.prototype.isAutoNext = function() {
		if (this.isAutoMessage()) {
			if (this._autoCount <= 0) {
				return true;
			}
			return false;
		}
		return false;
	};

})();
