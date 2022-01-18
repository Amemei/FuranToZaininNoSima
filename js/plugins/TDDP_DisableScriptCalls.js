//=============================================================================
// TDDP_DisableScriptCalls
// Version: 1.0.0
//=============================================================================
/*:
 * @plugindesc 1.0.0 Disables all Script calls in your game's events by default.
 * @author Tor Damian Design / Galenmereth
 *
 * @param Force Code
 * @desc If you write this code anywhere in your Script calls, the Script call will be called like normal.
 * @default FORCE!
 *
 * @help =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
 * Information
 * =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
 * TDDP_DisableScriptCalls is a tiny script that disables all the Script calls
 * in your events. An optional Force Code parameter can be configured to allow
 * individual Script calls to still be called. Useful for debugging / testing.
 *
 * For updates and easy to use documentation, please go to the plugin's website:
 * http://mvplugins.tordamian.com/?p=290
 *
 * There you can also download a PDF of the documentation for offline use, and
 * having the documentation in one cleanly presented place means you can always
 * be sure it's the most recent available.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Terms & Conditions
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * This plugin is free for both non-commercial and commercial use. Please see
 * http://mvplugins.tordamian.com/terms-of-use for the full terms of use.
 *
 * A big thank you to Degica for making this plugin free for commercial use for
 * everyone!
 */
/*:ja
 * @plugindesc ゲーム内イベントのスクリプトコールを全て無効化します。
 * @author Tor Damian Design / Galenmereth
 *
 * @param Force Code
 * @desc このコードをスクリプトコール内のどこかに挿入することで、
 * 通常どおりにコールされるようになります。
 * @default FORCE!
 *
 * @help =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
 * Information
 * =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
 * TDDP_DisableScriptCallsはイベント内の
 * すべてのスクリプト呼び出しを無効化する、スクリプトです。
 * オプションのForce Codeパラメーターは、
 * 個々のスクリプトコールをコールされた状態にすることができます。
 * これはデバッグやテストプレイに役立つコードです。
 *
 * アップデートと簡易使用方法については、
 * こちらのプラグインのサイトを参照してください。
 * http://mvplugins.tordamian.com/?p=290
 * このサイトでは、オフラインで使用するためのPDFをダウンロードすることができます。
 * またいつでも最新版の確認を行なうことができます。
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Terms & Conditions
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * このプラグインは、商用利用・非商用利用どちらにもフリーで公開されています。
 * 使用方法の全文についてはこちらのサイトを確認してください。
 * http://mvplugins.tordamian.com/terms-of-use
 *
 * 最後に、このプラグインのフリーでの商用利用を実現してくれた
 * Degicaさんに感謝の意を表します。
 */
var TDDP_DisableScriptCalls = {};
(function() {
    "use strict";
    var parameters = PluginManager.parameters('TDDP_DisableScriptCalls');
    TDDP_DisableScriptCalls.forceValue = String(parameters['Force Code']);
    Game_Interpreter.prototype.command355 = function() {
        // This is the normal functionality of command355
        var script = this.currentCommand().parameters[0] + '\n';
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand().parameters[0] + '\n';
        }
        // We now check if the force code is found; if not we ignore
        var result = script.match(TDDP_DisableScriptCalls.forceValue);
        if (result !== null) {
            script = script.replace(TDDP_DisableScriptCalls.forceValue);
            eval(script);
        }
        return true;
    };
})();
