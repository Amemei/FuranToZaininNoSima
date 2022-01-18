//==============================================================================
// dsScreenLayoutSize.js
// Copyright (c) 2016 Douraku
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//==============================================================================

/*:
 * @plugindesc 画面サイズとレイアウトサイズを別に設定するプラグイン ver1.01
 * @author 道楽
 *
 * @param Map Layout Width
 * @desc マップ中の画面レイアウトの横幅
 * （0なら画面サイズと同じ大きさになります。）
 * @default 0
 *
 * @param Map Layout Height
 * @desc マップ中の画面レイアウトの縦幅
 * （0なら画面サイズと同じ大きさになります。）
 * @default 0
 *
 * @param Menu Layout Width
 * @desc メニュー中の画面レイアウトの横幅
 * （0なら画面サイズと同じ大きさになります。）
 * @default 0
 *
 * @param Menu Layout Height
 * @desc メニュー中の画面レイアウトの縦幅
 * （0なら画面サイズと同じ大きさになります。）
 * @default 0
 *
 * @param Battle Layout Width
 * @desc 戦闘中の画面レイアウトの横幅
 * （0なら画面サイズと同じ大きさになります。）
 * @default 0
 *
 * @param Battle Layout Height
 * @desc 戦闘中の画面レイアウトの縦幅
 * （0なら画面サイズと同じ大きさになります。）
 * @default 0
 */

var Imported = Imported || {};
Imported.dsScreenLayoutSize = true;

var dsScreenLayoutSize = {};

(function(ns) {

	ns.Param = (function() {
		var ret = {};
		var parameters = PluginManager.parameters('dsScreenLayoutSize');
		ret.defaultBoxWidth = 816;
		ret.defaultBoxHeight = 624;
		ret.mapLayoutWidth = Number(parameters['Map Layout Width'] || 0);
		ret.mapLayoutHeight = Number(parameters['Map Layout Height'] || 0);
		ret.battleLayoutWidth = Number(parameters['Battle Layout Width'] || 0);
		ret.battleLayoutHeight = Number(parameters['Battle Layout Height'] || 0);
		ret.menuLayoutWidth = Number(parameters['Menu Layout Width'] || 0);
		ret.menuLayoutHeight = Number(parameters['Menu Layout Height'] || 0);
		return ret;
	})();


	//-------------------------------------------------------------------------
	/** Sprite_Actor */
	var _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
	Sprite_Actor.prototype.setActorHome = function(index)
	{
		_Sprite_Actor_setActorHome.call(this, index);
		if ( !eval(Yanfly.Param.ReposBattlers) )
		{
			this._homeX += Graphics.boxWidth - ns.Param.defaultBoxWidth;
			this._homeY += Graphics.boxHeight - ns.Param.defaultBoxHeight;
		}
		this._homeX += (Graphics.width - Graphics.boxWidth) / 2;
		this._homeY += (Graphics.height - Graphics.boxHeight) / 2;
	};

	//-------------------------------------------------------------------------
	/** Sprite_Enemy */
	var _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
	Sprite_Enemy.prototype.setBattler = function(battler)
	{
		_Sprite_Enemy_setBattler.call(this, battler);
		if ( !eval(Yanfly.Param.ReposBattlers) )
		{
			if ( !$gameSystem.isSideView() )
			{
				if ( !this._enemy._alteredScreenX )
				{
					this._homeX += (Graphics.boxWidth - ns.Param.defaultBoxWidth) / 2;
					this._enemy._screenX = this._homeX;
					this._enemy._alteredScreenX = true;
				}
			}
			if ( !this._enemy._alteredScreenY )
			{
				this._homeY += Graphics.boxHeight - ns.Param.defaultBoxHeight;
				this._enemy._screenY = this._homeY;
				this._enemy._alteredScreenY = true;
			}
		}
		if ( !$gameSystem.isSideView() )
		{
			this._homeX += (Graphics.width - Graphics.boxWidth) / 2;
		}
		this._homeY += (Graphics.height - Graphics.boxHeight) / 2;
	};

	//-------------------------------------------------------------------------
	/** Spriteset_Base */
	Spriteset_Base.prototype.createPictures = function()
	{
		var width = Graphics.width;
		var height = Graphics.height;
		var x = (Graphics.width - width) / 2;
		var y = (Graphics.height - height) / 2;
		this._pictureContainer = new Sprite();
		this._pictureContainer.setFrame(x, y, width, height);
		for ( var ii = 1; ii <= $gameScreen.maxPictures(); ii++ )
		{
			this._pictureContainer.addChild(new Sprite_Picture(ii));
		}
		this.addChild(this._pictureContainer);
	};

	//-------------------------------------------------------------------------
	/** Spriteset_Battle */
	Spriteset_Battle.prototype.createBattleField = function()
	{
		var width = Graphics.width;
		var height = Graphics.height;
		var x = (Graphics.width - width) / 2;
		var y = (Graphics.height - height) / 2;
		this._battleField = new Sprite();
		this._battleField.setFrame(x, y, width, height);
		this._battleField.x = x;
		this._battleField.y = y;
		this._baseSprite.addChild(this._battleField);
	};

	Spriteset_Battle.prototype.rescaleBattlebackSprite = function(sprite)
	{
		if ( sprite.bitmap.width > 0 || sprite.bitmap.height > 0 )
		{
			var width = Graphics.width;
			var height = Graphics.height;
			var ratioX = width / sprite.bitmap.width;
			var ratioY = height / sprite.bitmap.height;
			if ( ratioX > 1.0 )
			{
				sprite.scale.x = ratioX;
				sprite.anchor.x = 0.5;
				sprite.x = width / 2;
			}
			if ( ratioY > 1.0 )
			{
				sprite.scale.y = ratioY;
				sprite.origin.y = 0;
				sprite.y = 0;
			}
		}
	};

	//-------------------------------------------------------------------------
	/** Scene_Base */
	var _Scene_Base_initialize = Scene_Base.prototype.initialize;
	Scene_Base.prototype.initialize = function()
	{
		this.initGraphicsBoxSize();
		_Scene_Base_initialize.call(this);
	};

	Scene_Base.prototype.initGraphicsBoxSize = function()
	{
		Graphics.boxWidth  = Graphics.width;
		Graphics.boxHeight = Graphics.height;
	};

	//-------------------------------------------------------------------------
	/** Scene_Boot */
	Scene_Boot.prototype.initGraphicsBoxSize = function()
	{
	};

	//-------------------------------------------------------------------------
	/** Scene_Map */
	Scene_Map.prototype.initGraphicsBoxSize = function()
	{
		var boxWidth  = (ns.Param.mapLayoutWidth  > 0) ? ns.Param.mapLayoutWidth  : Graphics.width;
		var boxHeight = (ns.Param.mapLayoutHeight > 0) ? ns.Param.mapLayoutHeight : Graphics.height;
		Graphics.boxWidth  = boxWidth;
		Graphics.boxHeight = boxHeight;
	};

	//-------------------------------------------------------------------------
	/** Scene_MenuBase */
	Scene_MenuBase.prototype.initGraphicsBoxSize = function()
	{
		var boxWidth  = (ns.Param.menuLayoutWidth  > 0) ? ns.Param.menuLayoutWidth  : Graphics.width;
		var boxHeight = (ns.Param.menuLayoutHeight > 0) ? ns.Param.menuLayoutHeight : Graphics.height;
		Graphics.boxWidth  = boxWidth;
		Graphics.boxHeight = boxHeight;
	};

	//-------------------------------------------------------------------------
	/** Scene_Battle */
	Scene_Battle.prototype.initGraphicsBoxSize = function()
	{
		var boxWidth  = (ns.Param.battleLayoutWidth  > 0) ? ns.Param.battleLayoutWidth  : Graphics.width;
		var boxHeight = (ns.Param.battleLayoutHeight > 0) ? ns.Param.battleLayoutHeight : Graphics.height;
		Graphics.boxWidth  = boxWidth;
		Graphics.boxHeight = boxHeight;
	};

})(dsScreenLayoutSize);

