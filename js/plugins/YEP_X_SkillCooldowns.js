//=============================================================================
// Yanfly Engine Plugins - Skill Cost Extension - Cooldowns
// YEP_X_SkillCooldowns.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_X_SkillCooldowns = true;

var Yanfly = Yanfly || {};
Yanfly.SCD = Yanfly.SCD || {};

//=============================================================================
 /*:
 * @plugindesc v1.01 (Requires YEP_SkillCore.js) Cooldowns can be applied
 * to skills to prevent them from being used continuously.
 * @author Yanfly Engine Plugins
 *
 * @param ---Cooldown---
 * @default
 *
 * @param Cooldown Format
 * @desc This is the text format used for cooldowns.
 * %1 - Turns Remaining
 * @default %1CD
 *
 * @param Cooldown Font Size
 * @desc This is the font size used for cooldowns.
 * Default: 28
 * @default 20
 *
 * @param Cooldown Text Color
 * @desc Adjusts the text color used for cooldowns.
 * @default 6
 *
 * @param Cooldown Icon
 * @desc What icon to be used for cooldowns.
 * Use 0 for no icon.
 * @default 75
 *
 * @param Cooldown After Battle
 * @desc How are cooldowns handled after battle?
 * @default -10
 *
 * @param Cooldown Steps
 * @desc Outside of battle, this is how many steps on the map the
 * player must walk to drop each cooldown by 1.
 * @default 5
 *
 * @param Cooldown Bypass
 * @desc This is a list of skills that cannot be on cooldown so that
 * way, skills like Attack, Guard.
 * @default 1 2 3 4 5 6 7
 *
 * @param ---Warmup---
 * @default
 *
 * @param Warmup Format
 * @desc This is the text format used for warmups.
 * %1 - Turns Remaining
 * @default %1WU
 *
 * @param Warmup Font Size
 * @desc This is the font size used for warmups.
 * Default: 28
 * @default 20
 *
 * @param Warmup Text Color
 * @desc Adjusts the text color used for warmups.
 * @default 4
 *
 * @param Warmup Icon
 * @desc What icon to be used for warmups.
 * Use 0 for no icon.
 * @default 75
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires YEP_SkillCore.
 * Make sure this plugin is located under YEP_SkillCore in the plugin list.
 *
 * This plugin allows you to give your skills cooldowns. Cooldowns are a limit
 * enforced on a skill to prevent them from being used constantly.
 *
 * ============================================================================
 * Cooldown Types
 * ============================================================================
 *
 * Cooldown (Standard)
 * The standard cooldown only occurs if the skill has a cooldown to pay. When
 * used, the skill cannot be used for x turns as indicated by the cooldown.
 * There are a number of things that contribute to cooldowns going down. The
 * first would be simply waiting. Each turn in battle causes a cooldown to
 * drop by 1 turn. Skills and the such can be used to speed up this process.
 * The second would be to finish battles. Finishing a battle will cause all
 * cooldowns to drop by a certain amount (can be defined in the parameters).
 * And the third would be walking on the field map. Every certain amount of
 * steps allow a skill's cooldown to decrease.
 *
 * Warmups
 * As far as most things go, Warmups do the same thing as Cooldowns: prevent
 * skills from being used until their timer is up. The difference, however, is
 * that warmups only occur once during battle: at the very start of it. If a
 * skill has a warmup timer, it will trigger the moment it goes into battle
 * and instantly disappear after battle. Warmups do not stack on top of any
 * existing cooldowns. If a cooldown is already occurring when a skill is in
 * the warmup phase, both the warmup and cooldown simultaneously update.
 *
 * Linked Cooldowns
 * A linked cooldown occurs when a skill that's used causes another skill in
 * the owner's skill library to have a cooldown. All other attributes of this
 * cooldown are the same as a standard cooldown's. This cooldown type will take
 * priority over Skill Type Cooldowns and Global Cooldowns if this value is
 * defined.
 *
 * Skill Type Cooldowns
 * When a Skill Type Cooldown occurs, all skills currently in the battler's
 * skill library with the matching Skill Type will be on cooldown. All other
 * attributes of this cooldown are the same as a standard cooldown's. This
 * cooldown type will take priority over Global Cooldowns if this value is
 * defined.
 *
 * When a cooldown is applied for a skill that already has a cooldown, the
 * cooldown will change to whatever is the largest value. This means if a
 * skill has 3 turns for a cooldown and a Skill Type Cooldown would set for
 * 1 turn, the 3 turns would remain. On the flip side, if the skill has 3 turns
 * and the Skill Type Cooldown would set for 5 turns, then the cooldown would
 * be changed to 5 turns instead.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Use the following notetags to alter the cooldown properties of a skill.
 *
 * Skill Notetags:
 *   <Cooldown: x>
 *   Sets the cooldown for the skill to X turns. This cooldown only affects
 *   this skill alone. This value will take priority over Skill Type Cooldowns
 *   and Global Cooldowns.
 *
 *   <After Battle Cooldown: +x>
 *   <After Battle Cooldown: -x>
 *   After a battle ends (victory, loss, or escape), change the cooldown for
 *   this skill by +x turns or -x turns.
 *
 *   <Cooldown Steps: x>
 *   Outside of battle, every x steps that the Player takes, this skill's
 *   cooldown will drop by 1.
 *
 *   <Skill x Cooldown: y>
 *   When using this skill, after paying the skill cost, skill x will have a
 *   linked cooldown of y turns. This value will take priority over Skill Type
 *   Cooldowns and Global Cooldowns.
 *
 *   <SType x Cooldown: y>
 *   When using this skill, after paying the skill cost, all skills with the
 *   matching Skill Type x to have a cooldown of y. This value will take
 *   priority over Global Cooldowns.
 *
 *   <Global Cooldown: x>
 *   When using this skill, all skills within the battler's skill library area
 *   set to be on cooldown for x turns. This value has less priority than
 *   Individual Cooldowns and Skill Type Cooldowns.
 *
 *   <Bypass Cooldown>
 *   This causes the skill to bypass cooldowns, no matter what. This should be
 *   used for skills like Attack, Guard, Escape, etc. that should not have a
 *   cooldown assigned to them.
 *
 * Skill and Item Notetags:
 *   <Skill x Cooldown: +y>
 *   <Skill x Cooldown: -y>
 *   Targets hit by this skill will have skill x's cooldown adjusted by y.
 *   This does not apply to the user and applies only to the targets.
 *
 *   <SType x Cooldown: +y>
 *   <SType x Cooldown: -y>
 *   Targets hit by this skill will have all skills in their skill library with
 *   Skill Type x to have their cooldowns adjusted by y. This does not apply to
 *   the user and applies only to the targets.
 *
 *   <Global Cooldown: +x>
 *   <Global Cooldown: -x>
 *   Targets hit by this skill will have all skills in their skill library to
 *   have their cooldowns adjusted by y. This does not apply to the user and
 *   applies only to the targets.
 *
 * Actor, Class, Enemy, Weapon, Armor, and State Notetags:
 *
 *   <Skill x Cooldown Duration: y%>
 *   Alters the cooldown duration of skill x to y% when the cooldown cost is
 *   applied. This effect only applies to skill x.
 *
 *   <SType x Cooldown Duration: y%>
 *   Alters the cooldown duration of skills with Skill Type x to y% when the
 *   cooldown cost is applied. This effect only applies to Skill Type x.
 *
 *   <Global Cooldown Duration: x%>
 *   Alters the cooldown duration of all skills to x% when the cooldown cost
 *   is applied.
 *
 *   <Skill x Cooldown Rate: y%>
 *   Sets the cooldown rate for skill x to y% when the cooldown counter goes
 *   down. This effect only applies to skill x.
 *
 *   <SType x Cooldown Rate: y%>
 *   Sets the cooldown rate for Skill Type x skills to y% when the cooldown
 *   counter goes down. This effect only applies to Skill Type x skills.
 *
 *   <Global Cooldown Rate: x%>
 *   Sets the cooldown rate for all skills to x% when the cooldown counter
 *   goes down.
 *
 *   <Skill x Cooldown: +y>
 *   <Skill x Cooldown: -y>
 *   If the user performs skill x, it will have an increased or decreased
 *   cooldown value as long as the user is the actor, class, enemy, or has the
 *   weapon or armor equipped, or is affected by the state with this notetag.
 *   These flat cooldown modifications are applied after the rates and duration
 *   modifiers have been calculated.
 *
 *   <SType x Cooldown: +y>
 *   <SType x Cooldown: -y>
 *   If the user performs skill with skill type x, it will have an increased or
 *   decreased cooldown value as long as the user is the actor, class, enemy,
 *   or has the weapon or armor equipped, or is affected by the state with this
 *   notetag. These flat cooldown modifications are applied after the rates and
 *   duration modifiers have been calculated.
 *
 *   <Global Cooldown: +x>
 *   <Global Cooldown: -x>
 *   If the user performs any skill, it will have an increased or decreased
 *   cooldown value as long as the user is the actor, class, enemy, or has the
 *   weapon or armor equipped, or is affected by the state with this notetag.
 *   These flat cooldown modifications are applied after the rates and duration
 *   modifiers have been calculated.
 *
 *   <Skill x Warmup: +y>
 *   <Skill x Warmup: -y>
 *   At the start of battle, skill x will have an increased or decreased warmup
 *   value as long as the user is the actor, class, enemy, or has the weapon or
 *   armor equipped, or is affected by the state with this notetag. These flat
 *   warmup modifications are applied after the rates and duration modifiers
 *   have been calculated.
 *
 *   <SType x Warmup: +y>
 *   <SType x Warmup: -y>
 *   At the start of battle, all skills with skill type x it will have an
 *   increased or decreased warmup value as long as the user is the actor,
 *   class, enemy, or has the weapon or armor equipped, or is affected by the
 *   state with this notetag. These flat warmup modifications are applied after
 *   the rates and duration modifiers have been calculated.
 *
 *   <Global Warmup: +x>
 *   <Global Warmup: -x>
 *   At the start of battle, all skills will have an increased or decreased
 *   warmup value as long as the user is the actor, class, enemy, or has the
 *   weapon or armor equipped, or is affected by the state with this notetag.
 *   These flat warmup modifications are applied after the rates and duration
 *   modifiers have been calculated.
 *
 * ============================================================================
 * Lunatic Mode - Specialized Cooldowns
 * ============================================================================
 *
 * For skills, you can set cooldowns to have a special code determine its value
 * when the skill is used.
 *
 * Skill Notetag
 *   <Cooldown Eval>
 *   cooldown = x;
 *   cooldown += x;
 *   </Cooldown Eval>
 *   Insert these two tags into the skill's notebox to give it a unique way to
 *   determine the cooldown's value. The 'cooldown' variable determines the
 *   amount of turns for the cooldown.
 *
 *   <Warmup Eval>
 *   warmup = x;
 *   warmup += x;
 *   </Warmup Eval>
 *   Insert these two tags into the skill's notebox to give it a unique way to
 *   determine the warmup's value. The 'warmup' variable determines the amount
 *   of turns for the warmup.
 *
 * ============================================================================
 * Yanfly Engine Plugins - Battle Engine Extension - Action Sequence Commands
 * ============================================================================
 *
 * If you have YEP_BattleEngineCore.js installed with this plugin located
 * underneath it in the Plugin Manager, you can make use of these extra
 * cooldown related action sequences.
 *
 *=============================================================================
 * GLOBAL COOLDOWN: targets, +X
 * GLOBAL COOLDOWN: targets, -X
 * GLOBAL COOLDOWN: targets, X
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Sets the cooldown for all of the targets to be adjusted by X value. This
 * applies to every skill that doesn't bypass cooldowns.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: global cooldown: target, +5
 *                global cooldown: user, -3
 *                global cooldown: enemies, 10
 *=============================================================================
 *
 *=============================================================================
 * SKILL X COOLDOWN: targets, +Y
 * SKILL X COOLDOWN: targets, -Y
 * SKILL X COOLDOWN: targets, Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes skill X to be adjusted by Y value for the targets. This only applies
 * the specific skill x's cooldown.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: skill 10 cooldown: target, +5
 *                skill 12 cooldown: user, -3
 *                skill 15 cooldown: enemies, 10
 *=============================================================================
 *
 *=============================================================================
 * SKILL TYPE X COOLDOWN: targets, +Y
 * SKILL TYPE X COOLDOWN: targets, -Y
 * SKILL TYPE X COOLDOWN: targets, Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causes skill type X skills to be adjusted by Y value for the targets. This
 * only applies the specific skill type x skill's cooldown.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: skill type 1 cooldown: target, +5
 *                skill type 2 cooldown: user, -3
 *                skill type 5 cooldown: enemies, 10
 *=============================================================================
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.01:
 * - Cooldowns can now be applied to skills that aren't learned by the actor.
 *
 * Version 1.00:
 * - Finished plugin!
 */
 /*:ja
 * @plugindesc スキルが連続で使われるのを防ぐため、
 * クールダウンのシステムを導入できます。
 * @author Yanfly Engine Plugins
 *
 * @param ---クールダウン---
 * @default
 *
 * @param Cooldown Format
 * @desc クールダウンの表示テキストを指定します。
 * %1 - 残りターン数
 * @default %1CD
 *
 * @param Cooldown Font Size
 * @desc クールダウン表示のフォントサイズを指定します。
 * Default: 28
 * @default 20
 *
 * @param Cooldown Text Color
 * @desc クールダウン表示のフォントカラーを指定します。
 * @default 6
 *
 * @param Cooldown Icon
 * @desc クールダウン表示に使われるアイコンを指定します。
 * 0を入力するとアイコン無しになります。
 * @default 75
 *
 * @param Cooldown After Battle
 * @desc 戦闘後にクールダウンがどのように扱われるかを指定します。
 * @default -10
 *
 * @param Cooldown Steps
 * @desc 戦闘中以外で、マップ上でクールダウンを 1 するために必要な歩数を指定します。
 * @default 5
 *
 * @param Cooldown Bypass
 * @desc クールダウンの影響を受けないスキルを指定します。(例えば攻撃/防御など)
 * @default 1 2 3 4 5 6 7
 *
 * @param ---ウォームアップ---
 * @default
 *
 * @param Warmup Format
 * @desc ウォームアップの表示テキストを指定します。
 * %1 - 残りターン数
 * @default %1WU
 *
 * @param Warmup Font Size
 * @desc ウォームアップ表示のフォントサイズを指定します。
 * Default: 28
 * @default 20
 *
 * @param Warmup Text Color
 * @desc ウォームアップ表示のフォントカラーを指定します。
 * @default 4
 *
 * @param Warmup Icon
 * @desc ウォームアップ表示に使われるアイコンを指定します。
 * 0を入力するとアイコン無しになります。
 * @default 75
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * このプラグインを利用するには、YEP_SkillCoreが必要です。
 * リスト内ではYEP_SkillCoreの下にこのプラグインが来るようにしてください。
 *
 * このプラグインで、スキルに「クールダウン」を導入できます。
 * これにより、対象スキルの連続使用を制限することができます。
 *
 * ============================================================================
 * Cooldown Types　タイプ別説明
 * ============================================================================
 *
 * Cooldown (Standard)
 * この機能が働くと、特定のターンの間そのスキルを使うことができません。
 * また、クールダウンをさせるための方法はいくつもあります。
 * まずは、ただ単純に待つという方法。バトル中、各ターンごとにクールダウンが
 * 進行します。スキルなどで、これを早めることもできます。
 * 2つ目の方法は、戦闘を終了することです。戦闘終了によって、全てのクールダウンを
 * 特定の値だけ進行させることができます。(値はパラメータで指定可能)
 * 3つ目の方法は、フィールドマップを歩き回ることです。特定の歩数を歩くことで
 * スキルのクールダウンを行なうことができます。
 *
 * Warmups
 * ウォームアップは、クールダウンと同様の働きを持ちます。一定の時間が経つまで
 * スキルを使わせないようにするのです。しかしクールダウンと異なる点として、
 * ウォームアップは戦闘の最初に一度だけ起こる、という点が挙げられます。
 * ウォームアップタイマーにより、バトルでそのスキルが使われるタイミングを
 * 制限することができ、またそれは戦闘終了後は一時的に消え去ります。
 * ウォームアップは、既存のクールダウン上に重ねられることは有りません。 
 * スキルがウォームアップ段階の際にクールダウンがすでに起こっている場合は、
 * 両方が同時にアップデートされます。
 *
 * Linked Cooldowns
 * A linked cooldown は、使用されたスキルが、ライブラリにクールダウンを持った
 * 他のスキルを発動させたときに起こります。このクールダウンの他の特性は、
 * 通常のクールダウン(前述)と同様のものです。このクールダウンタイプは、
 * スキルタイプクールダウン(後述)やグローバルクールダウンよりも優先されます。
 *
 * Skill Type Cooldowns
 * スキルタイプクールダウンが起こると、バトラーのスキルライブラリ内で該当する
 * 全てのスキルが、クールダウンの対象となります。このクールダウンの他の特性は、
 * 通常のクールダウン(前述)と同様のものです。このクールダウンタイプは、
 * グローバルクールダウンよりも優先されます。
 *
 * 既にクールダウンを持つスキルに、さらに別のクールダウンが適用されるときは、
 * 常に最大値が採用されます。つまり、もしスキルが3ターンのクールダウンを持ち、
 * スキルタイプクールダウンは1に設定されていた時、3ターンの方が採用されます。
 * 同様に、もしスキルが3ターン、スキルタイプクールダウンが5ターンだった際は、
 * 5ターンの方が採用されます。
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * スキルのクールダウンを変更するには下記のNotetagを用いてください。
 *
 * スキルのNotetags:
 *   <Cooldown: x>
 *   スキルに対するクールダウンを x ターンに設定します。このクールダウンは、
 *   このスキルにのみ単独で有効です。この値はスキルタイプクールダウンや
 *   グローバルクールダウンより優先されます。
 *
 *   <After Battle Cooldown: +x>
 *   <After Battle Cooldown: -x>
 *   戦闘終了後(勝利/敗北/逃走)、 +x もしくは -x だけ、スキルのクールダウン数を
 *   増減させます。
 *
 *   <Cooldown Steps: x>
 *   戦闘外で、毎 x 歩ごとにスキルのクールダウンが 1 進行します。
 *
 *   <Skill x Cooldown: y>
 *   このスキルを使う時、スキルコストを消費した後で、 x というスキルは
 *   ターン数 y のlinked cooldownを持ちます。この値はスキルタイプクールダウンや
 *   グローバルクールダウンより優先されます。
 *
 *   <SType x Cooldown: y>
 *   このスキルを使う時、スキルコストを消費した後で、x に該当するタイプを持つ
 *   スキルは、ターン数 y のクールダウンを持ちます。この値はグローバル
 *   クールダウンより優先されます。
 *
 *   <Global Cooldown: x>
 *   このスキルを使うとき、バトラーのライブラリにある全てのスキルには、
 *   ターン数 x のクールダウンが課せられます。この値は個々のクールダウンや
 *   スキルタイプクールダウンよりも低い優先度として扱われます。
 *
 *   <Bypass Cooldown>
 *   その種類に関わらずスキルにクールダウンを無視させることができます。 
 *   攻撃、防御、逃走など、クールダウンを適用すべきでないスキルに使ってください。
 *
 * スキルとアイテムのNotetags:
 *   <Skill x Cooldown: +y>
 *   <Skill x Cooldown: -y>
 *   このスキルにヒットしたターゲットのスキル x が y の値で調整されます。
 *   これは使用者には無効で、ターゲットのみに有効です。
 *
 *   <SType x Cooldown: +y>
 *   <SType x Cooldown: -y>
 *   このスキルにヒットしたターゲットについて、スキルライブラリ内の x という
 *   タイプのクールダウンが y の値で調整されます。使用者には無効で、
 *   ターゲットのみに有効です。
 *
 *   <Global Cooldown: +x>
 *   <Global Cooldown: -x>
 *   このスキルにヒットしたターゲットについて、スキルライブラリ内の全てのスキル
 *   のクールダウンが y の値で調整されます。使用者には無効で、
 *   ターゲットのみに有効です。
 *
 * アクター、職業、敵、武器、防具、ステートのNotetags:
 *
 *   <Skill x Cooldown Duration: y%>
 *   クールダウンのコストが適用された際、スキル x のクールダウン持続時間を、
 *   y% に変更します。これはスキル x にのみ作用します。
 *
 *   <SType x Cooldown Duration: y%>
 *   クールダウンのコストが適用された際、タイプ x のスキルのクールダウン
 *   持続時間を y% に変更します。これはスキル x にのみ作用します。
 *
 *   <Global Cooldown Duration: x%>
 *   クールダウンのコストが適用された際、全てのスキルのクールダウン持続時間を
 *   x% に変更します。
 *
 *   <Skill x Cooldown Rate: y%>
 *   クールダウンカウンターが下がった際、スキル x に対するクールダウンレートを
 *   y% に変更します。これはスキル x にのみ作用します。
 *
 *   <SType x Cooldown Rate: y%>
 *   クールダウンカウンターが下がった際、タイプ x のスキルのクールダウンレートを
 *   y% に変更します。これはスキルタイプ x にのみ作用します。
 *
 *   <Global Cooldown Rate: x%>
 *   クールダウンカウンターが下がった際、全てのスキルのクールダウンレートを
 *   x% に変更します。
 *
 *   <Skill x Cooldown: +y>
 *   <Skill x Cooldown: -y>
 *   ユーザーが x というスキルを使った場合、そのスキルのクールダウンの値は
 *   増加、または減少します。これはユーザーがアクター、職業、クラス、敵である、
 *   またはその武器や防具を身に着けている、もしくはこのNotetagを持ったステートに
 *   影響を受けている時に発動します。これらの修正はレートと持続時間の計算が
 *   完了した際に適用されます。
 *
 *   <SType x Cooldown: +y>
 *   <SType x Cooldown: -y>
 *   ユーザーが x タイプのスキルを使った場合、そのスキルのクールダウンの値は
 *   増加、または減少します。これはユーザーがアクター、職業、クラス、敵である、
 *   またはその武器や防具を身に着けている、もしくはこのNotetagを持ったステートに
 *   影響を受けている時に発動します。これらの修正はレートと持続時間の計算が
 *   完了した際に適用されます。
 *
 *   <Global Cooldown: +x>
 *   <Global Cooldown: -x>
 *   ユーザーがスキルを使った場合(種類問わず)、そのスキルのクールダウンの値は
 *   増加、または減少します。これはユーザーがアクター、職業、クラス、敵である、
 *   またはその武器や防具を身に着けている、もしくはこのNotetagを持ったステートに
 *   影響を受けている時に発動します。これらの修正はレートと持続時間の計算が
 *   完了した際に適用されます。
 *
 *   <Skill x Warmup: +y>
 *   <Skill x Warmup: -y>
 *   バトル開始時、スキル x のウォームアップの値は増加、または減少します。
 *   これはユーザーがアクター、職業、クラス、敵である、
 *   またはその武器や防具を身に着けている、もしくはこのNotetagを持ったステートに
 *   影響を受けている時に発動します。これらの修正はレートと持続時間の計算が
 *   完了した際に適用されます。
 *
 *   <SType x Warmup: +y>
 *   <SType x Warmup: -y>
 *   バトル開始時、x タイプの全てのスキルのウォームアップの値は
 *   増加、または減少します。これはユーザーがアクター、職業、クラス、敵である、
 *   またはその武器や防具を身に着けている、もしくはこのNotetagを持ったステートに
 *   影響を受けている時に発動します。これらの修正はレートと持続時間の計算が
 *   完了した際に適用されます
 *
 *   <Global Warmup: +x>
 *   <Global Warmup: -x>
 *   バトル開始時、全てのスキルのウォームアップの値は
 *   増加、または減少します。これはユーザーがアクター、職業、クラス、敵である、
 *   またはその武器や防具を身に着けている、もしくはこのNotetagを持ったステートに
 *   影響を受けている時に発動します。これらの修正はレートと持続時間の計算が
 *   完了した際に適用されます
 *
 * ============================================================================
 * Lunatic Mode - Specialized Cooldowns
 * ============================================================================
 *
 * 特殊なコードを用いて、スキルが使われる際のクールダウンの値を
 * 指定することができます。
 *
 * スキルのNotetag
 *   <Cooldown Eval>
 *   cooldown = x;
 *   cooldown += x;
 *   </Cooldown Eval>
 *   スキルのノートボックスに上記のタグを挿入し、クールダウンに必要なターン数
 *   を決定する方法を指定します。
 *
 *   <Warmup Eval>
 *   warmup = x;
 *   warmup += x;
 *   </Warmup Eval>
 *   スキルのノートボックスに上記のタグを挿入し、ウォームアップに必要なターン数
 *   を決定する方法を指定します。
 *
 * ============================================================================
 * Yanfly Engine Plugins - Battle Engine Extension - Action Sequence Commands
 * ============================================================================
 *
 * プラグインマネージャーに、このプラグインと共にYEP_BattleEngineCore.jsを、
 * 入れていれば、下記のクールダウン関連のアクションシーケンスも利用できます。
 *
 *=============================================================================
 * GLOBAL COOLDOWN: targets, +X
 * GLOBAL COOLDOWN: targets, -X
 * GLOBAL COOLDOWN: targets, X
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * x の値で、クールダウンを全てのターゲットに設定できます。クールダウンが有効な
 * 全てのスキルに対して適用されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: global cooldown: target, +5
 *         global cooldown: user, -3
 *         global cooldown: enemies, 10
 *=============================================================================
 *
 *=============================================================================
 * SKILL X COOLDOWN: targets, +Y
 * SKILL X COOLDOWN: targets, -Y
 * SKILL X COOLDOWN: targets, Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットに対して、X というスキルに Y の値でクールダウンを付与します。
 * 特定のスキル X にのみ適用されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: skill 10 cooldown: target, +5
 *      　 skill 12 cooldown: user, -3
 *         skill 15 cooldown: enemies, 10
 *=============================================================================
 *
 *=============================================================================
 * SKILL TYPE X COOLDOWN: targets, +Y
 * SKILL TYPE X COOLDOWN: targets, -Y
 * SKILL TYPE X COOLDOWN: targets, Y
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * ターゲットに対して、X というスキルタイプに Y の値でクールダウンを付与します。
 * 特定のスキル X にのみ適用されます。
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 使用例: skill type 1 cooldown: target, +5
 *         skill type 2 cooldown: user, -3
 *         skill type 5 cooldown: enemies, 10
 *=============================================================================
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.01:
 * - Cooldowns can now be applied to skills that aren't learned by the actor.
 *
 * Version 1.00:
 * - Finished plugin!
 */
 
 
//=============================================================================

if (Imported.YEP_SkillCore) {

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_X_SkillCooldowns');
Yanfly.Param = Yanfly.Param || {};
Yanfly.Icon = Yanfly.Icon || {};

Yanfly.Param.CDFmt = String(Yanfly.Parameters['Cooldown Format']);
Yanfly.Param.CDFontSize = Number(Yanfly.Parameters['Cooldown Font Size']);
Yanfly.Param.CDTextColor = Number(Yanfly.Parameters['Cooldown Text Color']);
Yanfly.Icon.Cooldown = Number(Yanfly.Parameters['Cooldown Icon']);
Yanfly.Param.CDAfterBattle = String(Yanfly.Parameters['Cooldown After Battle']);
Yanfly.Param.CDSteps = Number(Yanfly.Parameters['Cooldown Steps']);
Yanfly.Param.CDBypass = String(Yanfly.Parameters['Cooldown Bypass']);
Yanfly.Param.CDBypass = Yanfly.Param.CDBypass.split(' ');
for (Yanfly.i = 0; Yanfly.i < Yanfly.Param.CDBypass.length; ++Yanfly.i) {
	Yanfly.Param.CDBypass[Yanfly.i] = parseInt(Yanfly.Param.CDBypass[Yanfly.i]);
}
Yanfly.Param.WUFmt = String(Yanfly.Parameters['Warmup Format']);
Yanfly.Param.WUFontSize = Number(Yanfly.Parameters['Warmup Font Size']);
Yanfly.Param.WUTextColor = Number(Yanfly.Parameters['Warmup Text Color']);
Yanfly.Icon.Warmup = Number(Yanfly.Parameters['Warmup Icon']);

//=============================================================================
// DataManager
//=============================================================================

Yanfly.SCD.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Yanfly.SCD.DataManager_isDatabaseLoaded.call(this)) return false;
		this.processSCDNotetags1($dataSkills);
		this.processSCDNotetags2($dataSkills);
		this.processSCDNotetags2($dataItems);
		this.processSCDNotetags2($dataActors);
		this.processSCDNotetags2($dataClasses);
		this.processSCDNotetags2($dataEnemies);
		this.processSCDNotetags2($dataWeapons);
		this.processSCDNotetags2($dataArmors);
		this.processSCDNotetags2($dataStates);
		this.processSCDNotetags3($dataActors);
		this.processSCDNotetags3($dataClasses);
		this.processSCDNotetags3($dataEnemies);
		this.processSCDNotetags3($dataWeapons);
		this.processSCDNotetags3($dataArmors);
		this.processSCDNotetags3($dataStates);
		return true;
};

DataManager.processSCDNotetags1 = function(group) {
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

    obj.cooldown = {};
		obj.stypeCooldown = {}
		obj.globalCooldown = 0;
		obj.afterBattleCooldown = eval(Yanfly.Param.CDAfterBattle);
		obj.cooldownSteps = Math.max(1, parseInt(Yanfly.Param.CDSteps));
		obj.warmup = 0;
		obj.bypassCooldown = Yanfly.Param.CDBypass.contains(obj.id);
		obj.cooldownEval = '';
		obj.warmupEval = '';
		var evalMode = 'none';

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(/<(?:COOLDOWN):[ ](\d+)>/i)) {
				obj.cooldown[obj.id] = parseInt(RegExp.$1);
			} else if (line.match(/<(?:AFTER BATTLE COOLDOWN):[ ]([\+\-]\d+)>/i)) {
				obj.afterBattleCooldown = parseInt(RegExp.$1);
			} else if (line.match(/<(?:COOLDOWN STEPS):[ ](\d+)>/i)) {
				obj.cooldownSteps = parseInt(RegExp.$1);
			} else if (line.match(/<(?:WARMUP):[ ](\d+)>/i)) {
				obj.warmup = parseInt(RegExp.$1);
			} else if (line.match(/<(?:SKILL)[ ](\d+)[ ](?:COOLDOWN):[ ](\d+)>/i)) {
				obj.cooldown[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(/<(?:STYPE)[ ](\d+)[ ](?:COOLDOWN):[ ](\d+)>/i)) {
				obj.stypeCooldown[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(/<(?:GLOBAL COOLDOWN):[ ](\d+)>/i)) {
				obj.globalCooldown = parseInt(RegExp.$1);
			} else if (line.match(/<(?:BYPASS COOLDOWN)>/i)) {
				obj.bypassCooldown = true;
			} else if (line.match(/<(?:COOLDOWN EVAL)>/i)) {
				evalMode = 'cooldown';
			} else if (line.match(/<\/(?:COOLDOWN EVAL)>/i)) {
				evalMode = 'none';
			} else if (line.match(/<(?:WARMUP EVAL)>/i)) {
				evalMode = 'warmup';
			} else if (line.match(/<\/(?:WARMUP EVAL)>/i)) {
				evalMode = 'none';
			} else if (evalMode === 'cooldown') {
				obj.cooldownEval = obj.cooldownEval + line + '\n';
			} else if (evalMode === 'warmup') {
				obj.warmupEval = obj.warmupEval + line + '\n';
			}
		}
	}
};

DataManager.processSCDNotetags2 = function(group) {
	var note1 = /<(?:SKILL)[ ](\d+)[ ](?:COOLDOWN):[ ]([\+\-]\d+)>/i;
	var note2 = /<(?:STYPE)[ ](\d+)[ ](?:COOLDOWN):[ ]([\+\-]\d+)>/i;
	var note3 = /<(?:GLOBAL COOLDOWN):[ ]([\+\-]\d+)>/i;
	var note4 = /<(?:SKILL)[ ](\d+)[ ](?:WARMUP):[ ]([\+\-]\d+)>/i;
	var note5 = /<(?:STYPE)[ ](\d+)[ ](?:WARMUP):[ ]([\+\-]\d+)>/i;
	var note6 = /<(?:GLOBAL WARMUP):[ ]([\+\-]\d+)>/i;
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

    obj.cooldownChange = {};
		obj.stypeCooldownChange = {};
		obj.globalCooldownChange = 0;
		obj.warmupChange = {};
		obj.stypeWarmupChange = {};
		obj.globalWarmupChange = 0;

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note1)) {
				obj.cooldownChange[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note2)) {
				obj.stypeCooldownChange[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note3)) {
				obj.globalCooldownChange = parseInt(RegExp.$1);
			} else if (line.match(note4)) {
				obj.warmupChange[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note5)) {
				obj.stypeWarmupChange[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note6)) {
				obj.globalWarmupChange = parseInt(RegExp.$1);
			}
		}
	}
};

DataManager.processSCDNotetags3 = function(group) {
	var note1 = /<(?:SKILL)[ ](\d+)[ ](?:COOLDOWN DURATION):[ ](\d+)([%％])>/i;
	var note2 = /<(?:STYPE)[ ](\d+)[ ](?:COOLDOWN DURATION):[ ](\d+)([%％])>/i;
	var note3 = /<(?:GLOBAL COOLDOWN DURATION):[ ](\d+)([%％])>/i;
	var note4 = /<(?:SKILL)[ ](\d+)[ ](?:COOLDOWN RATE):[ ](\d+)([%％])>/i;
	var note5 = /<(?:STYPE)[ ](\d+)[ ](?:COOLDOWN RATE):[ ](\d+)([%％])>/i;
	var note6 = /<(?:GLOBAL COOLDOWN RATE):[ ](\d+)([%％])>/i;
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

    obj.cooldownDuration = {};
		obj.stypeCooldownDuration = {};
		obj.globalCooldownDuration = 1.0;
		obj.cooldownRate = {};
		obj.stypeCooldownRate = {};
		obj.globalCooldownRate = 1.0;

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note1)) {
				obj.cooldownDuration[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note2)) {
				obj.stypeCooldownDuration[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note3)) {
				obj.globalCooldownDuration = parseFloat(RegExp.$1 * 0.01);
			} else if (line.match(note4)) {
				obj.cooldownRate[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note5)) {
				obj.stypeCooldownRate[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
			} else if (line.match(note6)) {
				obj.globalCooldownRate = parseFloat(RegExp.$1 * 0.01);
			}
		}
	}
};

//=============================================================================
// BattleManager
//=============================================================================

Yanfly.SCD.BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    Yanfly.SCD.BattleManager_endBattle.call(this, result);
		$gameParty.endBattleCooldowns();
};

if (Imported.YEP_BattleEngineCore) {
Yanfly.SCD.BattleManager_processActionSequence =
  BattleManager.processActionSequence;
  BattleManager.processActionSequence = function(actionName, actionArgs) {
		// GLOBAL COOLDOWN
    if (actionName === 'GLOBAL COOLDOWN') {
      return this.actionGlobalCooldown(actionArgs);
    }
		// SKILL COOLDOWN
    if (actionName.match(/SKILL[ ](\d+)[ ]COOLDOWN/i)) {
      return this.actionSkillCooldown(parseInt(RegExp.$1), actionArgs);
    }
		// SKILL TYPE COOLDOWN
		if (actionName.match(/SKILL[ ]TYPE[ ](\d+)[ ]COOLDOWN/i)) {
			return this.actionSTypeCooldown(parseInt(RegExp.$1), actionArgs);
		}
		// STYPE COOLDOWN
    if (actionName.match(/STYPE[ ](\d+)[ ]COOLDOWN/i)) {
      return this.actionSTypeCooldown(parseInt(RegExp.$1), actionArgs);
    }
    return Yanfly.SCD.BattleManager_processActionSequence.call(this,
      actionName, actionArgs);
  };
};

BattleManager.actionGlobalCooldown = function(actionArgs) {
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return true
		var cmd = actionArgs[1];
		if (cmd.match(/([\+\-]\d+)/i)) {
			var value = parseInt(RegExp.$1);
			for (var t = 0; t < targets.length; ++t) {
				var target = targets[t];
				for (var i = 0; i < target.skills().length; ++i) {
					var skill = target.skills()[i];
					if (skill) {
						target.addCooldown(skill.id, value);
					}
				}
			}
		} else if (cmd.match(/(\d+)/i)) {
			var value = parseInt(RegExp.$1);
			for (var t = 0; t < targets.length; ++t) {
				var target = targets[t];
				for (var i = 0; i < target.skills().length; ++i) {
					var skill = target.skills()[i];
					if (skill) {
						target.setCooldown(skill.id, value);
					}
				}
			}
		} else {
			return true;
		}
    return true;
};

BattleManager.actionSkillCooldown = function(skillId, actionArgs) {
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return true
		var cmd = actionArgs[1];
		if (cmd.match(/([\+\-]\d+)/i)) {
			var value = parseInt(RegExp.$1);
			for (var t = 0; t < targets.length; ++t) {
				var target = targets[t];
				target.addCooldown(skillId, value);
			}
		} else if (cmd.match(/(\d+)/i)) {
			var value = parseInt(RegExp.$1);
			for (var t = 0; t < targets.length; ++t) {
				var target = targets[t];
				target.setCooldown(skillId, value);
			}
		} else {
			return true;
		}
    return true;
};

BattleManager.actionSTypeCooldown = function(stypeId, actionArgs) {
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return true
		var cmd = actionArgs[1];
		if (cmd.match(/([\+\-]\d+)/i)) {
			var value = parseInt(RegExp.$1);
			for (var t = 0; t < targets.length; ++t) {
				var target = targets[t];
				for (var i = 0; i < target.skills().length; ++i) {
					var skill = target.skills()[i];
					if (skill && skill.stypeId === stypeId) {
						target.addCooldown(skill.id, value);
					}
				}
			}
		} else if (cmd.match(/(\d+)/i)) {
			var value = parseInt(RegExp.$1);
			for (var t = 0; t < targets.length; ++t) {
				var target = targets[t];
				for (var i = 0; i < target.skills().length; ++i) {
					var skill = target.skills()[i];
					if (skill && skill.stypeId === stypeId) {
						target.setCooldown(skill.id, value);
					}
				}
			}
		} else {
			return true;
		}
    return true;
};

//=============================================================================
// Game_Battler
//=============================================================================

Yanfly.SCD.Game_BattlerBase_initMembers =
		Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
    Yanfly.SCD.Game_BattlerBase_initMembers.call(this);
		this.clearCooldowns();
		this.clearWarmups();
};

Game_BattlerBase.prototype.clearCooldowns = function() {
    this._cooldownTurns = {};
};

Game_BattlerBase.prototype.clearWarmups = function() {
    this._warmupTurns = {};
};

Game_BattlerBase.prototype.cooldown = function(skillId) {
    if (this._cooldownTurns === undefined) this.clearCooldowns();
		if (this._cooldownTurns[skillId] === undefined) {
			this._cooldownTurns[skillId] = 0;
		}
		return this._cooldownTurns[skillId];
};

Game_BattlerBase.prototype.warmup = function(skillId) {
    if (this._warmupTurns === undefined) this.clearWarmups();
		if (this._warmupTurns[skillId] === undefined) {
			this._warmupTurns[skillId] = 0;
		}
		return this._warmupTurns[skillId];
};

Game_BattlerBase.prototype.setCooldown = function(skillId, value) {
    if (!$dataSkills[skillId]) return;
		if ($dataSkills[skillId].bypassCooldown) return;
		if (this._cooldownTurns === undefined) this.clearCooldowns();
		this._cooldownTurns[skillId] = value;
};

Game_BattlerBase.prototype.addCooldown = function(skillId, value) {
    if (!$dataSkills[skillId]) return;
		if ($dataSkills[skillId].bypassCooldown) return;
		if (this._cooldownTurns === undefined) this.clearCooldowns();
		this._cooldownTurns[skillId] += value;
};

Game_BattlerBase.prototype.setWarmup = function(skillId, value) {
		if (!$dataSkills[skillId]) return;
		if ($dataSkills[skillId].bypassCooldown) return;
		if (this._warmupTurns === undefined) this.clearWarmups();
		this._warmupTurns[skillId] = value;
};

Game_BattlerBase.prototype.startWarmups = function() {
    if (this._warmupTurns === undefined) this.clearWarmups();
		for (var i = 0; i < this.skills().length; ++i) {
			var skill = this.skills()[i];
			if (!skill) continue;
			var warmup = skill.warmup;
			if (skill.warmupEval.length > 0) {
				var item = skill;
			  var a = this;
			  var user = this;
			  var subject = this;
			  var s = $gameSwitches._data;
			  var v = $gameVariables._data;
				eval(skill.warmupEval);
			}
			warmup *= this.cooldownDuration(skill);
			warmup += this.getWarmupMods(skill);
			this.setWarmup(skill.id, warmup);
		}
};

Game_BattlerBase.prototype.updateCooldowns = function() {
    if (this._cooldownTurns === undefined) this.clearCooldowns();
		for (var skillId in this._cooldownTurns) {
			var skill = $dataSkills[skillId];
			if (!skill) continue;
			this._cooldownTurns[skillId] -= this.cooldownRate(skill);
		}
};

Game_BattlerBase.prototype.updateWarmups = function() {
    if (this._warmupTurns === undefined) this.clearWarmups();
		for (var skillId in this._warmupTurns) {
			var skill = $dataSkills[skillId];
			if (!skill) continue;
			this._warmupTurns[skillId] -= this.cooldownRate(skill);
		}
};

Yanfly.SCD.Game_BattlerBase_meetsSkillConditions =
		Game_BattlerBase.prototype.meetsSkillConditions;
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    if (this.cooldown(skill.id) > 0) return false;
		if (this.warmup(skill.id) > 0) return false;
		return Yanfly.SCD.Game_BattlerBase_meetsSkillConditions.call(this, skill);
};

Yanfly.SCD.Game_BattlerBase_paySkillCost =
		Game_BattlerBase.prototype.paySkillCost;
Game_BattlerBase.prototype.paySkillCost = function(skill) {
    Yanfly.SCD.Game_BattlerBase_paySkillCost.call(this, skill);
		this.payGlobalCooldown(skill);
		this.payStypeCooldownCost(skill);
		this.payCooldownCost(skill);
		this.applyCooldownMods(skill);
};

Game_BattlerBase.prototype.payGlobalCooldown = function(mainSkill) {
		for (var i = 0; i < this.skills().length; ++i) {
			var skill = this.skills()[i];
			if (!skill) continue;
			var value = mainSkill.globalCooldown;
			value *= this.cooldownDuration(mainSkill);
			value = Math.max(value, this.cooldown(skill.id));
			this.setCooldown(skill.id, value);
		}
};

Game_BattlerBase.prototype.payStypeCooldownCost = function(mainSkill) {
		for (var stypeId in mainSkill.stypeCooldown) {
			stypeId = parseInt(stypeId);
			for (var i = 0; i < this.skills().length; ++i) {
				var skill = this.skills()[i];
				if (!skill) continue;
				if (skill.stypeId !== stypeId) continue;
				var value = mainSkill.stypeCooldown[stypeId];
				value *= this.cooldownDuration(mainSkill);
				value = Math.max(value, this.cooldown(skill.id));
				this.setCooldown(skill.id, value);
			}
		}
};

Game_BattlerBase.prototype.payCooldownCost = function(skill) {
		for (var skillId in skill.cooldown) {
			skillId = parseInt(skillId);
			if (!$dataSkills[skillId]) continue;
			var cooldown = skill.cooldown[skillId];
			if (skill.id === skillId) {
				if (skill.cooldownEval.length > 0) {
					var item = skill;
				  var a = this;
				  var user = this;
				  var subject = this;
				  var s = $gameSwitches._data;
				  var v = $gameVariables._data;
					eval(skill.cooldownEval);
				}
			}
			cooldown *= this.cooldownDuration(skill);
			cooldown = Math.max(cooldown, this.cooldown(skillId));
			this.setCooldown(skillId, cooldown);
		}
};

Game_BattlerBase.prototype.endBattleCooldowns = function() {
		for (var skillId in this._cooldownTurns) {
			this._cooldownTurns[skillId] += $dataSkills[skillId].afterBattleCooldown;
		}
};

Game_BattlerBase.prototype.updateCooldownSteps = function() {
    for (var skillId in this._cooldownTurns) {
			var skill = $dataSkills[skillId];
			if (skill) {
				if ($gameParty.steps() % skill.cooldownSteps === 0) {
					this._cooldownTurns[skillId] -= this.cooldownRate(skill);
				}
			}
		}
};

Game_BattlerBase.prototype.applyCooldownEffect = function(skill) {
		this.applyGlobalCooldownChange(skill);
		this.applyStypeCooldownChange(skill);
		this.applyCooldownChange(skill);
};

Game_BattlerBase.prototype.applyCooldownChange = function(skill) {
		for (var skillId in skill.cooldownChange) {
			skillId = parseInt(skillId);
			if (!$dataSkills[skillId]) continue;
			var value = skill.cooldownChange[skillId];
			this.addCooldown(skillId, value);
		}
};

Game_BattlerBase.prototype.applyStypeCooldownChange = function(mainSkill) {
		for (var stypeId in mainSkill.stypeCooldownChange) {
			stypeId = parseInt(stypeId);
			for (var i = 0; i < this.skills().length; ++i) {
				var skill = this.skills()[i];
				if (!skill) continue;
				if (skill.stypeId !== stypeId) continue;
				var value = mainSkill.stypeCooldownChange[stypeId];
				this.addCooldown(skill.id, value);
			}
		}
};

Game_BattlerBase.prototype.applyGlobalCooldownChange = function(mainSkill) {
		for (var i = 0; i < this.skills().length; ++i) {
			var skill = this.skills()[i];
			if (!skill) continue;
			var value = mainSkill.globalCooldownChange;
			this.addCooldown(skill.id, value);
		}
};

Game_BattlerBase.prototype.getWarmupMods = function(skill) {
		var value = 0;
		value += this.flatWarmupChange(skill);
		return value;
};

Game_BattlerBase.prototype.applyCooldownMods = function(skill) {
		var value = this.cooldown(skill.id);
		value += this.flatCooldownChange(skill);
		this.setCooldown(skill.id, Math.max(0, value));
};

//=============================================================================
// Game_Battler
//=============================================================================

Yanfly.SCD.Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    Yanfly.SCD.Game_Battler_onBattleStart.call(this);
		this.startWarmups();
};

Game_Battler.prototype.cooldownDuration = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = 1.0;
		for (var i = 0; i < this.states().length; ++i) {
			var state = this.states()[i];
			if (!state) continue;
			if (state.cooldownDuration[skillId] !== undefined) {
				value *= state.cooldownDuration[skillId];
			}
			if (state.stypeCooldownDuration[stypeId] !== undefined) {
				value *= state.stypeCooldownDuration[stypeId];
			}
			value *= state.globalCooldownDuration;
		}
		return value;
};

Game_Battler.prototype.cooldownRate = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = 1;
		for (var i = 0; i < this.states().length; ++i) {
			var state = this.states()[i];
			if (!state) continue;
			if (state.cooldownRate[skillId] !== undefined) {
				value *= state.cooldownRate[skillId];
			}
			if (state.stypeCooldownRate[stypeId] !== undefined) {
				value *= state.stypeCooldownRate[stypeId];
			}
			value *= state.globalCooldownRate;
		}
		return value;
};

Game_Battler.prototype.flatCooldownChange = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = 0;
		for (var i = 0; i < this.states().length; ++i) {
			var state = this.states()[i];
			if (!state) continue;
			if (state.cooldownChange[skillId] !== undefined) {
				value += state.cooldownChange[skillId];
			}
			if (state.stypeCooldownChange[stypeId] !== undefined) {
				value += state.stypeCooldownChange[stypeId];
			}
			value += state.globalCooldownChange;
		}
		return value;
};

Game_Battler.prototype.flatWarmupChange = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = 0;
		for (var i = 0; i < this.states().length; ++i) {
			var state = this.states()[i];
			if (!state) continue;
			if (state.warmupChange[skillId] !== undefined) {
				value += state.warmupChange[skillId];
			}
			if (state.stypeWarmupChange[stypeId] !== undefined) {
				value += state.stypeWarmupChange[stypeId];
			}
			value += state.globalWarmupChange;
		}
		return value;
};

//=============================================================================
// Game_Actor
//=============================================================================

Game_Actor.prototype.cooldownDuration = function(skill) {
		var value = Game_Battler.prototype.cooldownDuration.call(this, skill);
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		if (this.actor().cooldownDuration[skillId] !== undefined) {
			value *= this.actor().cooldownDuration[skillId];
		}
		if (this.currentClass().cooldownDuration[skillId] !== undefined) {
			value *= this.currentClass().cooldownDuration[skillId];
		}
		if (this.actor().stypeCooldownDuration[stypeId] !== undefined) {
			value *= this.actor().stypeCooldownDuration[stypeId];
		}
		if (this.currentClass().stypeCooldownDuration[stypeId] !== undefined) {
			value *= this.currentClass().stypeCooldownDuration[stypeId];
		}
		value *= this.actor().globalCooldownDuration;
		value *= this.currentClass().globalCooldownDuration;
		for (var i = 0; i < this.equips().length; ++i) {
			var equip = this.equips()[i];
			if (!equip) continue;
			if (equip.cooldownDuration !== undefined) {
				if (equip.cooldownDuration[skillId] !== undefined) {
					value *= equip.cooldownDuration[skillId];
				}
			}
			if (equip.stypeCooldownDuration !== undefined) {
				if (equip.stypeCooldownDuration[stypeId] !== undefined) {
					value *= equip.stypeCooldownDuration[stypeId];
				}
			}
			if (equip.globalCooldownDuration !== undefined) {
				value *= equip.globalCooldownDuration;
			}
		}
		return value;
};

Game_Actor.prototype.cooldownRate = function(skill) {
		var value = Game_Battler.prototype.cooldownRate.call(this, skill);
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		if (this.actor().cooldownRate[skillId] !== undefined) {
			value *= this.actor().cooldownRate[skillId];
		}
		if (this.currentClass().cooldownRate[skillId] !== undefined) {
			value *= this.currentClass().cooldownRate[skillId];
		}
		if (this.actor().stypeCooldownRate[stypeId] !== undefined) {
			value *= this.actor().stypeCooldownRate[stypeId];
		}
		if (this.currentClass().stypeCooldownRate[stypeId] !== undefined) {
			value *= this.currentClass().stypeCooldownRate[stypeId];
		}
		value *= this.actor().globalCooldownRate;
		value *= this.currentClass().globalCooldownRate;
		for (var i = 0; i < this.equips().length; ++i) {
			var equip = this.equips()[i];
			if (!equip) continue;
			if (equip.cooldownRate !== undefined) {
				if (equip.cooldownRate[skillId] !== undefined) {
					value *= equip.cooldownRate[skillId];
				}
			}
			if (equip.stypeCooldownRate !== undefined) {
				if (equip.stypeCooldownRate[stypeId] !== undefined) {
					value *= equip.stypeCooldownRate[stypeId];
				}
			}
			if (equip.globalCooldownRate !== undefined) {
				value *= equip.globalCooldownRate;
			}
		}
		return value;
};

Game_Actor.prototype.flatCooldownChange = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = Game_Battler.prototype.flatCooldownChange.call(this, skill);
		if (this.actor().cooldownChange[skillId] !== undefined) {
			value += this.actor().cooldownChange[skillId];
		}
		if (this.currentClass().cooldownChange[skillId] !== undefined) {
			value += this.currentClass().cooldownChange[skillId];
		}
		if (this.actor().stypeCooldownChange[stypeId] !== undefined) {
			value += this.actor().stypeCooldownChange[stypeId];
		}
		if (this.currentClass().stypeCooldownChange[stypeId] !== undefined) {
			value += this.currentClass().stypeCooldownChange[stypeId];
		}
		value += this.actor().globalCooldownChange;
		value += this.currentClass().globalCooldownChange;
		for (var i = 0; i < this.equips().length; ++i) {
			var equip = this.equips()[i];
			if (!equip) continue;
			if (equip.cooldownChange[skillId] !== undefined) {
				value += equip.cooldownChange[skillId];
			}
			if (equip.stypeCooldownChange[stypeId] !== undefined) {
				value += equip.stypeCooldownChange[stypeId];
			}
			value += equip.globalCooldownChange;
		}
		return value;
};

Game_Actor.prototype.flatWarmupChange = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = Game_Battler.prototype.flatWarmupChange.call(this, skill);
		if (this.actor().warmupChange[skillId] !== undefined) {
			value += this.actor().warmupChange[skillId];
		}
		if (this.currentClass().warmupChange[skillId] !== undefined) {
			value += this.currentClass().warmupChange[skillId];
		}
		if (this.actor().stypeWarmupChange[stypeId] !== undefined) {
			value += this.actor().stypeWarmupChange[stypeId];
		}
		if (this.currentClass().stypeWarmupChange[stypeId] !== undefined) {
			value += this.currentClass().stypeWarmupChange[stypeId];
		}
		value += this.actor().globalWarmupChange;
		value += this.currentClass().globalWarmupChange;
		for (var i = 0; i < this.equips().length; ++i) {
			var equip = this.equips()[i];
			if (!equip) continue;
			if (equip.warmupChange[skillId] !== undefined) {
				value += equip.warmupChange[skillId];
			}
			if (equip.stypeWarmupChange[stypeId] !== undefined) {
				value += equip.stypeWarmupChange[stypeId];
			}
			value += equip.globalWarmupChange;
		}
		return value;
};

//=============================================================================
// Game_Enemy
//=============================================================================

if (!Game_Enemy.prototype.skills) {
		Game_Enemy.prototype.skills = function() {
			var skills = []
			for (var i = 0; i < this.enemy().actions.length; ++i) {
				var skill = $dataSkills[this.enemy().actions[i].skillId]
				if (skill) skills.push(skill);
			}
			return skills;
		}
};

Game_Enemy.prototype.cooldownDuration = function(skill) {
		var value = Game_Battler.prototype.cooldownDuration.call(this, skill);
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		if (this.enemy().cooldownDuration[skillId] !== undefined) {
			value *= this.enemy().cooldownDuration[skillId];
		}
		if (this.enemy().stypeCooldownDuration[stypeId] !== undefined) {
			value *= this.enemy().stypeCooldownDuration[stypeId];
		}
		value *= this.enemy().globalCooldownDuration;
		return value;
};

Game_Enemy.prototype.cooldownRate = function(skill) {
		var value = Game_Battler.prototype.cooldownRate.call(this, skill);
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		if (this.enemy().cooldownRate[skillId] !== undefined) {
			value *= this.enemy().cooldownRate[skillId];
		}
		if (this.enemy().stypeCooldownRate[stypeId] !== undefined) {
			value *= this.enemy().stypeCooldownRate[stypeId];
		}
		value *= this.enemy().globalCooldownRate;
		return value;
};

Game_Enemy.prototype.flatCooldownChange = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = Game_Battler.prototype.flatCooldownChange.call(this, skill);
		if (this.enemy().cooldownChange[skillId] !== undefined) {
			value += this.enemy().cooldownChange[skillId];
		}
		if (this.enemy().stypeCooldownChange[stypeId] !== undefined) {
			value += this.enemy().stypeCooldownChange[stypeId];
		}
		value += this.enemy().globalCooldownChange;
		return value;
};

Game_Enemy.prototype.flatWarmupChange = function(skill) {
		var skillId = skill.id;
		var stypeId = skill.stypeId;
		var value = Game_Battler.prototype.flatWarmupChange.call(this, skill);
		if (this.enemy().warmupChange[skillId] !== undefined) {
			value += this.enemy().warmupChange[skillId];
		}
		if (this.enemy().stypeWarmupChange[stypeId] !== undefined) {
			value += this.enemy().stypeWarmupChange[stypeId];
		}
		value += this.enemy().globalWarmupChange;
		return value;
};

//=============================================================================
// Game_Action
//=============================================================================

Yanfly.SCD.Game_Action_applyItemUserEffect =
		Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect = function(target) {
    Yanfly.SCD.Game_Action_applyItemUserEffect.call(this);
		target.applyCooldownEffect(this.item());
};

//=============================================================================
// Game_Unit
//=============================================================================

Game_Unit.prototype.updateCooldowns = function() {
    return this.members().forEach(function(member) {
        member.updateCooldowns();
				member.updateWarmups();
    });
};

Game_Unit.prototype.endBattleCooldowns = function() {
    return this.members().forEach(function(member) {
        member.endBattleCooldowns();
				member.clearWarmups();
    });
};

//=============================================================================
// Game_Party
//=============================================================================

Yanfly.SCD.Game_Party_increaseSteps = Game_Party.prototype.increaseSteps;
Game_Party.prototype.increaseSteps = function() {
    Yanfly.SCD.Game_Party_increaseSteps.call(this);
		this.updateCooldownSteps();
};

Game_Party.prototype.updateCooldownSteps = function() {
    return this.members().forEach(function(member) {
        return member.updateCooldownSteps();
    });
};

//=============================================================================
// Game_Troop
//=============================================================================

Yanfly.SCD.Game_Troop_increaseTurn = Game_Troop.prototype.increaseTurn;
Game_Troop.prototype.increaseTurn = function() {
    Yanfly.SCD.Game_Troop_increaseTurn.call(this);
		this.updateCooldowns();
		$gameParty.updateCooldowns();
};

//=============================================================================
// Window_SkillList
//=============================================================================

Yanfly.SCD.Window_SkillList_drawCost = Window_SkillList.prototype.drawSkillCost;
Window_SkillList.prototype.drawSkillCost = function(skill, wx, wy, width) {
    if (this._actor.warmup(skill.id) > 0) {
			this.drawWarmup(skill, wx, wy, width);
		}	else if (this._actor.cooldown(skill.id) > 0) {
			this.drawCooldown(skill, wx, wy, width);
		} else {
			Yanfly.SCD.Window_SkillList_drawCost.call(this, skill, wx, wy, width);
		}
};

Window_SkillList.prototype.drawCooldown = function(skill, wx, wy, dw) {
		if (Yanfly.Icon.Cooldown > 0) {
			var iw = wx + dw - Window_Base._iconWidth;
			this.drawIcon(Yanfly.Icon.Cooldown, iw, wy + 2);
			dw -= Window_Base._iconWidth + 2;
		}
		this.changeTextColor(this.textColor(Yanfly.Param.CDTextColor));
		var fmt = Yanfly.Param.CDFmt;
		var value = this._actor.cooldown(skill.id);
		if (value % 1 !== 0) value = value.toFixed(2);
		if (value <= 0.009) value = 0.01;
		var text = fmt.format(Yanfly.Util.toGroup(value));
		this.contents.fontSize = Yanfly.Param.CDFontSize;
		this.drawText(text, wx, wy, dw, 'right');
		this.resetFontSettings();
};

Window_SkillList.prototype.drawWarmup = function(skill, wx, wy, dw) {
		if (Yanfly.Icon.Warmup > 0) {
			var iw = wx + dw - Window_Base._iconWidth;
			this.drawIcon(Yanfly.Icon.Warmup, iw, wy + 2);
			dw -= Window_Base._iconWidth + 2;
		}
		this.changeTextColor(this.textColor(Yanfly.Param.WUTextColor));
		var fmt = Yanfly.Param.WUFmt;
		var value = this._actor.warmup(skill.id);
		if (value % 1 !== 0) value = value.toFixed(2);
		if (value <= 0.009) value = 0.01;
		var text = fmt.format(Yanfly.Util.toGroup(value));
		this.contents.fontSize = Yanfly.Param.WUFontSize;
		this.drawText(text, wx, wy, dw, 'right');
		this.resetFontSettings();
};

//=============================================================================
// Utilities
//=============================================================================

Yanfly.Util = Yanfly.Util || {};

if (!Yanfly.Util.toGroup) {
		Yanfly.Util.toGroup = function(inVal) {
				return inVal;
		}
};

//=============================================================================
// End of File
//=============================================================================
};
