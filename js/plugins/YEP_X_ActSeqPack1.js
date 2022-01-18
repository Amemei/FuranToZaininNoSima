//=============================================================================
// Yanfly Engine Plugins - Battle Engine Extension - Action Sequence Pack 1
// YEP_X_ActSeqPack1.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_X_ActSeqPack1 = true;

var Yanfly = Yanfly || {};
Yanfly.ASP1 = Yanfly.ASP1 || {};

//=============================================================================
 /*:
 * @plugindesc v1.03 (Requires YEP_BattleEngineCore.js) Basic functions are
 * added to the Battle Engine Core's action sequences.
 * @author Yanfly Engine Plugins
 *
 * @param Default Volume
 * @desc This will be the volume of the BGM played.
 * @default 90
 *
 * @param Default Pitch
 * @desc This will be the pitch of the BGM played.
 * @default 100
 *
 * @param Default Pan
 * @desc This will be the pan of the BGM played.
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Action Sequence Pack 1 plugin is an extension plugin for Yanfly Engine
 * Plugins' Battle Engine Core. This extension plugin will not work without the
 * main plugin.
 *
 * This extension plugin contains the more basic functions used for customized
 * action sequences on a technical scale. Here, you are able to change switches,
 * operate variables, add states, change damage rates, and more.
 *
 * ============================================================================
 * Action Sequences - ala Melody
 * ============================================================================
 *
 * Battle Engine Core includes Yanfly Engine Melody's Battle Engine system,
 * where each individual aspect of the skill and item effects can be controlled
 * to a degree. These are called Action Sequences, where each command in the
 * action sequence causes the game to perform a distinct individual action.
 *
 * Each skill and item consists of five different action sequences. They are as
 * follows:
 *
 * 1. Setup Actions
 *   They prepare the active battler before carrying out the bulk of the action
 * and its individual effects. Usually what you see here are things such as the
 * active battler moving forward a bit, unsheathing their weapon, etc. This step
 * will occur before the active battler expends their skill or item costs.
 *
 * 2. Whole Actions
 *   These actions will affect all of the targets simultaneously. Although this
 * section does not need to be used, most actions will use this for displaying
 * animations upon all enemies. This step occurs after skill and item costs.
 *
 * 3. Target Actions
 *   This section will affect all of the targets individually. Used primarily
 * for physical attacks that will deliver more personal forms of damage. Actions
 * that occur here will not affect other targets unless specifically ordered to
 * do so otherwise.
 *
 * 4. Follow Actions
 *   This section will dedicate towards cleanup work after the individual
 * targeting actions. Here, it'll do things such as removing immortal flags,
 * start up common events, and more.
 *
 * 5. Finish Actions
 *   This section will have the active battler close up the action sequence.
 * Usually stuff like running waits and holds at the last minute for skills and
 * items, moving back to place, and others.
 *
 * Now that you know each of the five steps each action sequence goes through,
 * here's the tags you can insert inside of skills and items. Pay attention to
 * each tag name.
 *
 * 1. <setup action>                                5. <finish action>
 *     action list                                      action list
 *     action list                                      action list
 *    </setup action>                                  </finish action>
 *
 * 2. <whole action>       3. <target action>       4. <follow action>
 *     action list             action list              action list
 *     action list             action list              action list
 *    </whole action>         </target action>         </follow action>
 *
 * They will do their own respective action sets. The methods to insert for the
 * action list can be found below in the core of the Help Manual.
 *
 * Furthermore, to prevent overflooding every single one of your database item's
 * noteboxes with action sequence lists, there's a shortcut you can take to copy
 * all of the setup actions, whole actions, target actions, follow actions, and
 * finish actions with just one line.
 *
 * <action copy: x:y>
 *
 * Replace x with "item" or "skill" to set the type for the action list code to
 * directly copy. The integer y is then the ID assigned for that particular
 * object type. For example, to copy 45th skill's action sequences, the code
 * would be <action copy: skill:45> for anything that will accept these action
 * codes. If you do use this notetag, it will take priority over any custom
 * that you've placed in the notebox.
 *
 * ============================================================================
 * Target Typing
 * ============================================================================
 *
 * You may notice that in some of the actions below will say "refer to target
 * typing" which is this section right here. Here's a quick run down on the
 * various targets you may select.
 *
 *   user; This will select the active battler.
 *   target, targets; These will select the active targets in question.
 *   actors, existing actors; These will select all living actors.
 *   all actors; This will select all actors including dead ones.
 *   dead actors: This will select only dead actors.
 *   actors not user; This will select all living actors except for the user.
 *   actor x; This will select the actor in slot x.
 *   enemies, existing enemies; This will select all living enemies.
 *   all enemies; This will select all enemies, even dead.
 *   dead enemies: This will select only dead enemies.
 *   enemies not user; This will select all enemies except for the user.
 *   enemy x; This will select the enemy in slot x.
 *   friends; This will select the battler's alive allies.
 *   all friends; This will select the all of battler's allies, even dead.
 *   dead friends; This will select the battler's dead allies.
 *   friends not user; This will select the battler's allies except itself.
 *   friend x: This will select the battler's ally in slot x.
 *   opponents; This will select the battler's alive opponents.
 *   all opponents; This will select the all of the battler's opponents.
 *   dead opponents; This will select the battler's dead opponents.
 *   opponent x: This will select the battler's opponent in slot x.
 *   all alive; Selects all living actors and enemies.
 *   all members; Selects all living and dead actors and enemies.
 *   all dead; Selects all dead actors and enemies.
 *   all not user; This will select all living battlers except user.
 *   focus; Selects the active battler and its targets.
 *   not focus; Selects everything but the active battler and its targets.
 *
 * ============================================================================
 * Action Sequences - Action List
 * ============================================================================
 *
 * The following contains a list of the actions you can use inside the five
 * action sequences. Each action has a unique function and requires certain
 * formats to operate properly.
 *
 *=============================================================================
 * ACTION ANIMATION: (target), (mirror)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Plays the animation assigned to the skill/item. The animation will
 * automatically select the skill's/item's assigned targets. If 'target' is
 * used, it will specify a target to play the animation on. If 'mirror' is
 * used, it will mirror the animation.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: action animation
 *                action animation: target
 *                action animation: user, mirror
 *=============================================================================
 *
 *=============================================================================
 * ACTION COMMON EVENT
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Plays the common event found within the skill's/item's traits list. This
 * will only play the last common event on the list, following the game
 * engine's original process. Nothing else will continue on the action list
 * until the common event is finished.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: action common event
 *=============================================================================
 *
 *=============================================================================
 * ACTION EFFECT: target
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes the target(s) to take damage/healing from the skill/item and
 * incurs any changes made to the target(s) such as buffs and states.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: action effect
 *=============================================================================
 *
 *=============================================================================
 * ADD stat BUFF: target, (turns), (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Affects the target with 'stat' buff. Replace 'stat' with 'hp', 'mp', 'atk',
 * 'def', 'mat', 'mdf', 'agi', or 'luk'. If you include a number after the
 * target, it will buff the target by that many turns. Include 'show' and it
 * will show the target getting the buff applied in the battle log.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: add atk buff: user, 3, show
 *                add def buff: target, 8
 *=============================================================================
 *
 *=============================================================================
 * ADD stat DEBUFF: target, (turns), (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Affects the target with 'stat' debuff. Replace 'stat' with 'hp', 'mp',
 * 'atk', 'def', 'mat', 'mdf', 'agi', or 'luk'. If you include a number after
 * the target, it will debuff the target by that many turns. Include 'show' and
 * it will show the target getting the debuff applied in the battle log.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: add atk debuff: user, 3, show
 *                add def debuff: target, 8
 *=============================================================================
 *
 *=============================================================================
 * ADD STATE X: target, (show)
 * ADD STATE X, Y, Z: target (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Affects the target with X state (including Y and Z if used in that format).
 * If 'show' is included, it will display any state related messages.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: add state 5: target
 *                add state 6, 7, 8: user, show
 *=============================================================================
 *
 *=============================================================================
 * ANIMATION X: target, (mirror)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Plays animation X on target. 'Mirror' will cause the animation to appear
 * mirrored. Keep in mind that animations played on actors will automatically
 * be mirrored and setting the mirror option will reverse it and have it appear
 * unmirrored.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: animation 5: user
 *                animation 6: target, mirror
 *=============================================================================
 *
 *=============================================================================
 * ANIMATION WAIT: X
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Waits x animaiton frames. Each frame for an animation does not last one game
 * frame, but instead, several. To make life easier, you can use this to have
 * the game wait x frames played for the animation.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: animation 5: user
 *                animation 6: target, mirror
 *=============================================================================
 *
 *=============================================================================
 * BGM: STOP
 * BGM: MEMORIZE
 * BGM: MEMORY
 * BGM: filename, (volume), (pitch), (pan)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Changes the current background music at hand. 'Stop' will stop any BGM from
 * playing. 'Memorize' will memorize the current BGM. 'Memory' will replay the
 * memorized BGM if there is one playing. If you choose a filename (without the
 * filename extensions), the game will play that BGM instead. Using this
 * option opens up access to the volume, pitch, and pan control, all of which
 * are optional to use. If no values are inputed for volume, pitch, and pan,
 * the game will use the settings in this plugin's parameters.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: bgm: stop
 *                bgm: memorize
 *                bgm: memory
 *                bgm: Battle7
 *                bgm: Theme2, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * BGS: STOP
 * BGS: MEMORIZE
 * BGS: MEMORY
 * BGS: filename, (volume), (pitch), (pan)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Changes the current background sound at hand. 'Stop' will stop any BGS from
 * playing. 'Memorize' will memorize the current BGS. 'Memory' will replay the
 * memorized BGS if there is one playing. If you choose a filename (without the
 * filename extensions), the game will play that BGS instead. Using this
 * option opens up access to the volume, pitch, and pan control, all of which
 * are optional to use. If no values are inputed for volume, pitch, and pan,
 * the game will use the settings in this plugin's parameters.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: bgs: stop
 *                bgs: memorize
 *                bgs: memory
 *                bgs: City
 *                bgs: Darkness, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * CAST ANIMATION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Plays an animation on the skill's user. Will not occur if the action is
 * an item or the user's default normal attack.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: cast animation
 *=============================================================================
 *
 *=============================================================================
 * CLEAR BATTLE LOG
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Clears all the messages at the top of the screen.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: clear battle log
 *=============================================================================
 *
 *=============================================================================
 * CHANGE SWITCH X: on/off/toggle/switch z
 * CHANGE SWITCH X..Y: on/off/toggle/switch z
 * CHANGE SWITCH X TO Y: on/off/toggle/switch z
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Changes Game Switch X to on, off, toggle (switching between on/off), or
 * to whatever value the switch y is.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: change switch 1: on
 *                change switch 2..4: off
 *                change switch 5 to 8: toggle
 *                change switch 9: switch 5
 *=============================================================================
 *
 *=============================================================================
 * CHANGE VARIABLE X = Y
 * CHANGE VARIABLE X += Y
 * CHANGE VARIABLE X -= Y
 * CHANGE VARIABLE X *= Y
 * CHANGE VARIABLE X /= Y
 * CHANGE VARIABLE X %= Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Changes variable X in the middle of the action sequence to be modified
 * by value Y. Y can be either an integer or a piece of code.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: change variable 1 = 2
 *                change variable 3 += 4
 *                change variable 5 -= 6
 *                change variable 7 *= 8
 *                change variable 9 /= 10
 *                change variable 11 %= 12
 *=============================================================================
 *
 *=============================================================================
 * COLLAPSE: target, (force)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * If the target is to be dead at this point, this will be the point in the
 * action sequence where you can promt the game to kill the target as long
 * as the target has 0 HP. If you want to force the death of the target,
 * include the 'force' command after the targets.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: collapse: user
 *                collapse: target, force
 *=============================================================================
 *
 *=============================================================================
 * COMMON EVENT: X
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Plays common event X at that point in the action sequence. Nothing else
 * will continue until the common event is finished.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: common event: 1
 *=============================================================================
 *
 *=============================================================================
 * DEATH BREAK
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * If a user were to die for any reason during the middle of the skill
 * (either via counter attack or reflection), this will force the remainder
 * of the action sequences for the part of the skill/item to shut down and
 * be skipped.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: death break
 *=============================================================================
 *
 *=============================================================================
 * DISPLAY ACTION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Displays the action's name at the top of the battle log. It will remain
 * there until the battle log is cleared.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: display action
 *=============================================================================
 *
 *=============================================================================
 * EVAL: code
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * For those who'd like to do something that the current Battle Engine doesn't
 * support, you can use an eval function to have a piece of code occur. Users
 * beware, for those unfamiliar with JavaScript should avoid handling this
 * action sequence command.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: eval: $gameParty.loseItem($dataItems[3], 10)
 *=============================================================================
 *
 *=============================================================================
 * GAIN ITEM X: Y           LOSE ITEM X: Y
 * GAIN WEAPON X: Y         LOSE WEAPON X: Y
 * GAIN ARMOR X: Y          LOSE ARMOR X: Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Your party will gain/lose item x, weapon x, or armor x in the amount of
 * y. If you choose to omit y, it will default to 1.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: gain item 1: 20
 *                lose weapon 2
 *                gain armor 3: 50
 *=============================================================================
 *
 *=============================================================================
 * GOLD +x
 * GOLD -x
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Your party will gain/lose gold in the middle of battle by x amount.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: gold +2000
 *                gold -500
 *=============================================================================
 *
 *=============================================================================
 * IF ... ELSE STATEMENTS
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * For those familiar with programming, you can use if...else statements to
 * perform different actions based on different conditions. Use 'if' to
 * specify a block of code to be executed, if a specified condition is true.
 * Use 'else'  to specify a block of code to be executed, if the same
 * condition is false. Use 'else if' to specify a new condition to test, if
 * the first condition is false. Use 'end' to specify where the conditions
 * are to end.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example:
 *     if $gameSwitches.value(1)
 *         action effect
 *     else if $gameSwitches.value(2)
 *         action effect
 *         action effect
 *     else
 *         action effect
 *         action effect
 *         action effect
 *     end
 *
 * *Note: You do not have to indent the code in between to work. It just
 * looks better that way in your action sequences.
 *=============================================================================
 *
 *=============================================================================
 * IMMORTAL: targets, true/false
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Sets the targets to a state of immortality so that they don't die in the
 * middle of an attack. This is to ensure every action effect goes through.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: immortal: targets true
 *=============================================================================
 *
 *=============================================================================
 * HP +X: target, (show)
 * HP -X: target, (show)
 * HP +X%: target, (show)
 * HP -X%: target, (show)
 * HP +VARIABLE X: target, (show)
 * HP -VARIABLE X: target, (show)
 * HP +VARIABLE X%: target, (show)
 * HP -VARIABLE X%: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Target(s) gains HP equal to X values. To show the popup, insert 'show'
 * after the target in the action sequence line. Including 'show' is
 * entirely optional. If 'show' is omitted, no popup will be displayed.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: hp +500: user
 *                hp -variable 5: target
 *                hp +25%: target
 *                hp -variable 7: user
 *=============================================================================
 *
 *=============================================================================
 * ME: STOP
 * ME: filename, (volume), (pitch), (pan)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes the battle to play a music fanfare. 'Stop' will stop any ME from
 * playing. If you choose a filename (without the filename extensions), the
 * game will play that ME instead. Using this option opens up access to the
 * volume, pitch, and pan control, all of which are optional to use. If no
 * values are inputed for volume, pitch, and pan, the game will use the
 * settings in this plugin's parameters.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: me: stop
 *                me: Victory1
 *                me: Darkness, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * MOTION WAIT: target
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Makes the game wait 12 frames if the target(s) performing the action is an
 * actor. If the target(s) is not an actor, no waiting will be done.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: motion wait: user
 *=============================================================================
 *
 *=============================================================================
 * MP +X: target, (show)
 * MP -X: target, (show)
 * MP +X%: target, (show)
 * MP -X%: target, (show)
 * MP +VARIABLE X: target, (show)
 * MP -VARIABLE X: target, (show)
 * MP +VARIABLE X%: target, (show)
 * MP -VARIABLE X%: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Target(s) gains MP equal to X values. To show the popup, insert 'show'
 * after the target in the action sequence line. Including 'show' is
 * entirely optional. If 'show' is omitted, no popup will be displayed.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: mp +500: user
 *                mp -variable 5: target
 *                mp +25%: target
 *                mp -variable 7: user
 *=============================================================================
 *
 *=============================================================================
 * PERFORM ACTION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes actors to step forward and swing their weapon, thrust it, however
 * the motion that is determined will be automatically done by the game.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: perform action
 *=============================================================================
 *
 *=============================================================================
 * PERFORM FINISH
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes actor to move back to its home spot.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: perform finish
 *=============================================================================
 *
 *=============================================================================
 * PERFORM START
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes actor to move forward from its home spot.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: perform start
 *=============================================================================
 *
 *=============================================================================
 * REFRESH STATUS
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Refreshes the status window in the middle of an action sequence.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: refresh status
 *=============================================================================
 *
 *=============================================================================
 * REMOVE stat BUFF: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Removes the 'stat' buff from target. Replace 'stat' with 'hp', 'mp', 'atk',
 * 'def', 'mat', 'mdf', 'agi', or 'luk'. Include 'show' and it  will show the
 * target getting the buff removed in the battle log.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: remove atk buff: user, show
 *                remove def buff: target
 *=============================================================================
 *
 *=============================================================================
 * REMOVE stat DEBUFF: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Removes the 'stat' debuff from target. Replace 'stat' with 'hp', 'mp',
 * 'atk', 'def', 'mat', 'mdf', 'agi', or 'luk'. Include 'show' and it  will
 * show the target getting the debuff removed in the battle log.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: remove atk debuff: user, show
 *                remove def debuff: target
 *=============================================================================
 *
 *=============================================================================
 * REMOVE STATE X: target (show)
 * REMOVE STATE X, Y, Z: target (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Removes X state (including Y and Z if used in that format) from target.
 * If 'show' is included, it will display any state related messages.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: remove state 5: target
 *                remove state 6, 7, 8: user, show
 *=============================================================================
 *
 *=============================================================================
 * SE: filename, (volume), (pitch), (pan)
 * SE: PLAY OK
 * SE: PLAY CURSOR
 * SE: PLAY CANCEL
 * SE: PLAY BUZZER
 * SE: PLAY EQUIP
 * SE: PLAY SAVE
 * SE: PLAY LOAD
 * SE: PLAY BATTLE START
 * SE: PLAY ESCAPE
 * SE: PLAY ENEMY ATTACK
 * SE: PLAY ENEMY DAMAGE
 * SE: PLAY ENEMY COLLAPSE
 * SE: PLAY BOSS COLLAPSE 1
 * SE: PLAY BOSS COLLAPSE 2
 * SE: PLAY ACTOR DAMAGE
 * SE: PLAY ACTOR COLLAPSE
 * SE: PLAY RECOVERY
 * SE: PLAY MISS
 * SE: PLAY EVASION
 * SE: PLAY MAGIC EVASION
 * SE: PLAY REFLECTION
 * SE: PLAY SHOP
 * SE: PLAY USE ITEM
 * SE: PLAY USE SKILL
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes the battle to play a Sound Effect. If you choose a filename (without
 * the filename extensions), the game will play that ME instead. Using this
 * option opens up access to the volume, pitch, and pan control, all of which
 * are optional to use. If no values are inputed for volume, pitch, and pan,
 * the game will use the settings in this plugin's parameters. Using the action
 * sequences with 'play x' in them will cause the game to play a system sound
 * set within RPG Maker's database.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: se: play enemy attack
 *                se: Ice1
 *                se: Laser2, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * TP +X: target, (show)
 * TP -X: target, (show)
 * TP +X%: target, (show)
 * TP -X%: target, (show)
 * TP +VARIABLE X: target, (show)
 * TP -VARIABLE X: target, (show)
 * TP +VARIABLE X%: target, (show)
 * TP -VARIABLE X%: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Target(s) gains TP equal to X values. To show the popup, insert 'show'
 * after the target in the action sequence line. Including 'show' is
 * entirely optional. If 'show' is omitted, no popup will be displayed. For
 * TP to actually show popups, another plugin is needed to display TP popups.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: tp +500: user
 *                tp -variable 5: target
 *                tp +25%: target
 *                tp -variable 7: user
 *=============================================================================
 *
 *=============================================================================
 * WAIT: frames
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Makes the game wait a certain amount of frames before going on to the
 * next action in the action sequence.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: wait: 60
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR ANIMATION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Waits for all animations to finish before going on to the next action in
 * the action sequence.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: wait for animation
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR EFFECT
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Waits for all effects to finish playing before continuing on.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: wait for effect
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR MOVEMENT
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Waits for all battler movements to finish before going on to the next
 * action in the action sequence.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: wait for movement
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR NEW LINE
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Waits for a new line to appear in the log window before going on to the
 * next action in the action sequence.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: wait for new line
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR POPUPS
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Waits for all popups to finish playing before going on to the next action.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: wait for popups
 *=============================================================================
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.03:
 * - Fixed a bug that didn't make the sounds played work properly (again).
 *
 * Version 1.02:
 * - Fixed a bug that didn't make the sounds played work properly.
 *
 * Version 1.01:
 * - Fixed a small bug that didn't allow Change Variable to work properly with
 * evaluated strings.
 *
 * Version 1.00:
 * - Finished plugin!
 */
/*:ja
 * @plugindesc Battle Engine Coreに対する拡張プラグインです
 * @author Yanfly Engine Plugins
 *
 * @param Default Volume
 * @desc BGMのボリュームを設定します
 * @default 90
 *
 * @param Default Pitch
 * @desc BGMのピッチを設定します
 * @default 100
 *
 * @param Default Pan
 * @desc BGMのパンを設定します
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * このプラグインはBattle Engine Coreの拡張プラグインです。
 * 元となるプラグインが無いと動作しませんのでご注意ください。
 *
 * この拡張プラグインには、アクションの視覚的なカスタマイズのための
 * 多くの基本機能を含んでいます。
 * スイッチの変更、変数調整、状態付与、
 * ダメージレートの変更などを行なうことができます。
 *
 * ============================================================================
 * Action Sequences - ala Melody
 * ============================================================================
 *
 * Battle Engine Coreには "Melody's Battle Engine"が含まれており、
 * スキルとアイテムエフェクトの色々な側面を制御します。
 * これらはアクションシーケンスと呼ばれ、ゲームに独特のアクションを提供します。
 *
 * 各スキルとアイテムは、5つの異なるアクションシーケンスから構成されます。
 *
 * 1. セットアップアクション
 *   一連のアクションとエフェクトが実行される前に、アクティブバトラーは、
 * 一歩前進したり、武器を抜くなどの準備アクションを行います。
 * このステップは、バトラーがアイテムやスキルを使う前に起こります。
 *
 * 2. 全体アクション
 *   これらのアクションは、ターゲット全体に対して同時に働きます。
 * このセクションを必ず使う必要はありませんが、
 * 敵の頭上にアニメーションを表示するために、大抵のアクションで
 * 使われています。 このステップは、スキル/アイテム使用後に起こります。
 *
 * 3. ターゲットアクション
 *   このセクションは、全ターゲットに対して個々に働きます。
 * 主に、個別のダメージを与えるようなフィジカルアタックに対して使われます。 
 * ここで起こるアクションは、そのような設定をしない限りは
 * 他のターゲットに影響することはありません。
 *
 * 4. 追随アクション
 *   このセクションは、個別ターゲットアクション後の
 * クリーンアップとして用いられます。
 * これは永続フラグの消去や、コモンイベントの開始などを行います。
 *
 * 5. 完了アクション
 *   このセクションは、アクティブバトラーの一連のアクションの締めに用いられます。
 * 例えば元の位置に戻ったりなどのアクションが挙げられます。
 *
 * 上記がアクションシーケンスにおける5ステップです。下記のタグは、スキルと
 * アイテム内に挿入して使えるタグです。それぞれのタグ名に注意してください。
 *
 * 1. <setup action>                                5. <finish action>
 *     action list                                      action list
 *     action list                                      action list
 *    </setup action>                                  </finish action>
 *
 * 2. <whole action>       3. <target action>       4. <follow action>
 *     action list             action list              action list
 *     action list             action list              action list
 *    </whole action>         </target action>         </follow action>
 *
 * これらのタグは、それぞれのアクションを実行します。アクションリストを挿入する
 * 方法については、ヘルプマニュアルの中に記載されています。
 *
 * 更に、アクションシーケンスごとにデータベース内の全てのアイテムのノート
 * ボックスを呼び出すことのないように、前述の5ステップをコピーする
 * ショートカットがあります。
 * 
 * <action copy: x:y>
 *
 *  x を"item"か"skill"と置き換えて、アクションリストのコードを直接コピーして
 * ください。整数の y は各オブジェクトタイプごとにアサインされたIDとなります。
 * 例えば、45番目のスキルアクションシーケンスをコピーしたい場合は、次のコード
 * になります。 <action copy: skill:45>
 * このNotetagを使う場合、Notebox内では最も優先されるものとなります。
 *
 * ============================================================================
 * Target Typing
 * ============================================================================
 *
 * 今後紹介するアクション内では、"ターゲットを参照"という表記が出てきます。
 * 以下に、ターゲットの一覧を記載します。
 *
 *   user; アクティブバトラーを選択します
 *   target, targets; アクティブターゲットを選択します
 *   actors, existing actors; 生存している全てのアクターを選択します
 *   all actors; 死亡アクターも含めて、全てのアクターを選択します
 *   dead actors: 死亡アクターのみを選択します
 *   actors not user; ユーザー以外の全ての生存アクターを選択します
 *   actor x; スロット x のアクターを選択します
 *   enemies, existing enemies; 生存している全ての敵を選択します
 *   all enemies; 死亡した敵も含めて、全ての敵を選択します
 *   dead enemies: 死亡した敵のみを選択します
 *   enemies not user; ユーザー以外の全ての敵を選択します
 *   enemy x; スロット x の敵を選択します
 *   friends; 生存しているバトラーの仲間を全て選択します
 *   all friends; 生死に関わらず、バトラーの仲間を全て選択します
 *   dead friends; 死亡しているバトラーの仲間を全て選択します
 *   friends not user; 本人を除き、バトラーの仲間を選択します
 *   friend x: スロット x 内の、バトラーの仲間を選択します
 *   opponents; 生存している、バトラーの相手を選択します
 *   all opponents; バトラーの全ての相手を選択します
 *   dead opponents; 死亡している、バトラーの相手を選択します
 *   opponent x: スロット x 内のバトラーの相手を選択します
 *   all alive; 全ての生存アクターと敵を選択します
 *   all members; 全ての生存/死亡アクターと敵を選択します
 *   all dead; 全ての死亡アクターと敵を選択します
 *   all not user; ユーザーを除き、全ての生存バトラーを選択します
 *   focus; アクティブバトラーおよびそのターゲットを選択します
 *   not focus; アクティブバトラーおよびそのターゲット以外を全て選択します
 *
 * ============================================================================
 * Action Sequences - Action List
 * ============================================================================
 *
 * 下記のリストは、5段階のアクションシーケンス内で使えるアクション一覧です。
 * 各アクションは独自の機能を持ち、正常に動作するために正しいフォーマットが
 * 必須となっています。
 *
 *=============================================================================
 * ACTION ANIMATION: (target), (mirror)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * スキル/アイテムにアサインされているアニメーションを再生します。アニメーション
 * は自動的にスキル/アイテムのターゲットを選択します。 'target' を使用すれば、
 * アニメーションを再生するターゲットを指定することができます。 
 *  'mirror' を使用した場合は、そのアニメーションを反転します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: action animation
 *      　 action animation: target
 *         action animation: user, mirror
 *=============================================================================
 *
 *=============================================================================
 * ACTION COMMON EVENT
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * スキル/アイテムの特性リストから、コモンイベントを再生します。これはゲーム
 * エンジンのプロセスに従い、リスト内で最後のコモンイベントのみを再生します。
 * コモンイベントが終わるまでは、アクションリスト上のその他のアクション/イベント
 * はストップされます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: action common event
 *=============================================================================
 *
 *=============================================================================
 * ACTION EFFECT: target
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットが、スキル/アイテムによるダメージやヒールを受けます。またバフや
 * ステートのような状態変化を負うようになります。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: action effect
 *=============================================================================
 *
 *=============================================================================
 * ADD stat BUFF: target, (turns), (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットにバフを与えます。'stat' の部分を 'hp', 'mp', 'atk', 'def', 'mat',
 * 'mdf', 'agi', 'luk'に変えて使うこともできます。ターゲットの後に数字を入れると
 * そのターン分のバフが続きます。'show'を含めると、バトルログ内でバフ効果を受け
 * ているターゲットを表示します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: add atk buff: user, 3, show
 *         add def buff: target, 8
 *=============================================================================
 *
 *=============================================================================
 * ADD stat DEBUFF: target, (turns), (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットにデバフを与えます。'stat'の部分を 'hp', 'mp', 'atk', 'def', 'mat',
 * 'mdf', 'agi', 'luk'に変えて使うこともできます。ターゲットの後に数字を入れると
 * そのターン分のバフが続きます。'show'を含めると、バトルログ内でデバフ効果を受
 * けているターゲットを表示します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: add atk debuff: user, 3, show
 *      　 add def debuff: target, 8
 *=============================================================================
 *
 *=============================================================================
 * ADD STATE X: target, (show)
 * ADD STATE X, Y, Z: target (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * X のステートをターゲットに与えます。(必要に応じてYとZを用いてください)
 * 'show' を含めると、ステートに関連するメッセージを全て表示します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: add state 5: target
 *         add state 6, 7, 8: user, show
 *=============================================================================
 *
 *=============================================================================
 * ANIMATION X: target, (mirror)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲット上で X のアニメーションを再生します。'Mirror'で、反転して再生
 * させることができます。アクター上で再生されるアニメーションは、自動的に反転
 * され、ミラーオプションを設定すると非反転状態で表れます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: animation 5: user
 *         animation 6: target, mirror
 *=============================================================================
 *
 *=============================================================================
 * ANIMATION WAIT: X
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アニメーションフレーム x 分待機させます。待機の持続時間は数フレームで指定
 * することができます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: animation 5: user
 *         animation 6: target, mirror
 *=============================================================================
 *
 *=============================================================================
 * BGM: STOP
 * BGM: MEMORIZE
 * BGM: MEMORY
 * BGM: filename, (volume), (pitch), (pan)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 手動で現在のBGMを変更することができます。'Stop'で全てのBGMを停止します。
 * 'Memorize'では、現在のBGMを記憶させます。'Memory'で、記憶したBGMがある場合は
 * それを再生します。ファイル名を指定した場合は(ファイル名拡張無しで)、
 * 代わりにそのBGMを再生します。このオプションを使うと、ボリューム/ピッチ/パン
 * などを調節する窓が開きます。
 * ボリューム/ピッチ/パンに何の数字も入れなければ、プラグインパラメータの値が
 * 適用されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: bgm: stop
 *         bgm: memorize
 *         bgm: memory
 *         bgm: Battle7
 *         bgm: Theme2, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * BGS: STOP
 * BGS: MEMORIZE
 * BGS: MEMORY
 * BGS: filename, (volume), (pitch), (pan)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 手動で現在のBGSを変更することができます。'Stop'で全てのBGSを停止します。
 * 'Memorize'では、現在のBGSを記憶させます。'Memory'で、記憶したBGSがある場合は
 * それを再生します。ファイル名を指定した場合は(ファイル名拡張無しで)、
 * 代わりにそのBGSを再生します。このオプションを使うと、ボリューム/ピッチ/パン
 * など、を調節する窓が開きます。
 * ボリューム/ピッチ/パンに何の数字も入れなければ、プラグインパラメータの値が
 * 適用されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: bgs: stop
 *         bgs: memorize
 *         bgs: memory
 *         bgs: City
 *         bgs: Darkness, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * CAST ANIMATION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * スキル使用者のアニメーションを再生します。アイテム使用だったり、通常攻撃の
 * 場合はこれが発動しません。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: cast animation
 *=============================================================================
 *
 *=============================================================================
 * CLEAR BATTLE LOG
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * スクリーン上部の全てのメッセージを消去します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: clear battle log
 *=============================================================================
 *
 *=============================================================================
 * CHANGE SWITCH X: on/off/toggle/switch z
 * CHANGE SWITCH X..Y: on/off/toggle/switch z
 * CHANGE SWITCH X TO Y: on/off/toggle/switch z
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ゲームスイッチ X をオン/オフ/トグル(オンオフ切り替え)、もしくはスイッチ Y の
 * 状態に変更することができます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: change switch 1: on
 *         change switch 2..4: off
 *         change switch 5 to 8: toggle
 *         change switch 9: switch 5
 *=============================================================================
 *
 *=============================================================================
 * CHANGE VARIABLE X = Y
 * CHANGE VARIABLE X += Y
 * CHANGE VARIABLE X -= Y
 * CHANGE VARIABLE X *= Y
 * CHANGE VARIABLE X /= Y
 * CHANGE VARIABLE X %= Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションシーケンスの中の X の値を Y の値に調整します。Y の値には、整数
 * もしくはコードを用いることができます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: change variable 1 = 2
 *         change variable 3 += 4
 *         change variable 5 -= 6
 *         change variable 7 *= 8
 *         change variable 9 /= 10
 *         change variable 11 %= 12
 *=============================================================================
 *
 *=============================================================================
 * COLLAPSE: target, (force)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットがあるポイントで死亡した場合、アクションシーケンスが途中でもその
 * ポイントでターゲットを倒すことができます。ターゲットを強制的に死亡させたい
 * 場合は、 'force' のコマンドをターゲットの後に挿入してください。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: collapse: user
 *  　     collapse: target, force
 *=============================================================================
 *
 *=============================================================================
 * COMMON EVENT: X
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションシーケンスのこのポイントで、コモンイベントを再生します。このコモン
 * イベントが終わるまでは、他のイベントは再生されません。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: common event: 1
 *=============================================================================
 *
 *=============================================================================
 * DEATH BREAK
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * スキルの途中でユーザーが死亡した場合(カウンター攻撃や攻撃反射を含む)、
 * スキル/アイテムの残りのアクションシーケンスを終了させ、スキップさせます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: death break
 *=============================================================================
 *
 *=============================================================================
 * DISPLAY ACTION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * バトルログの上部に、アクション名を表示させます。これはバトルログが消去される
 * まで残ります。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: display action
 *=============================================================================
 *
 *=============================================================================
 * EVAL: code
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 既存のバトルエンジンがサポートしていない機能を使用したい方は、コードを実行
 * させるeval機能を用いることができます。Javascriptに慣れていない方には
 * あまりおすすめしない機能ですのでご注意ください。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: eval: $gameParty.loseItem($dataItems[3], 10)
 *=============================================================================
 *
 *=============================================================================
 * GAIN ITEM X: Y           LOSE ITEM X: Y
 * GAIN WEAPON X: Y         LOSE WEAPON X: Y
 * GAIN ARMOR X: Y          LOSE ARMOR X: Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * あなたのパーティは x というアイテムもしくは防具を、y だけ取得/喪失します。
 * y の入力を省くと、デフォルトで 1 に設定されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: gain item 1: 20
 *         lose weapon 2
 *         gain armor 3: 50
 *=============================================================================
 *
 *=============================================================================
 * GOLD +x
 * GOLD -x
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * あなたのパーティは戦闘中に x のゴールドを獲得/喪失します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: gold +2000
 *         gold -500
 *=============================================================================
 *
 *=============================================================================
 * IF ... ELSE STATEMENTS
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * プログラミングに慣れ親しんだ方であれば「if...else statements」を用いて、状態
 * に応じたアクションを実行させることができます。'if'を用いて、対象が特定の状態
 * である場合にコードを実行します。もしその状態でない場合には 'else'で
 * コードを実行します。 'else if' を用いると、最初の状態がfalseだった場合に
 * 新しい状態を試します。 'end' を用いて、状態の終了を指定します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例:
 *     if $gameSwitches.value(1)
 *         action effect
 *     else if $gameSwitches.value(2)
 *         action effect
 *         action effect
 *     else
 *         action effect
 *         action effect
 *         action effect
 *     end
 *
 * *注: 実際にはコード部分の字下げは必要ありません。上記は一例となります。
 *=============================================================================
 *
 *=============================================================================
 * IMMORTAL: targets, true/false
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットに不死身のステートを付与し、ターゲットは攻撃の最中に死ぬことがなく
 * なります。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: immortal: targets true
 *=============================================================================
 *
 *=============================================================================
 * HP +X: target, (show)
 * HP -X: target, (show)
 * HP +X%: target, (show)
 * HP -X%: target, (show)
 * HP +VARIABLE X: target, (show)
 * HP -VARIABLE X: target, (show)
 * HP +VARIABLE X%: target, (show)
 * HP -VARIABLE X%: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットは X の値のHPを得ます。ポップアップを表示するにはアクション
 * シーケンスライン内のターゲットの後に 'show' を挿入してください。
 * 'show' の挿入はオプションになりますので、ない場合はポップアップは表示され
 * ません。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: hp +500: user
 *         hp -variable 5: target
 *         hp +25%: target
 *         hp -variable 7: user
 *=============================================================================
 *
 *=============================================================================
 * ME: STOP
 * ME: filename, (volume), (pitch), (pan)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 戦闘時にファンファーレを鳴らします。'Stop' で全てのMEを停止します。
 * ファイルネームを指定すると、ゲームはそのMEを代わりに再生します。このオプ
 * ションを使用すると、ボリュームやピッチ、パンのコントロールなども可能になり
 * ます。これらに何の値も入れない場合は、プラグインのパラメータが使用されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: me: stop
 *         me: Victory1
 *         me: Darkness, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * MOTION WAIT: target
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションを行っているターゲットがアクターだった場合、そのターゲットを12
 * フレーム待機させます。アクターでない場合は待機は起こりません。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: motion wait: user
 *=============================================================================
 *
 *=============================================================================
 * MP +X: target, (show)
 * MP -X: target, (show)
 * MP +X%: target, (show)
 * MP -X%: target, (show)
 * MP +VARIABLE X: target, (show)
 * MP -VARIABLE X: target, (show)
 * MP +VARIABLE X%: target, (show)
 * MP -VARIABLE X%: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットは X の値のMPを得ます。ポップアップを表示するにはアクション
 * シーケンスライン内のターゲットの後に 'show' を挿入してください。
 * 'show' の挿入はオプションになりますので、ない場合はポップアップは表示され
 * ません。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: mp +500: user
 *         mp -variable 5: target
 *         mp +25%: target
 *         mp -variable 7: user
 *=============================================================================
 *
 *=============================================================================
 * PERFORM ACTION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクターに一歩前進させ、武器を振る/押し出すモーションを行わせます。
 * どのモーションが行われるかはゲームにより自動的に決定されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: perform action
 *=============================================================================
 *
 *=============================================================================
 * PERFORM FINISH
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクターを元の位置まで後退させます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: perform finish
 *=============================================================================
 *
 *=============================================================================
 * PERFORM START
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクターを元の位置まで前進させます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: perform start
 *=============================================================================
 *
 *=============================================================================
 * REFRESH STATUS
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションシーケンスの途中で、ステータスウィンドウをリフレッシュします。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: refresh status
 *=============================================================================
 *
 *=============================================================================
 * REMOVE stat BUFF: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 'stat' のバフをターゲットから外します。'stat' を 'hp', 'mp', 'atk', 'def'
 * 'mat', 'mdf', 'agi', 'luk'などと置き換えることもできます。'show' を含めば
 * バトルログ内でターゲットからのバフ除去を表示させることができます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: remove atk buff: user, show
 *         remove def buff: target
 *=============================================================================
 *
 *=============================================================================
 * REMOVE stat DEBUFF: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 'stat' のデバフをターゲットから外します。'stat' を 'hp', 'mp', 'atk', 'def'
 * 'mat', 'mdf', 'agi', 'luk'などと置き換えることもできます。'show' を含めば
 * バトルログ内でターゲットからのデバフ除去を表示させることができます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: remove atk debuff: user, show
 *         remove def debuff: target
 *=============================================================================
 *
 *=============================================================================
 * REMOVE STATE X: target (show)
 * REMOVE STATE X, Y, Z: target (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * X のステート (指定した場合はYとZも)をターゲットから除去します。'show' を含
 * めれば、ステート関連のメッセージにも表示させることができます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: remove state 5: target
 *         remove state 6, 7, 8: user, show
 *=============================================================================
 *
 *=============================================================================
 * SE: filename, (volume), (pitch), (pan)
 * SE: PLAY OK
 * SE: PLAY CURSOR
 * SE: PLAY CANCEL
 * SE: PLAY BUZZER
 * SE: PLAY EQUIP
 * SE: PLAY SAVE
 * SE: PLAY LOAD
 * SE: PLAY BATTLE START
 * SE: PLAY ESCAPE
 * SE: PLAY ENEMY ATTACK
 * SE: PLAY ENEMY DAMAGE
 * SE: PLAY ENEMY COLLAPSE
 * SE: PLAY BOSS COLLAPSE 1
 * SE: PLAY BOSS COLLAPSE 2
 * SE: PLAY ACTOR DAMAGE
 * SE: PLAY ACTOR COLLAPSE
 * SE: PLAY RECOVERY
 * SE: PLAY MISS
 * SE: PLAY EVASION
 * SE: PLAY MAGIC EVASION
 * SE: PLAY REFLECTION
 * SE: PLAY SHOP
 * SE: PLAY USE ITEM
 * SE: PLAY USE SKILL
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 戦闘にサウンドエフェクトを追加できます。ファイル名を指定すれば、そのSEが再生
 * されます。このオプションを使用すると、ボリュームやピッチ、パンのコントロール
 * なども可能になります。これらに何の値も入れない場合は、プラグインのパラメータ
 * が使用されます。'play x' を入れてアクションシーケンスを使うと、RPGツクールの
 * データベース内からシステムサウンドを再生します。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: se: play enemy attack
 *         se: Ice1
 *         se: Laser2, 80, 100, 0
 *=============================================================================
 *
 *=============================================================================
 * TP +X: target, (show)
 * TP -X: target, (show)
 * TP +X%: target, (show)
 * TP -X%: target, (show)
 * TP +VARIABLE X: target, (show)
 * TP -VARIABLE X: target, (show)
 * TP +VARIABLE X%: target, (show)
 * TP -VARIABLE X%: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットは X の値のTPを得ます。ポップアップを表示するにはアクション
 * シーケンスライン内のターゲットの後に 'show' を挿入してください。
 * 'show' の挿入はオプションになりますので、ない場合はポップアップは表示され
 * ません。実際にTPのポップアップを表示させるには別のプラグインが必要になります。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: tp +500: user
 *                tp -variable 5: target
 *                tp +25%: target
 *                tp -variable 7: user
 *=============================================================================
 *
 *=============================================================================
 * WAIT: frames
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションシーケンス内で次のアクションに移る前に、任意のフレーム数、
 * ゲームを待機させることができます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: wait: 60
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR ANIMATION
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションシーケンス内で次のアクションに移る前に、一旦すべてのアニメーション
 * が終わるのを待ちます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: wait for animation
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR EFFECT
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 続行する前に、一旦すべてのエフェクトが再生し終わるのを待ちます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: wait for effect
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR MOVEMENT
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションシーケンス内で次のアクションに移る前に、一旦すべてのバトラーの
 * アクションが終わるのを待ちます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: wait for movement
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR NEW LINE
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクションシーケンス内で次のアクションに移る前に、ログウィンドウ内に新しい
 * 一文が出てくるのを待ちます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: wait for new line
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR POPUPS
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次のアクションに移る前に、全てのポップアップが再生し終わるのを待ちます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: wait for popups
 *=============================================================================
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.03:
 * - Fixed a bug that didn't make the sounds played work properly (again).
 *
 * Version 1.02:
 * - Fixed a bug that didn't make the sounds played work properly.
 *
 * Version 1.01:
 * - Fixed a small bug that didn't allow Change Variable to work properly with
 * evaluated strings.
 *
 * Version 1.00:
 * - Finished plugin!
 */

//=============================================================================

if (Imported.YEP_BattleEngineCore) {

//=============================================================================
// Parameters
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_X_ActSeqPack1');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.SoundVolume = Number(Yanfly.Parameters['Default Volume']);
Yanfly.Param.SoundPitch = Number(Yanfly.Parameters['Default Pitch']);
Yanfly.Param.SoundPan = Number(Yanfly.Parameters['Default Pan']);

//=============================================================================
// BattleManager
//=============================================================================

Yanfly.ASP1.BattleManager_processActionSequence =
    BattleManager.processActionSequence;
BattleManager.processActionSequence = function(actionName, actionArgs) {
  // ADD X BUFF
  if (actionName.match(/ADD[ ](.*)[ ]BUFF/i)) {
    return this.actionAddBuff(actionName, actionArgs);
  }
  // ADD X DEBUFF
  if (actionName.match(/ADD[ ](.*)[ ]DEBUFF/i)) {
    return this.actionAddDebuff(actionName, actionArgs);
  }
  // ADD STATE X
  if (actionName.match(/(?:ADD_STATE|ADD STATE)[ ](\d+(?:\s*,\s*\d+)*)/i)) {
    return this.actionAddState(actionName, actionArgs);
  }
  // ANIMATION X
  if (actionName.match(/ANIMATION[ ](\d+)/i)) {
    return this.actionAnimation(parseInt(RegExp.$1), actionArgs);
  }
  // BGM, MUSIC, SONG
  if (['BGM', 'MUSIC', 'SONG'].contains(actionName)) {
    return this.actionBgmPlay(actionArgs);
  }
  // BGS, AMBIENCE
  if (['BGS', 'AMBIENCE'].contains(actionName)) {
    return this.actionBgsPlay(actionArgs);
  }
  // COLLAPSE: target, (force)
  if (actionName === 'COLLAPSE') {
    return this.actionCollapse(actionArgs);
  }
  // COMMON EVENT: event id
  if (actionName === 'COMMON EVENT') {
    return this.actionCommonEvent(actionArgs[0]);
  }
  // CHANGE SWITCH X
  if (actionName.match(/CHANGE[ ]SWITCH[ ](.*)/i)) {
    return this.actionChangeSwitch(actionName, actionArgs);
  }
  // CHANGE VARIABLE X
  if (actionName.match(/CHANGE[ ]VARIABLE[ ](.*)/i)) {
    return this.actionChangeVariable(actionName);
  }
  // EVAL, SCRIPT
  if (['EVAL', 'SCRIPT'].contains(actionName)) {
    return this.actionEval(actionArgs);
  }
  // GAIN ITEM (item, weapon, armor) X
  if (actionName.match(/GAIN[ ](.*)[ ](\d+)/i) ||
  actionName.match(/LOSE[ ](.*)[ ](\d+)/i)) {
    return this.actionGainItem(actionName, actionArgs);
  }
  // GOLD +/- VALUE
  if (actionName.match(/GOLD[ ]([\+\-]\d+)/i)) {
    return this.actionGoldModify(parseInt(RegExp.$1));
  }
  // HP +/- VALUE
  if (actionName.match(/HP[ ](.*)/i)) {
    return this.actionHpModify(actionName, actionArgs);
  }
  // ME, FANFARE
  if (['ME', 'FANFARE'].contains(actionName)) {
    return this.actionMePlay(actionArgs);
  }
  // MP +/- VALUE
  if (actionName.match(/MP[ ](.*)/i)) {
    return this.actionMpModify(actionName, actionArgs);
  }
  // REFRESH STATUS, REFRESH WINDOW
  if (['REFRESH STATUS', 'REFRESH WINDOW'].contains(actionName)) {
    return this.actionRefreshStatus();
  }
  // REMOVE X BUFF
  if (actionName.match(/REMOVE[ ](.*)[ ]BUFF/i)) {
    return this.actionRemoveBuff(actionName, actionArgs);
  }
  // REMOVE X DEBUFF
  if (actionName.match(/REMOVE[ ](.*)[ ]DEBUFF/i)) {
    return this.actionRemoveDebuff(actionName, actionArgs);
  }
  // REMOVE STATE X
  if
  (actionName.match(/(?:REMOVE_STATE|REMOVE STATE)[ ](\d+(?:\s*,\s*\d+)*)/i)) {
    return this.actionRemoveState(actionName, actionArgs);
  }
  // SE, SOUND, SFX
  if (['SE', 'SOUND', 'SFX'].contains(actionName)) {
    return this.actionSePlay(actionArgs);
  }
  // TP +/- VALUE
  if (actionName.match(/TP[ ](.*)/i)) {
    return this.actionTpModify(actionName, actionArgs);
  }
  return Yanfly.ASP1.BattleManager_processActionSequence.call(this,
    actionName, actionArgs);
};

BattleManager.getParamId = function(stat) {
    switch (stat) {
    case 'HP':
    case 'MAXHP':
    case 'MAX HP':
      return 0;
      break;
    case 'MP':
    case 'MAXMP':
    case 'MAX MP':
    case 'SP':
    case 'MAXSP':
    case 'MAX SP':
      return 1;
      break;
    case 'ATK':
    case 'STR':
      return 2;
      break;
    case 'DEF':
      return 3;
      break;
    case 'MAT':
    case 'INT' || 'SPI':
      return 4;
      break;
    case 'MDF':
    case 'RES':
      return 5;
      break;
    case 'AGI':
    case 'SPD':
      return 6;
      break;
    case 'LUK':
      return 7;
      break;
    }
    return -1;
};

BattleManager.actionAddBuff = function(actionName, actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  if (targets.length < 1) return false;
  var show = false;
  for (var i = 0; i < actionArgs.length; ++i) {
    var actionArg = actionArgs[i];
    if (actionArg.toUpperCase() === 'SHOW') show = true;
  }
  if (actionName.match(/ADD[ ](.*)[ ]BUFF/i)) {
    var paramId = this.getParamId(String(RegExp.$1).toUpperCase());
  } else {
    return true;
  }
  if (actionArgs[1] && parseInt(actionArgs[1]) > 0) {
    var turns = parseInt(actionArgs[1]);
  } else {
    var turns = 5;
  }
  if (paramId < 0) return true;
  var refresh = false;
  targets.forEach(function(target) {
    target.addBuff(paramId, turns);
    if (show) this._logWindow.displayActionResults(this._subject, target);
    if (target.isActor()) refresh = true;
  }, this);
  if (refresh) BattleManager.refreshStatus();
  return true;
};

BattleManager.actionAddDebuff = function(actionName, actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  if (targets.length < 1) return false;
  var show = false;
  for (var i = 0; i < actionArgs.length; ++i) {
    var actionArg = actionArgs[i];
    if (actionArg.toUpperCase() === 'SHOW') show = true;
  }
  if (actionName.match(/ADD[ ](.*)[ ]DEBUFF/i)) {
    var paramId = this.getParamId(String(RegExp.$1).toUpperCase());
  } else {
    return true;
  }
  if (actionArgs[1] && parseInt(actionArgs[1]) > 0) {
    var turns = parseInt(actionArgs[1]);
  } else {
    var turns = 5;
  }
  if (paramId < 0) return true;
  var refresh = false;
  targets.forEach(function(target) {
    target.addDebuff(paramId, turns);
    if (show) this._logWindow.displayActionResults(this._subject, target);
    if (target.isActor()) refresh = true;
  }, this);
  if (refresh) BattleManager.refreshStatus();
  return true;
};

BattleManager.actionAddState = function(actionName, actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  if (targets.length < 1) return false;
  var show = false;
  for (var i = 0; i < actionArgs.length; ++i) {
    var actionArg = actionArgs[i];
    if (actionArg.toUpperCase() === 'SHOW') show = true;
  }
  if (actionName.match(/(?:ADD_STATE|ADD STATE)[ ](\d+(?:\s*,\s*\d+)*)/i)) {
    var states = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
  } else {
    return true;
  }
  var refresh = false;
  targets.forEach(function(target) {
    for (var i = 0; i < states.length; ++i) {
      stateId = states[i];
      target.addState(stateId);
      if (show) this._logWindow.displayActionResults(this._subject, target);
      if (target.isActor()) refresh = true;
    }
  }, this);
  if (refresh) BattleManager.refreshStatus();
  return true;
};

BattleManager.actionAnimation = function(aniId, actionArgs) {
  if (aniId <= 0) return;
  var targets = this.makeActionTargets(actionArgs[0]);
  if (targets.length < 1) return false;
  var mirror = false;
  if (actionArgs[1] && actionArgs[1].toUpperCase() === 'MIRROR') mirror = true;
  this._logWindow.showNormalAnimation(targets, aniId, mirror);
  return true;
};

BattleManager.actionBgmPlay = function(actionArgs) {
  if (actionArgs.length < 1) return true;
  if (actionArgs[0].toUpperCase() === 'STOP') {
    AudioManager.stopBgm();
  } else if (actionArgs[0].toUpperCase() === 'MEMORIZE') {
    this._battleMemorizedBgm = AudioManager.saveBgm();
    return true;
  } else if (actionArgs[0].toUpperCase() === 'MEMORY') {
    if (this._battleMemorizedBgm) {
      AudioManager.replayBgm(this._battleMemorizedBgm);
    }
  } else {
    var name = actionArgs[0];
    if (!name) return true;
    var vol = actionArgs[1] || Yanfly.Param.SoundVolume;
    var pitch = actionArgs[2] || Yanfly.Param.SoundPitch;
    var pan = actionArgs[3] || Yanfly.Param.SoundPan;
    var bgm = {
      name: name,
      volume: vol,
      pitch: pitch,
      pan: pan
    };
    AudioManager.playBgm(bgm);
  }
  return true;
};

BattleManager.actionBgsPlay = function(actionArgs) {
  if (actionArgs.length < 1) return true;
  if (actionArgs[0].toUpperCase() === 'STOP') {
    AudioManager.stopBgs();
  } else if (actionArgs[0].toUpperCase() === 'MEMORIZE') {
    this._battleMemorizedBgs = AudioManager.saveBgs();
    return true;
  } else if (actionArgs[0].toUpperCase() === 'MEMORY') {
    if (this._battleMemorizedBgs) {
      AudioManager.replayBgs(this._battleMemorizedBgs);
    }
  } else {
    var name = actionArgs[0];
    if (!name) return true;
    var vol = actionArgs[1] || Yanfly.Param.SoundVolume;
    var pitch = actionArgs[2] || Yanfly.Param.SoundPitch;
    var pan = actionArgs[3] || Yanfly.Param.SoundPan;
    var bgs = {
      name: name,
      volume: vol,
      pitch: pitch,
      pan: pan
    };
    AudioManager.playBgs(bgs);
  }
  return true;
};

BattleManager.actionCollapse = function(actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  var force = (actionArgs[1].toUpperCase() === 'FORCE');
  targets.forEach(function(target) {
    if (force) {
      target.removeImmortal();
      target.addState(target.deathStateId());
    }
    if (target.isDeathStateAffected()) target.performCollapse();

  }, this);
  return false;
};

BattleManager.actionCommonEvent = function(id) {
  $gameTemp.reserveCommonEvent(id);
  return false;
};

BattleManager.actionChangeSwitch = function(actionName, actionArgs) {
  var subject = this._subject;
  var user = this._subject;
  var target = this._targets[0];
  var targets = this._targets;
  var action = this._action;
  var item = this._action.item();
  var switches = [];
  if (actionName.match(/SWITCH[ ](\d+)/i)) {
    switches = [parseInt(RegExp.$1)];
  } else if (actionName.match(/SWITCH[ ](\d+)..(\d+)/i)) {
    switches = [getRange(parseInt(RegExp.$1), parseInt(RegExp.$2))];
  } else if (actionName.match(/SWITCH[ ](\d+)[ ]TO[ ](\d+)/i)) {
      switches = [getRange(parseInt(RegExp.$1), parseInt(RegExp.$2))];
  } else {
    return true;
  }
  var result = actionArgs[0].toUpperCase();
  var value;
  if (['ON', 'TRUE'].contains(result)) {
    value = true;
  } else if (['OFF', 'FALSE'].contains(result)) {
    value = false;
  } else if (['TOGGLE', 'OPPOSITE', 'REVERSE'].contains(result)) {
    value = 'toggle';
  } else if (result.match(/SWITCH[ ](\d+)/i)) {
    value = $gameSwitches.value(parseInt(RegExp.$1));
  }
  switches.forEach(function(switchId) {
    if (value === 'toggle') {
      $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
    } else {
      $gameSwitches.setValue(switchId, value);
    }
  }, this);
  return true;
};

BattleManager.actionChangeVariable = function(actionName) {
  var cV1 =
  /CHANGE[ ](?:VARIABLE|VAR)[ ](\d+)[ ](.*)[ ](?:VARIABLE|VAR)[ ](\d+)/i;
  var cV2 = /CHANGE[ ](?:VARIABLE|VAR)[ ](\d+)[ ](.*)[ ](.*)/i;
  var subject = this._subject;
  var user = this._subject;
  var target = this._targets[0];
  var targets = this._targets;
  var action = this._action;
  var item = this._action.item();
  if (this._actSeq[0].match(cV1)) {
    var mainVar = parseInt(RegExp.$1);
    var operation = String(RegExp.$2);
    var editVar = $gameVariables.value(parseInt(RegExp.$3));
  } else if (this._actSeq[0].match(cV2)) {
    var mainVar = parseInt(RegExp.$1);
    var operation = String(RegExp.$2);
    var editVar = eval(String(RegExp.$3));
  } else {
    return true;
  }
  var mainValue = $gameVariables.value(mainVar);
  if (['='].contains(operation)) {
    $gameVariables.setValue(mainVar, eval(editVar));
  } else if (['+=', '+'].contains(operation)) {
    $gameVariables.setValue(mainVar, mainValue + eval(editVar));
  } else if (['-=', '-'].contains(operation)) {
    $gameVariables.setValue(mainVar, mainValue - eval(editVar));
  } else if (['*=', '*'].contains(operation)) {
    $gameVariables.setValue(mainVar, mainValue * eval(editVar));
  } else if (['/=', '/'].contains(operation)) {
    $gameVariables.setValue(mainVar, mainValue / eval(editVar));
  } else if (['%=', '%'].contains(operation)) {
    $gameVariables.setValue(mainVar, mainValue % eval(editVar));
  }
  return true;
};

BattleManager.actionEval = function(actionArgs) {
    if (actionArgs.length < 1) return true;
    var subject = this._subject;
    var user = this._subject;
    var target = this._targets[0];
    var targets = this._targets;
    var action = this._action;
    var item = this._action.item();
    var text = String(actionArgs[0]);
    for (var i = 1; i < actionArgs.length; ++i) {
        text = text + ', ' + String(actionArgs[i]);
    }
    eval(text);
    return false;
};

BattleManager.actionGainItem = function(actionName, actionArgs) {
    var gainItem;
    var type;
    var itemId;
    if (actionName.match(/GAIN[ ](.*)[ ](\d+)/i)) {
      gainItem = true;
      type = String(RegExp.$1).toUpperCase();
      itemId = parseInt(RegExp.$2);
    } else if (actionName.match(/LOSE[ ](.*)[ ](\d+)/i)) {
      gainItem = false;
      type = String(RegExp.$1).toUpperCase();
      itemId = parseInt(RegExp.$2);
    } else {
      return true;
    }
    var item;
    if (type === 'ITEM') {
      item = $dataItems[itemId];
    } else if (['WPN', 'WEAPON'].contains(type)) {
      item = $dataWeapons[itemId];
    } else if (['ARM', 'ARMOR', 'ARMOUR'].contains(type)) {
      item = $dataArmors[itemId];
    } else {
      return true;
    }
    var amount = Math.max(1, parseInt(actionArgs[0]));
    if (isNaN(amount)) amount = 1;
    if (gainItem)  $gameParty.gainItem(item, amount);
    if (!gainItem) $gameParty.loseItem(item, amount);
    return true;
};

BattleManager.actionGoldModify = function(value) {
    $gameParty.gainGold(value);
    return true;
};

BattleManager.actionHpModify = function(actionName, actionArgs) {
    var targets = this.makeActionTargets(actionArgs[0]);
    if (targets.length < 1) return false;
    var change;
    var percent;
    if (actionName.match(/HP[ ]([+-])(?:VARIABLE|VAR)[ ](\d+)/i)) {
      change = parseInt($gameVariables.value(parseInt(RegExp.$2)));
      if (String(RegExp.$1) === '-') change *= -1;
      percent = false;
    } else if
    (actionName.match(/HP[ ]([+-])(?:VARIABLE|VAR)[ ](\d+)([%％])/i)) {
      change = parseInt($gameVariables.value(parseInt(RegExp.$2)));
      if (String(RegExp.$1) === '-') change *= -1;
      percent = true;
    } else if (actionName.match(/HP[ ]([\+\-]\d+)([%％])/i)) {
      change = parseInt(RegExp.$1);
      percent = true;
    } else if (actionName.match(/HP[ ]([\+\-]\d+)/i)) {
      change = parseInt(RegExp.$1);
      percent = false;
    } else {
      return false;
    }
    var show = false;
    for (var i = 0; i < actionArgs.length; ++i) {
      var actionArg = actionArgs[i];
      if (actionArg.toUpperCase() === 'SHOW') show = true;
    }
    var value;
    var refresh = false;
    targets.forEach(function(target) {
      target.clearResult();
      value = percent ? (target.mhp * change * 0.01) : change;
      target.gainHp(parseInt(value));
      if (show) {
        target.startDamagePopup();
        this._logWindow.displayActionResults(this._subject, target);
        if (target.isActor()) refresh = true;
      }
    }, this);
    if (refresh) BattleManager.refreshStatus();
    return true;
};

BattleManager.actionMePlay = function(actionArgs) {
  if (actionArgs.length < 1) return true;
  if (actionArgs[0].toUpperCase() === 'STOP') {
    AudioManager.stopMe();
  } else {
    var name = actionArgs[0];
    if (!name) return true;
    var vol = actionArgs[1] || Yanfly.Param.SoundVolume;
    var pitch = actionArgs[2] || Yanfly.Param.SoundPitch;
    var pan = actionArgs[3] || Yanfly.Param.SoundPan;
    var me = {
      name: name,
      volume: vol,
      pitch: pitch,
      pan: pan
    };
    AudioManager.playMe(me);
  }
  return true;
};

BattleManager.actionMpModify = function(actionName, actionArgs) {
    var targets = this.makeActionTargets(actionArgs[0]);
    if (targets.length < 1) return false;
    var change;
    var percent;
    if (actionName.match(/MP[ ]([+-])(?:VARIABLE|VAR)[ ](\d+)/i)) {
      change = parseInt($gameVariables.value(parseInt(RegExp.$2)));
      if (String(RegExp.$1) === '-') change *= -1;
      percent = false;
    } else if
    (actionName.match(/MP[ ]([+-])(?:VARIABLE|VAR)[ ](\d+)([%％])/i)) {
      change = parseInt($gameVariables.value(parseInt(RegExp.$2)));
      if (String(RegExp.$1) === '-') change *= -1;
      percent = true;
    } else if (actionName.match(/MP[ ]([\+\-]\d+)([%％])/i)) {
      change = parseInt(RegExp.$1);
      percent = true;
    } else if (actionName.match(/MP[ ]([\+\-]\d+)/i)) {
      change = parseInt(RegExp.$1);
      percent = false;
    } else {
      return false;
    }
    var show = false;
    for (var i = 0; i < actionArgs.length; ++i) {
      var actionArg = actionArgs[i];
      if (actionArg.toUpperCase() === 'SHOW') show = true;
    }
    var value;
    var refresh = false;
    targets.forEach(function(target) {
      target.clearResult();
      value = percent ? (target.mmp * change * 0.01) : change;
      target.gainMp(parseInt(value));
      if (show) {
        target.startDamagePopup();
        this._logWindow.displayActionResults(this._subject, target);
        if (target.isActor()) refresh = true;
      }
    }, this);
    if (refresh) BattleManager.refreshStatus();
    return true;
};

BattleManager.actionRefreshStatus = function() {
    this._statusWindow.refresh();
    return false;
};

BattleManager.actionRemoveBuff = function(actionName, actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  if (targets.length < 1) return false;
  var show = false;
  for (var i = 0; i < actionArgs.length; ++i) {
    var actionArg = actionArgs[i];
    if (actionArg.toUpperCase() === 'SHOW') show = true;
  }
  if (actionName.match(/REMOVE[ ](.*)[ ]BUFF/i)) {
    var paramId = this.getParamId(String(RegExp.$1).toUpperCase());
  } else {
    return true;
  }
  if (paramId < 0) return true;
  var refresh = false;
  targets.forEach(function(target) {
    if (target.isBuffAffected(paramId)) {
      target.removeBuff(paramId);
      if (show) this._logWindow.displayActionResults(this._subject, target);
      if (target.isActor()) refresh = true;
    }
  }, this);
  if (refresh) BattleManager.refreshStatus();
  return true;
};

BattleManager.actionRemoveDebuff = function(actionName, actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  if (targets.length < 1) return false;
  var show = false;
  for (var i = 0; i < actionArgs.length; ++i) {
    var actionArg = actionArgs[i];
    if (actionArg.toUpperCase() === 'SHOW') show = true;
  }
  if (actionName.match(/REMOVE[ ](.*)[ ]DEBUFF/i)) {
    var paramId = this.getParamId(String(RegExp.$1).toUpperCase());
  } else {
    return true;
  }
  if (paramId < 0) return true;
  var refresh = false;
  targets.forEach(function(target) {
    if (target.isDebuffAffected(paramId)) {
      target.removeBuff(paramId);
      if (show) this._logWindow.displayActionResults(this._subject, target);
      if (target.isActor()) refresh = true;
    }
  }, this);
  if (refresh) BattleManager.refreshStatus();
  return true;
};

BattleManager.actionRemoveState = function(actionName, actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  if (targets.length < 1) return false;
  var show = false;
  for (var i = 0; i < actionArgs.length; ++i) {
    var actionArg = actionArgs[i];
    if (actionArg.toUpperCase() === 'SHOW') show = true;
  }
  if
  (actionName.match(/(?:REMOVE_STATE|REMOVE STATE)[ ](\d+(?:\s*,\s*\d+)*)/i)) {
    var states = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
  } else {
    return true;
  }
  var refresh = false;
  targets.forEach(function(target) {
    for (var i = 0; i < states.length; ++i) {
      stateId = states[i];
      if (target.isStateAffected(stateId)) {
        target.removeState(stateId);
        if (show) this._logWindow.displayActionResults(this._subject, target);
        if (target.isActor()) refresh = true;
      }
    }
  }, this);
  if (refresh) BattleManager.refreshStatus();
  return true;
};

BattleManager.actionSePlay = function(actionArgs) {
  if (actionArgs.length < 1) return true;
  if (actionArgs[0].toUpperCase() === 'PLAY CURSOR') {
    SoundManager.playCursor();
  } else if (actionArgs[0].toUpperCase() === 'PLAY OK') {
    SoundManager.playOk();
  } else if (actionArgs[0].toUpperCase() === 'PLAY CANCEL') {
    SoundManager.playCancel();
  } else if (actionArgs[0].toUpperCase() === 'PLAY BUZZER') {
    SoundManager.playBuzzer();
  } else if (actionArgs[0].toUpperCase() === 'PLAY EQUIP') {
    SoundManager.playEquip();
  } else if (actionArgs[0].toUpperCase() === 'PLAY SAVE') {
    SoundManager.playSave();
  } else if (actionArgs[0].toUpperCase() === 'PLAY LOAD') {
    SoundManager.playLoad();
  } else if (actionArgs[0].toUpperCase() === 'PLAY BATTLE START') {
    SoundManager.playBattleStart();
  } else if (actionArgs[0].toUpperCase() === 'PLAY ESCAPE') {
    SoundManager.playEscape();
  } else if (actionArgs[0].toUpperCase() === 'PLAY ENEMY ATTACK') {
    SoundManager.playEnemyAttack();
  } else if (actionArgs[0].toUpperCase() === 'PLAY ENEMY DAMAGE') {
    SoundManager.playEnemyDamage();
  } else if (actionArgs[0].toUpperCase() === 'PLAY ENEMY COLLAPSE') {
    SoundManager.playEnemyCollapse();
  } else if (actionArgs[0].toUpperCase() === 'PLAY BOSS COLLAPSE 1') {
    SoundManager.playBossCollapse1();
  } else if (actionArgs[0].toUpperCase() === 'PLAY BOSS COLLAPSE 2') {
    SoundManager.playBossCollapse2();
  } else if (actionArgs[0].toUpperCase() === 'PLAY ACTOR DAMAGE') {
    SoundManager.playActorDamage();
  } else if (actionArgs[0].toUpperCase() === 'PLAY ACTOR COLLAPSE') {
    SoundManager.playActorCollapse();
  } else if (actionArgs[0].toUpperCase() === 'PLAY RECOVERY') {
    SoundManager.playRecovery();
  } else if (actionArgs[0].toUpperCase() === 'PLAY MISS') {
    SoundManager.playMiss();
  } else if (actionArgs[0].toUpperCase() === 'PLAY EVASION') {
    SoundManager.playEvasion();
  } else if (actionArgs[0].toUpperCase() === 'PLAY MAGIC EVASION') {
    SoundManager.playMagicEvasion();
  } else if (actionArgs[0].toUpperCase() === 'PLAY REFLECTION') {
    SoundManager.playReflection();
  } else if (actionArgs[0].toUpperCase() === 'PLAY SHOP') {
    SoundManager.playShop();
  } else if (actionArgs[0].toUpperCase() === 'PLAY USE ITEM') {
    SoundManager.playUseItem();
  } else if (actionArgs[0].toUpperCase() === 'PLAY USE SKILL') {
    SoundManager.playUseSkill();
  } else {
    var name = actionArgs[0];
    if (!name) return true;
    var vol = actionArgs[1] || Yanfly.Param.SoundVolume;
    var pitch = actionArgs[2] || Yanfly.Param.SoundPitch;
    var pan = actionArgs[3] || Yanfly.Param.SoundPan;
    var se = {
      name: name,
      volume: vol,
      pitch: pitch,
      pan: pan
    };
    AudioManager.playSe(se);
  }
  return true;
};

BattleManager.actionTpModify = function(actionName, actionArgs) {
    var targets = this.makeActionTargets(actionArgs[0]);
    if (targets.length < 1) return false;
    var change;
    var percent;
    if (actionName.match(/TP[ ]([+-])(?:VARIABLE|VAR)[ ](\d+)/i)) {
      change = parseInt($gameVariables.value(parseInt(RegExp.$2)));
      if (String(RegExp.$1) === '-') change *= -1;
      percent = false;
    } else if
    (actionName.match(/TP[ ]([+-])(?:VARIABLE|VAR)[ ](\d+)([%％])/i)) {
      change = parseInt($gameVariables.value(parseInt(RegExp.$2)));
      if (String(RegExp.$1) === '-') change *= -1;
      percent = true;
    } else if (actionName.match(/TP[ ]([\+\-]\d+)([%％])/i)) {
      change = parseInt(RegExp.$1);
      percent = true;
    } else if (actionName.match(/TP[ ]([\+\-]\d+)/i)) {
      change = parseInt(RegExp.$1);
      percent = false;
    } else {
      return false;
    }
    var show = false;
    for (var i = 0; i < actionArgs.length; ++i) {
      var actionArg = actionArgs[i];
      if (actionArg.toUpperCase() === 'SHOW') show = true;
    }
    var value;
    var refresh = false;
    targets.forEach(function(target) {
      target.clearResult();
      value = percent ? (target.maxTp() * change * 0.01) : change;
      target.gainTp(parseInt(value));
      if (show) {
        target.startDamagePopup();
        this._logWindow.displayActionResults(this._subject, target);
        if (target.isActor()) refresh = true;
      }
    }, this);
    if (refresh) BattleManager.refreshStatus();
    return true;
};

//=============================================================================
// End of File
//=============================================================================
};
