/*=============================================================================
 * Luna Engine : Battle
 * By Archeia and Yami
 * Version: 1.0
 *
 * Open this in a text editor like Atom, Sublime Text or Notepad++
 * This version is made for the MV release and does not represent the 
 * final version of Luna Engine MV.
 *
 *=============================================================================*/
/*:
 * @plugindesc Open this in a text editor like Atom, Sublime Text or Notepad++
 * @author Archeia and Yami
 *
 * @help
 * Open this in a text editor like Atom, Sublime Text or Notepad++
 * This version is made for the MV release and is not the final version of Luna
 * Engine as a whole.
 *
 *----------------------------------------------------------------------------
 * Lunatic Mode: Conditions
 *----------------------------------------------------------------------------
 * We only list all custom conditions and relative conditions.
 *----------------------------------------------------------------------------
 *
 * this.isSelectingActor()
 *----------------------------------------------------------------------------
 * Return true when related actor with GUI element is being selected.
 *
 *----------------------------------------------------------------------------
 * this.isSelectingEnemy()
 *----------------------------------------------------------------------------
 * Return true when choosing enemy targets.
 *
 *----------------------------------------------------------------------------
 * this.isSelectingAction()
 *----------------------------------------------------------------------------
 * Return true when choosing skill or item.
 *
 *----------------------------------------------------------------------------
 * this.actor.isDead()
 *----------------------------------------------------------------------------
 * Return true if actor is dead.
 *
 *----------------------------------------------------------------------------
 * this.actor.hpRate() < X
 *----------------------------------------------------------------------------
 * Return true if actor hp rate is less than X. (X <= 1.0)
 *
 *----------------------------------------------------------------------------
 * this.actor.mpRate() < X
 *----------------------------------------------------------------------------
 * The same as above hpRate but for MP.
 *
 *----------------------------------------------------------------------------
 * this.actor.actorId() === X
 *----------------------------------------------------------------------------
 * Return true if actor ID is X.
 *
 *----------------------------------------------------------------------------
 * this.actor.currentClass().id === X
 *----------------------------------------------------------------------------
 * Return true if actor class ID is X.
 *
 *----------------------------------------------------------------------------
 * Lunatic Mode: Eval Properties
 *----------------------------------------------------------------------------
 *
 *----------------------------------------------------------------------------
 * this.actor.hp
 *----------------------------------------------------------------------------
 * Actor HP. Can be replaced for mp, tp.
 *
 *----------------------------------------------------------------------------
 * this.actor.mhp
 *----------------------------------------------------------------------------
 * Actor max HP. Can be replaced for mp, tp.
 *
 *----------------------------------------------------------------------------
 * this.actor.name()
 *----------------------------------------------------------------------------
 * Actor name.
 *
 *----------------------------------------------------------------------------
 * this.actor.stateIcons()
 *----------------------------------------------------------------------------
 * Get all state icons.
 *
 */
/*=============================================================================*/
/**
 * @namespace LunaEngine
 */

var LunaEngine = LunaEngine || {};

/**
 * @namespace Battle
 * @memberof LunaEngine
 */
LunaEngine.Battle = LunaEngine.Battle || {};
LunaEngine.Battle.Config = LunaEngine.Battle.Config || {};
/*=============================================================================*/
/* globals LunaEngine: false */
/*=============================================================================*/

/*=============================================================================*/
/*   Configuration Area!!!
/*=============================================================================*/
(function() {
 
 /*=============================================================================
 // Battle Status General Properties
 *=============================================================================
 * This is the main window of the Actor Battle Status as seen in battle. The area
 * where it displays the party's HP/MP/TP/Status/Faceset/Damage Values/etc.
 * When you move this around, you affect the entirety of the battle status.
 * This does not include Battle Command.
 =============================================================================*/
    var HUD = {
    /*-------------------------------
     * Position
     * X = Move the HUD Horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
     * Y = Move the HUD Vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
    -------------------------------*/
        x: 204,
        y: 460,

    /*-------------------------------
     * Grid and Size 
     * This will affect the size of the window that you see in battle.
     * Width = The width of the window.
     * Height = The height of the window.
     * Grid = How many party members are going to be visible in battle.
     * Direction = It can be either horizontal or vertical.
    -------------------------------*/
        width:  624,
        height: 180,
        grid:   4,
        direction: 'horizontal',

    /*-------------------------------
      * Others
      * This involves other properties that we added to the Battle Status for customization.
    -------------------------------*/

     /* showAnimation
     ------------------------------
        Set as true/false. If true, it will show animations on the actors. 
        If set to false, it will act like default RM.
     -------------------------------*/  
        showAnimation: false, // for non-sideview

     /* Background  
     ------------------------------
        This area is for adding a custom background your battle status.
        type = you can either write 'window' or 'image'

        If you select 'image'    
        ------------------------------
        Since images aren't exactly the same size as your default width and height for the status
        (the parameters you set above), you add offsets to them instead. Think of it as nudging
        the graphic a bit so it would place itself properly on your screen. This won't affect the
        overall placement of all the actor faceset/hp bars/etc.

        * offsetX = nudge the image horizontally. 
          You can use negative values (e.g. -10) or positive values (e.g. 10)
        * offsetY = nudge the image vertically tally. 
          You can use negative values (e.g. -10) or positive values (e.g. 10)
        * filename = the image you wanted to display. Make sure it's in img/system folder.
  
        If you select 'window'    
        ------------------------------
        * Width = The width of the window.
        * Height = The height of the window.
        * windowskin: You can set a different windowskin instead of the default 'Window' graphic. 
          Just make sure that the new Windowskin is in img/system folder. Put in the filename in
          the windowskin: 'filename here' area.
     -------------------------------*/  
        background: {
            type: 'image',
            offsetX: -12,
            offsetY: -12,

            window: {
                width: 648,
                height: 204,

                windowskin: 'Window'
            },

            image: {
                filename: '' // put into img/system
            }
        }
    };

 /*=============================================================================
 // Battle Status Elements
 *=============================================================================
 * This is the area where you can edit the following elements of Battle Status:
 * Name Display
 * Faceset Display
 * HP/MP/TP Numbers 
 * HP/MP/TP Gauges/Bars
 *
 * Aside from these elements, you can add conditional and eval properties that 
 * we included in the help section. This is also known as Lunatic Mode.
 =============================================================================*/
      var GUISprites = {
        spriteFace: {
    /*-------------------------------
      * GUIFace: Faceset
      * This section involves customizing the 'faceset' display of the actors.
      * X = Move the HUD Horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * Y = Move the HUD Vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * tone = RGBA (Red, Green, Blue, Sat) to add a color overlay on top of the faceset.
      * faceName = This is an advanced condition where you can change how it loads an actor image.
        Do not touch if you don't know programming or the basic syntaxes visible in RM.
      * faceIndex = This is an advanced condition where you can change how it loads an actor image's index.
      * A faceset usually has 8 faces in a sheet. From top left, it starts at 0. So think of it as:
        0 1 2 3 
        4 5 6 7
        Do not touch if you don't know programming or the basic syntaxes visible in RM.
    -------------------------------*/
            class: 'GUIFace',

            /* Position */
            x: 0,
            y: 0,

            /* Color */
            tone: [0,0,0,0],

            /* Basic Properties */
            faceName:  '{this.actor.faceName()}',
            faceIndex: '{this.actor.faceIndex()}',

    /*-------------------------------
      * Lunatic Mode: Conditional Properties
      * Refer to the Lunatic Conditions as seen in the header of this script.
      * This contain specific examples of how to use the Lunatic Mode conditions.
    -------------------------------*/
            conditional: [
                {
                    condition: 'this.actor.hpRate() < 0.5',
                     /* Change Actor Faceset Tone when HP is Less than 50%
                     ------------------------------
                    In this conditional's case based on 'properties' the image
                    will turn into a red tint.
                    -------------------------------*/  
                    properties: {
                        tone: [96,0,0,0]
                    }
                },

                {
                    condition: 'this.actor.isDead()',
                    /* Change Actor Faceset Tone when dead.
                     ------------------------------
                    In this conditional's case based on 'properties' the image
                    will turn grayscale.
                    -------------------------------*/  
                    properties: {
                        tone: [0,0,0,255]
                    }
                },

                {
                    condition: 'this.isSelectingActor()',
                    /* If an actor is selected...
                     ------------------------------
                    In this conditional's case based on 'properties' the image
                    it will turn the image slightly white when selected.
                    -------------------------------*/  
                    properties: {
                        tone: [64,64,64,0]
                    }
                },

                {
                    condition: 'this.isSelectingEnemy()',
                     /* If the player is selecting an enemy
                     ------------------------------
                    In this conditional's case based on 'properties' the image
                    will hide itself until you're done selecting an enemy.
                    -------------------------------*/  
                    properties: {
                        visible: false
                    }
                }
            ]
        }, // spriteFace

        spriteName: {
    /*-------------------------------
      * GUIText: Name
      * This section involves customizing the 'name' display of the actors.
      * X = Move the text horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * Y = Move the text vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * tone = RGBS (Red, Green, Blue, Sat) to set a color for the  'name' display
      * text = Choose what text to display. It can be an actor's name, class, items, etc. based on the syntax used.
        Do not touch unless you know programming or the basic syntaxes present in MV.
      * fontFace = the name of the font you want to use. GameFont refers to default.
      * fontSize = the size of the font used. 24 is the default number.
      * textColor = the color of the font. We use hexadecimal values in this case. For an easier reference check this link:
      (http://www.w3schools.com/w3css/w3css_color_palettes.asp) 
      * outlineColor = the font's outline color. This one uses RGBA (Red, Green, Blue, Alpha)
    -------------------------------*/
            class: 'GUIText',

            /* Position */
            x: 0,
            y: 0,

            /* Color */
            tone: [0,0,0,0],

            /* Basic Properties */
            text: '{this.actor.name()}',

            fontFace: 'GameFont',
            fontSize: '24',

            textColor: '#ffffff',
            outlineColor: 'rgba(0,0,0,0.5)',

    /*-------------------------------
      * Lunatic Mode: Conditional Properties
      * Refer to the Lunatic Conditions as seen in the header of this script.
      * This contain specific examples of how to use the Lunatic Mode conditions.
    -------------------------------*/
            conditional: [
                {
                    condition: 'this.actor.hpRate() < 0.5',
                    /* Change Actor Name Tone when HP is Less than 50%
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will turn into a tint based under crisisColor() in the default setting.
                    You can change this to a hexadecimal value. (e.g. textColor: '#ffffff')
                    -------------------------------*/  
                    properties: {
                        textColor: '{this.crisisColor()}'
                    }
                },

                {
                    condition: 'this.actor.isDead()',
                    /* Change Actor Name Tone when dead.
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will turn into a tint based under crisisColor() in the default setting.
                    You can change this to a hexadecimal value. (e.g. textColor: '#ffffff')
                    -------------------------------*/  
                    properties: {
                        textColor: '{this.deathColor()}'
                    }
                },

                {
                    condition: 'this.isSelectingEnemy()',
                    /* If the player is selecting an enemy
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will hide itself until you're done selecting an enemy.
                    -------------------------------*/  
                    properties: {
                        visible: false
                    }
                }
            ]
        }, // spriteName

        spriteHPGauge: {
    /*-------------------------------
      * GUIGauge: HP
      * This section involves customizing the HP 'gauge' or 'bar' display of the actors.
      * X = Move the Gauges Horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * Y = Move the Gauges Vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * tone = RGBS (Red, Green, Blue, Sat) to set a color for the HP Bar Display
      * Width = The width of the HP Bar.
      * Height = The height of the HP Bar.
      * rate = What is the source of value that the gauge is displaying. In this case the actor's HP Rate.
      * color1 = The first color
      * color2 = The second color that color1 will gradiate into.
      * backColor = The color of the 'back' of the gauge when you're taking damage. The default is black.
                    We use hexadecimal values in this case. For an easier reference check this link:
                    (http://www.w3schools.com/w3css/w3css_color_palettes.asp)
      * outlineColor = the bar's outline color. This one uses RGBA (Red, Green, Blue, Alpha)
      * direction = The direction of the bar. It could be 'horizontal' or 'vertical'
    -------------------------------*/
            class: 'GUIGauge',

            /* Position */
            x: 0,
            y: 100,

            /* Color */
            tone: [0,0,0,0],

            /* Basic Properties */
            width:  140,
            height: 6,

            rate: 'this.actor.hpRate()',

            color1: '{this.hpGaugeColor1()}',
            color2: '{this.hpGaugeColor2()}',

            backColor:    '#000000',
            outlineColor: 'rgba(0,0,0,0.5)',

            direction: 'horizontal',

    /*-------------------------------
      * Lunatic Mode: Conditional Properties
      * Refer to the Lunatic Conditions as seen in the header of this script.
      * This contain specific examples of how to use the Lunatic Mode conditions.
    -------------------------------*/
            conditional: [
                {
                    condition: 'this.isSelectingEnemy()',
                    /* If the player is selecting an enemy
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will hide itself until you're done selecting an enemy.
                    -------------------------------*/  
                    properties: {
                        visible: false
                    }
                }
            ]
        }, // spriteHPGauge

        spriteHPNumber: {
    /*-------------------------------
      * GUIText: HP Values
      * This section involves customizing the HP Values display of the actors.
      * X = Move the text horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * Y = Move the text vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * tone = RGBS (Red, Green, Blue, Sat) to set a color for the  HP Text display
      * text = Choose what text to display. It can be an actor's name, class, items, etc. based on the syntax used.
        In this one's case it will display as 'HP: 9999 / 9999' 
        Do not touch unless you know programming or the basic syntaxes present in MV.
      * fontFace = the name of the font you want to use. GameFont refers to default.
      * fontSize = the size of the font used. 24 is the default number.
      * textColor = the color of the font. We use hexadecimal values in this case. For an easier reference check this link:
      (http://www.w3schools.com/w3css/w3css_color_palettes.asp) 
      * outlineColor = the font's outline color. This one uses RGBA (Red, Green, Blue, Alpha)
    -------------------------------*/
            class: 'GUIText',

            /* Position */
            x: 0,
            y: 72,

            /* Color */
            tone: [0,0,0,0],

            /* Basic Properties */
            text: 'HP: {this.actor.hp} / {this.actor.mhp}',

            fontFace: 'GameFont',
            fontSize: '16',

            textColor: '#ffffff',
            outlineColor: 'rgba(0,0,0,0.5)',

    /*-------------------------------
      * Lunatic Mode: Conditional Properties
      * Refer to the Lunatic Conditions as seen in the header of this script.
      * This contain specific examples of how to use the Lunatic Mode conditions.
    -------------------------------*/
            conditional: [
                {
                    condition: 'this.isSelectingEnemy()',
                    /* If the player is selecting an enemy
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will hide itself until you're done selecting an enemy.
                    -------------------------------*/  
                    properties: {
                        visible: false
                    }
                }
            ]
        }, // spriteHPNumber

        spriteMPGauge: {
    /*-------------------------------
      * GUIGauge:MP
      * This section involves customizing the MP 'gauge' or 'bar' display of the actors.
      * X = Move the Gauges Horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * Y = Move the Gauges Vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * tone = RGBS (Red, Green, Blue, Sat) to set a color for the MP Bar Display
      * Width = The width of the MP Bar.
      * Height = The height of the MP Bar.
      * rate = What is the source of value that the gauge is displaying. In this case the actor's MP Rate.
      * color1 = The first color
      * color2 = The second color that color1 will gradiate into.
      * backColor = The color of the 'back' of the gauge when you're taking damage. The default is black.
                    We use hexadecimal values in this case. For an easier reference check this link:
                    (http://www.w3schools.com/w3css/w3css_color_palettes.asp)
      * outlineColor = the bar's outline color. This one uses RGBA (Red, Green, Blue, Alpha)
      * direction = The direction of the bar. It could be 'horizontal' or 'vertical'
    -------------------------------*/
            class: 'GUIGauge',

            /* Position */
            x: 0,
            y: 136,

            /* Color */
            tone: [0,0,0,0],

            /* Basic Properties */
            width:  140,
            height: 6,

            rate: 'this.actor.mpRate()',

            color1: '{this.mpGaugeColor1()}',
            color2: '{this.mpGaugeColor2()}',

            backColor:    '#000000',
            outlineColor: 'rgba(0,0,0,0.5)',

            direction: 'horizontal',

    /*-------------------------------
      * Lunatic Mode: Conditional Properties
      * Refer to the Lunatic Conditions as seen in the header of this script.
      * This contain specific examples of how to use the Lunatic Mode conditions.
    -------------------------------*/
            conditional: [
                {
                    condition: 'this.isSelectingEnemy()',
                    /* If the player is selecting an enemy
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will hide itself until you're done selecting an enemy.
                    -------------------------------*/  
                    properties: {
                        visible: false
                    }
                }
            ]
        }, // spriteHPGauge

        spriteMPNumber: {
    /*-------------------------------
      * GUIText: MP Values
      * This section involves customizing the MP Values display of the actors.
      * X = Move the text horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * Y = Move the text vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * tone = RGBS (Red, Green, Blue, Sat) to set a color for the  MP Text display
      * text = Choose what text to display. It can be an actor's name, class, items, etc. based on the syntax used.
        In this one's case it will display as 'MP: 999 / 999' 
        Do not touch unless you know programming or the basic syntaxes present in MV.
      * fontFace = the name of the font you want to use. GameFont refers to default.
      * fontSize = the size of the font used. 24 is the default number.
      * textColor = the color of the font. We use hexadecimal values in this case. For an easier reference check this link:
      (http://www.w3schools.com/w3css/w3css_color_palettes.asp) 
      * outlineColor = the font's outline color. This one uses RGBA (Red, Green, Blue, Alpha)
    -------------------------------*/
            class: 'GUIText',

            /* Position */
            x: 0,
            y: 108,

            /* Color */
            tone: [0,0,0,0],

            /* Basic Properties */
            text: 'MP: {this.actor.mp} / {this.actor.mmp}',

            fontFace: 'GameFont',
            fontSize: '16',

            textColor: '#ffffff',
            outlineColor: 'rgba(0,0,0,0.5)',

    /*-------------------------------
      * Lunatic Mode: Conditional Properties
      * Refer to the Lunatic Conditions as seen in the header of this script.
      * This contain specific examples of how to use the Lunatic Mode conditions.
    -------------------------------*/
            conditional: [
                {
                    condition: 'this.isSelectingEnemy()',
                    /* If the player is selecting an enemy
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will hide itself until you're done selecting an enemy.
                    -------------------------------*/  
                    properties: {
                        visible: false
                    }
                }
            ]
        }, // spriteMPNumber

        spriteStates: {
    /*-------------------------------
      * GUIIcons: State Display
      * This section involves customizing the State Display of the actors.
      * X = Move the State Display horizontally. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * Y = Move the State Display vertically. You can use Negative values (e.g. -50) to move it to the opposite direction.
      * tone = RGBS (Red, Green, Blue, Sat) to set a color for the  State Display
      * iconIds = References which IDs from what place to display. In this case the actor's states. 
                  Do not touch unless you know programming or the basic syntaxes present in MV.
      * maxIcons = How many icons to display at once. By default it's 3.
      * direction = The direction of the bar. It could be 'horizontal' or 'vertical'
    -------------------------------*/
            class: 'GUIIcons',

            /* Position */
            x: 0,
            y: 48,

            /* Color */
            tone: [0,0,0,0],

            /* Basic Properties */
            // iconIds eval won't need {}
            // can be one or many constant IDs: '[ID1, ID2]'
            iconIds: 'this.actor.stateIcons()',
            maxIcons: 3,
            direction: 'horizontal',

    /*-------------------------------
      * Lunatic Mode: Conditional Properties
      * Refer to the Lunatic Conditions as seen in the header of this script.
      * This contain specific examples of how to use the Lunatic Mode conditions.
    -------------------------------*/
            conditional: [
                {
                    condition: 'this.isSelectingEnemy()',
                    /* If the player is selecting an enemy
                     ------------------------------
                    In this conditional's case based on 'properties' the text
                    will hide itself until you're done selecting an enemy.
                    -------------------------------*/  
                    properties: {
                        visible: false
                    }
                }
            ]
        } // spriteStates
    };

    LunaEngine.Battle.Config.HUD = HUD;
    LunaEngine.Battle.Config.GUISprites = GUISprites;
}());