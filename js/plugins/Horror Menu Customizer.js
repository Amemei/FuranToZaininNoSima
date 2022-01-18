// ------------------------------------------------------------
// Horror Menu Customizer.js
// ------------------------------------------------------------
/*:
* @plugindesc v1.5 A menu customizer for developers of Horror RPG Maker made games.
* @author Soulpour777
*
* @help
* Q: I want to show my items, where are they now?
* A: You should make your items a Key Item, for you to show them.
* @param WindowXAxis
* @desc X axis location of the window.
* @default 308
*
* @param ScrollSpeed
* @desc How fast the sliding animation will go.
* @default 50
*
* @param UpperDistance
* @desc Original y axis of the menu at the start.
* @default -400
*
* @param ItemName
* @desc The item command name on menu.
* @default Item
*
* @param LoadName
* @desc The load command name on menu.
* @default Load
*
* @param SaveName
* @desc The save command name on menu.
* @default Save
*
* @param EndName
* @desc The end command name on menu.
* @default Quit
*
* @param OptionName
* @desc The option command name on menu.
* @default Option
*
* @param ToTitleName
* @desc The title command name on menu.
* @default To Title Screen
*
* @param CancelName
* @desc The cancel command name on menu.
* @default Cancel
*
* @param MenuOpacity
* @desc The opacity of the Menu.
* @default 255
*
* @param KeyItemNumberDisplay
* @desc Display the key item number.
* 0:not display, 1:always display, 2:display only plural items
* @default 0
* 
* @param MessageWindowDisplayNumber
* @desc Display the number at message window.
* 0:not display, 1:always display, 2:display only plural items
* @default 0
*
*/
(function(){
    
	var Imported = Imported || {};
	Imported.HorrorMenu = true;
	var Soulpour777 = Soulpour777 || {};
	Soulpour777.HorrorMenu = {};
	Soulpour777.HorrorMenu.params = PluginManager.parameters('Horror Menu Customizer'); 
    Soulpour777.HorrorMenu.scrollSpeed = Number(Soulpour777.HorrorMenu.params['ScrollSpeed'] || 50);
    Soulpour777.HorrorMenu.opacityValue = Number(Soulpour777.HorrorMenu.params['MenuOpacity'] || 255);
    Soulpour777.HorrorMenu.upperDistance = Number(Soulpour777.HorrorMenu.params['UpperDistance'] || -400);
    Soulpour777.HorrorMenu.windowXAxis = Number(Soulpour777.HorrorMenu.params['WindowXAxis'] || 308);
    Soulpour777.HorrorMenu.itemName = String(Soulpour777.HorrorMenu.params['ItemName'] || "Item");
    Soulpour777.HorrorMenu.loadName = String(Soulpour777.HorrorMenu.params['LoadName'] || "Load");
    Soulpour777.HorrorMenu.saveName = String(Soulpour777.HorrorMenu.params['SaveName'] || "Save");
    Soulpour777.HorrorMenu.endName = String(Soulpour777.HorrorMenu.params['EndName'] || "Quit");
    Soulpour777.HorrorMenu.toTitleName = String(Soulpour777.HorrorMenu.params['ToTitleName'] || "To Title Screen");
    Soulpour777.HorrorMenu.cancelName = String(Soulpour777.HorrorMenu.params['CancelName'] || "Cancel");
    Soulpour777.HorrorMenu.optionName = String(Soulpour777.HorrorMenu.params['OptionName'] || "Options");
    Soulpour777.HorrorMenu.atKeyItem = Number(Soulpour777.HorrorMenu.params['KeyItemNumberDisplay'] || 0); 
    Soulpour777.HorrorMenu.atMsgWnd = Number(Soulpour777.HorrorMenu.params['MessageWindowDisplayNumber'] || 0); 
    
    Window_GameEnd.prototype.makeCommandList = function() {
        this.addCommand(Soulpour777.HorrorMenu.toTitleName, 'toTitle');
        this.addCommand(Soulpour777.HorrorMenu.cancelName,  'cancel');
    };
    
    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addMainCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addLoadCommand();
        this.addGameEndCommand();
    };

    Window_MenuCommand.prototype.addMainCommands = function() {
        var enabled = this.areMainCommandsEnabled();
        if (this.needsCommand('item')) {
            this.addCommand(Soulpour777.HorrorMenu.itemName, 'item', enabled);
        }
    };

    Window_MenuCommand.prototype.addGameEndCommand = function() {
        var enabled = this.isGameEndEnabled();
        this.addCommand(Soulpour777.HorrorMenu.endName, 'gameEnd', enabled);
    };
    
    
    Window_MenuCommand.prototype.addLoadCommand = function() {
            this.addCommand(Soulpour777.HorrorMenu.loadName, 'load', true);
    };
    
    Window_MenuCommand.prototype.addOptionsCommand = function() {
        if (this.needsCommand('options')) {
            var enabled = this.isOptionsEnabled();
            this.addCommand(Soulpour777.HorrorMenu.optionName, 'options', enabled);
        }
    };

    Window_MenuCommand.prototype.addSaveCommand = function() {
        if (this.needsCommand('save')) {
            var enabled = this.isSaveEnabled();
            this.addCommand(Soulpour777.HorrorMenu.saveName, 'save', enabled);
        }
    };    

    Scene_Menu.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_MenuCommand(0, 0);
        this._commandWindow.x = Soulpour777.HorrorMenu.windowXAxis;
        this._commandWindow.y = Soulpour777.HorrorMenu.upperDistance;
        this._commandWindow.opacity = Soulpour777.HorrorMenu.opacityValue;
        this._commandWindow.setHandler('item',      this.commandItem.bind(this));
        this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
        this._commandWindow.setHandler('save',      this.commandSave.bind(this));
        this._commandWindow.setHandler('load',      this.commandLoad.bind(this));
        this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
        this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Menu.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (this._commandWindow.y != Graphics.height / 2 - 100) {
            if (this._commandWindow.y >= Graphics.height / 2 - 100) {
                this._commandWindow.y = Graphics.height / 2 - 100;
            } else {
                this._commandWindow.y += Soulpour777.HorrorMenu.scrollSpeed;
            }
        }

    }

    Scene_Menu.prototype.terminate = function() {

        if (this._commandWindow.y != Soulpour777.HorrorMenu.upperDistance) {
            if (this._commandWindow.y <= Soulpour777.HorrorMenu.upperDistance) {
                this._commandWindow.y = Soulpour777.HorrorMenu.upperDistance;
            } else {
                this._commandWindow.y -= Soulpour777.HorrorMenu.scrollSpeed;
                Scene_MenuBase.prototype.terminate.call(this);
            }
        }  
    }

    Scene_Menu.prototype.commandLoad = function() {
        SceneManager.push(Scene_Load);
    }

    Scene_Menu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
    };

    
    Scene_Menu.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
    };
    
  Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
    this.createActorWindow();
  };

  Scene_Item.prototype.createItemWindow = function() {
    var wy = this._helpWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._itemWindow);
    this._itemWindow.setCategory('keyItem');
    this.onCategoryOk();
  };
    
    
  var soul_horrorMenuCustomizer_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    soul_horrorMenuCustomizer_initialize.call(this);
    this.initKeyNumber();
  };

  Game_System.prototype.initKeyNumber = function() {
    this._keyItemNumber = [null, null, null, null, null];
  };

  Game_System.prototype.keyItemNumber = function() {
    if(!this._keyItemNumber){
      this.initKeyNumber();
    };
    return this._keyItemNumber;
  };    
    
  var soul_horrorMenuCustomizer_nnedsNumber = Window_ItemList.prototype.needsNumber;
  Window_ItemList.prototype.needsNumber = function() {
    var original = soul_horrorMenuCustomizer_nnedsNumber.call(this);
    if(this._category !== 'keyItem') {
      return original;
    }
    return Soulpour777.HorrorMenu.atKeyItem != 0;
  };
    
  
  Window_EventItem.prototype.currentDispMode = function() {
    var itype = $gameMessage.itemChoiceItypeId();
    return Number($gameSystem.keyItemNumber()[itype] || Soulpour777.HorrorMenu.atMsgWnd); 
  };

  Window_EventItem.prototype.needsNumber = function() {
    return this.currentDispMode() != 0;
  };

  var soul_horrorMenuCustomizer = Window_ItemList.prototype.drawItemNumber;
  Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    var isEvent = (this instanceof Window_EventItem);
    var status = isEvent ? this.currentDispMode() : Soulpour777.HorrorMenu.atKeyItem;
    if((this._category == 'keyItem' || isEvent) &&
     status == 2 && $gameParty.numItems(item) <= 1) {
      return; 
    }
    soul_horrorMenuCustomizer.call(this, item, x, y, width);
  };    
    
})();