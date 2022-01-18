(function() {

//================
// Copyright (c) 2016 Ponidog /ぽに犬
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============
//バックログを表示するプラグインですばい。
//メッセージウィンドウに渡すtextを別途保存してそれを表示させてます。
//ついで右クリックでメッセージウィンドウを隠す処理もやったり。
//
//コメント文の癖でif(条件式){　　}//if(条件式)
//という風に}の後ろにその始まった条件式をコメントしてます。
//自分的にデバックしやすい形という事で。
//
// version
//* ver0.9  (2016. 10/6) 最大ログ保存数を設定可能にした。デフォルトは無制限。
//	あとBackをBuckで一部書いてたのでそれをBackに統一というどうでも良い修正がされた。
//* ver 0.8 (2016. 10/4) 顔画像なしの地の文が混ざるとわかりづらいのでその対応策を追加
//* ver 0.7 (2016. 10/3) Yepメッセージコアのネームボックスをログに反映できるようにした関係で色々機能追加。
//* ver 0.6 (2016. 9/30)右クリックでメッセージウィンドウを隠す処理を追加。
//* ver 0.5 (2016. 9/28)ページの無限遡りをカット。制御文字の＼！等がログに残るのを削除。
//*	特殊な制御文字を追加していた場合はGame_Message.prototype.convertEscapeCharactersに適宜追加
//*	・ページ毎に空行１つ追加して見やすくしたり。
//* ver 0.4 (2016. 3/31)制御文字に対応させた。
//* ver0.3 (2016. 3/25)とりあえず出した

/*:
* @plugindesc バックログ及びメッセージ周りの補填関係
* @author ponidog http://ponidog.sakura.ne.jp/
* @desc バックログ ver0.9 (2016. 10/6)
*

 * @param nBackLogDisplayLine
 * @desc 表示行数
 * @default 12


 * @param nBackLogLimitMax
 * @desc 最大保存ログ行数。0以下で無制限
 * @default -1

 * @param nBackLogButtonUp
 * @desc ページアップボタンのピクチャID
 * @default 0
 * @param nBackLogButtonDown
 * @desc ページダウンボタンのピクチャID
 * @default 0

 * @param bBackLogNameOn_forYepMessageCore
 * @desc Yepプラグインの名前欄をログに追加　true/false
 * @default true

 * @param bBackLogNameOn_Flame
 * @desc ログの名前欄の先頭文字
 * @default ●

 * @param bBackLogNameOn_Flame2
 * @desc ログの名前欄の文字末尾
 * @default 　

 * @param sBackLogNoFaceSymbol
 * @desc 名前欄なしメッセージのログ表示
 * @default ★

 * @param sBackLogNoFaceSpace
 * @desc 顔画像がない場合、ログ各行の頭に付ける文字。空白など入れるとよい。
 * @default

* @help
*■■■■■■■■■■■■■■
* プラグインコマンド
*■■■■■■■■■■■■■■
* BackLogStart
* 　　バックログを開始。コモンイベント設定は後述。
* BackLogUp
* 　　ページアップ。特に呼び出しを付ける必要はない。
* BackLogDown
* 　　ページダウン。特に呼び出しを付ける必要はない。
*
* BackLogLimitMax
* 　　最大保存ログ行数を変更する。0以下で無制限保存。
* 　　＼V[n]の変数も使える。例：BackLogLimitMax \V[1]
*
* NameBoxSet なまえ
* 　　YepMessageCore必須:名前欄に　なまえを表示する。解除するまで常につく。
* NameBoxReset
* 　　YepMessageCore必須:なまえ　をリセットする。
*
*■■■■■■■■■■■■■■
*パラメーター
*■■■■■■■■■■■■■■
*nBackLogDisplayLine
*	  表示桁数
*
*nBackLogLimitMax
*	最大保存ログ行数。0以下で無制限。
*	デフォルトは無制限の設定。なお毎回ロード時にログはリセットされる。
*
*nBackLogButtonUp
*	　ページアップボタンのピクチャID
*nBackLogButtonDown
*	 ページダウンボタンのピクチャID
*bBackLogNameOn_forYepMessageCore
*	Yepプラグインの名前欄をログに追加。デフォルトはtrue (true/false)
*
*bBackLogNameOn_Flame
*	 ログの名前欄の先頭文字。デフォルトは●
* bBackLogNameOn_Flame2
*	 ログの名前欄の文字末尾。デフォルトは空欄。
*
* sBackLogNoFaceSymbol
*	名前欄なしメッセージのログ表示。
*	いわゆる地の文の開始合図にも使える。デフォルトは★
* sBackLogNoFaceSpace
*	顔画像がない場合、ログ各行の頭に付ける文字。空白など入れるとよい。
*	デフォルトでスペース入れたら駄目だったので自前で入れてくだされ。
*	　※名前欄と顔画像なしの場合はsBackLogNoFaceSymbolと併せて適用される。
*
*■■■■■■■■■■■■■■
*操作方法
*■■■■■■■■■■■■■■
* ページアップボタンorマウスホイールupでバックログを表示。
* バックログ中はページダウンとアップorマウスホイールで切り替え。
* クリックまたはページを下げ切ると戻る。
* 
* 通常メッセージ表示中に右クリックするとウィンドウを隠す。
*
*■■■■■■■■■■■■■■
*諸注意
*■■■■■■■■■■■■■■
*
* プラグイン導入だけの呼び出しはメッセージウィンドウ表示中のみ。
*
* マップに並列処理のコモンイベント呼び出しをつけると
* 移動中などメッセージが表示されてない時でも呼べるようになる。
* 条件文の4タブのスクリプトに Input.isTriggered('pageup') ||TouchInput._wheelY <0
* を書き、プラグインコマンドBackLogStart　を設定するとページアップとマウスホイールでも呼べる。
*
* 競合等でマウスホイール操作を使いたくない場面で使い分けできます。
*
*■■■
*　ログ呼び出しボタンを自分で付けた場合は
* そのボタンのピクチャIDを指定する事でメッセージ表示中でもバックログ処理が行える。
* クリックした時にこのピクチャIDの上にマウスがあるかどうかを確認している。
* サンプルでは画面右のΛⅤがそれにあたる。
*
* スキップボタンやらセーブ等のシステムボタンやらを付けたしたい場合は
* 適宜追加改造で。Window_Message.prototype.updateInputを編集。
*■■■
*
* 顔画像に対応する名前をスクリプト中のas_NameListImg配列にセットすると
* ネームボックスにタグなしで名前が表示されるようになる。（要:Yepメッセージコア)
*
*■■■
* NameBoxSet命令は同じ人物が会話をずっと続ける場合に使うと便利。
* 名前タグを毎回つけなくてよくなる。
*
* ■タグが文中にある場合 > スクリプトコマンド NameBoxSet > 顔画像リスト登録
* 　左が優先してネームボックスに表示される。
* 
* 一部競合するプラグインは別途条件式を付け足してくだされ。
*　下の方にある上書きする関数が競合原因でごわすよ。
*
*/


"use strict";
    var pluginName = 'ponidog_BackLog';


//

    //==========================================================
var parameters = PluginManager.parameters('ponidog_BackLog_utf8');
//表示する行数。最初は小さい数字でテストすると良い
var nBackLogDisplayLine = Number(parameters['nBackLogDisplayLine'] || 18);

//最大ログ保持数。マイナス値は無制限。
var nBackLogLimitMax= Number(parameters['nBackLogLimitMax'] ||-1);

//ボタンピクチャの番号。プラグイン管理からか右の０を書き換え。
var nBackLogButtonUpId = Number(parameters['nBackLogButtonUp'] || 0);
var nBackLogButtonDownId = Number(parameters['nBackLogButtonDown'] || 0);

//Yepメッセージコアのネームボックスを反映
var bBackLogNameOn = Boolean(parameters['bBackLogNameOn_forYepMessageCore'] || 0);
var sBackLogNameFlame = String(parameters['bBackLogNameOn_Flame'] || '●');
var sBackLogNameFlame2 = String(parameters['bBackLogNameOn_Flame2'] || '');


//顔画像なしの時のバックログ処理。
//名前付き会話文の後の地の文章がわかりづらいので差別化する。
var sBackLogNoFaceSymbol = String(parameters['sBackLogNoFaceSymbol'] || '');
var sBackLogNoFaceSpace = String(parameters['sBackLogNoFaceSpace'] || '');
  //==========================================================

 //==========================================================
// oはオブジェクトのつもりで付けてみた。
var oBackLog = new BackLog();
var    an_BackLog=[];
var    an_BackLogNowText=[];


//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

//"画像名","対応するネームボックスに表示する名前",
//のセットで入力。画像名は拡張子不要。
//
//"Actor2","nickname=4",
//
//という風に記述をする。
//改行は挟んでも良いけど最後の""に,を付けないようにきをつける。
//"nickname=番号"を入れると　二つ名＋キャラ名 が表示される。
//番号はその二つ名のアクター番号。
//二つ名の変更は$gameActors.actor(番号).setNickname("変更名")でゲーム内で可能なので
//かなり融通の利く形のはず。
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//
//		名前リストの入力欄
//■■■■                                ■■■■■■■■■

var as_NameListImg = 
[
"chuky-1","風来坊ちゃっきー",
"ama-1","nickname=3"
];

//配列なので,の区切りに注意。
//["img","なまえ",];　って最後に,付けるとエラーでる。
//["img","なまえ"];　が正解。

//■■■■                                ■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■



//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 //==========================================================
    //==========================================================
    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);


        if ( (command)  === 'BackLogStart') {
//oBackLogButton.initialize();
oBackLog._nBackLogPage++;
oBackLog.BackLog_Call();
        }
        if ( (command)  === 'BackLogUp') {
oBackLog._BackLogBusy=true;
            Input.update();  
TouchInput.update();  
oBackLog._nBackLogPage++;
oBackLog.BackLog_Call();
        }
        if ( (command)  === 'BackLogDown') {
oBackLog._BackLogBusy=true;

            Input.update();    
TouchInput.update();  
oBackLog._nBackLogPage--;
oBackLog.BackLog_Call();
        }

        if ( (command)  === 'BackLogLimitMax') {
var _TempLog=args[0];
//console.log(_TempLog);

//　変数＼V[n]ぶっこみに対応させる。
var bCheck=_TempLog.match(/\\V\[/g);
if(bCheck){

_TempLog =_TempLog.replace(/\\V\[/gi,'');
_TempLog =_TempLog.replace(/\]/gi,'');
_TempLog =$gameVariables.value( parseInt(_TempLog) );

}//if(_TempLog.match(/\\V\[/gi)

//console.log(_TempLog);
nBackLogLimitMax=parseInt(_TempLog);
//console.log(an_BackLog);
if(nBackLogLimitMax)an_BackLog=an_BackLog.splice(-nBackLogLimitMax);

//console.log(nBackLogLimitMax);
//console.log(an_BackLog);

	}

        if ( (command)  === 'NameBoxSet') {
oBackLog.sNameBoxSet_ponidogBackLog=args[0];//
        }
        if ( (command)  === 'NameBoxClear'||(command)  === 'NameBoxReset') {
oBackLog.sNameBoxSet_ponidogBackLog="";
        }

}




    //==========================================================
//	メッセージウィンドウに渡すtextを保存して
//	それを表示させるのがこのプラグインの目的となる。
    //==========================================================
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//上書き

//各行
Game_Message.prototype.add = function(text) {

//通常メッセージをウィンドウの配列へ渡す
   this._texts.push(text);





var sNameSet="";
//console.log($gameMessage.faceName());

//console.log(as_NameListImg);
//console.log(this._faceName);
//画像リストから現在の顔画像を検索
var nNameSerch=as_NameListImg.indexOf(this._faceName);
//console.log("nNameSerch "+nNameSerch);
 //あれば名前をセットする。
if(nNameSerch>=0){
	sNameSet=as_NameListImg[nNameSerch+1];

//画像リストにニックネームを入れた場合の対応
//直接変数ぶっこんだら無理だったので強引に解決した。
if(sNameSet.match("nickname=")){
var _nActor=  sNameSet.split("nickname=",2);
sNameSet=$gameActors.actor( parseInt(_nActor[1]) ).nickname() + $gameActors.actor( parseInt(_nActor[1]) ).name();
}//if(sNameSet.match("nickname=")){	
}//if(nNameSerch>=0){

//スクリプトコマンドで名前指定があればそちらを優先する。
if(oBackLog.sNameBoxSet_ponidogBackLog.length>0)sNameSet=oBackLog.sNameBoxSet_ponidogBackLog;

//Yepメッセージコアのネームボックスを使用する場合の処理。
//console.log(this._texts);
//現在の配列のindexを返す。
//this._texts.indexでは所得できなかったので一致する文字列を検索。
var _count=this._texts.indexOf(text);
//console.log(_count);
//ネームボックスがある場合。
var list =text.match(/\\n\<(.*)\>/g||/\\nc\<(.*)\>/g||/\\nr\<(.*)\>/g);

//プラグインコマンドでネームボックスが指定されている場合の表示
//なお文中で指定されてる場合はそちらを優先。
if(!list &&_count==0 &&sNameSet.length>0){
this._texts[0]="\\n<"+sNameSet+">"+this._texts[0];
}//!list

//■
//バックログに名前を反映する処理
if(bBackLogNameOn){

var sNameSetFull="";


//名前表示
if(!list &&_count==0 &&sNameSet.length>0){
sNameSetFull=sBackLogNameFlame+sNameSet+sBackLogNameFlame2;

}//

//名前欄が空欄の場合
if(!list &&_count==0 &&sNameSet.length==0){
sNameSetFull=sBackLogNoFaceSymbol;
}//


if(list){
var sName=list[0];
sName = sName.replace(/\\nc\</g, '');
sName = sName.replace(/\\nr\</g, '');
sName = sName.replace(/\\n\</g, '');
sName = sName.replace(/\>/g, '');
sNameSet=sName;
sNameSetFull=sBackLogNameFlame+sName+sBackLogNameFlame2;
}//if(list)

//前回表示した名前と違っていれば表示する。
//地の文のみに適用。会話文が地の文みたいに見えちゃったので。
if(_count==0 &&sNameSet.length==0){
	if(oBackLog.sNameBoxPrev_ponidogBackLog!=sNameSetFull){



		//an_BackLog.push(sNameSetFull);
		oBackLog.BackLog_add(sNameSetFull);

		oBackLog.sNameBoxPrev_ponidogBackLog = sNameSetFull;
	}//if
}//if(sNameSet.length==0)
if(_count==0 &&sNameSet.length>0){




		//an_BackLog.push(sNameSetFull);
		oBackLog.BackLog_add(sNameSetFull);
		oBackLog.sNameBoxPrev_ponidogBackLog = sNameSetFull;

}//if(sNameSet.length>0){

}//if(bBackLogNameOn



//制御文字の処理
    var _text = this.convertEscapeCharacters(text);

//console.log(_text);


//顔画像なしの場合空行を入れて差別化する
var sTextSpace="";
if($gameMessage.faceName()=="")sTextSpace=sBackLogNoFaceSpace;


//バックログに文字列を渡す
//an_BackLog.push( sTextSpace + _text);
		oBackLog.BackLog_add( sTextSpace + _text);





//console.log($gameMessage);

};




//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//適度に空行を入れたい

Game_Message.prototype.setBackground = function(background) {

//an_BackLog.push("　");//■なんかでも良いかもね
		oBackLog.BackLog_add("　");



    this._background = background;
};




//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//===============
//追加プロトタイプ
//=========
//制御文字は
//str.replace(pattern, replacement[, flags])
//を用いている。flags=arguments[1]
// 1 番目の括弧でキャプチャされたサブマッチの文字列を挿入とのこと。
Game_Message.prototype.convertEscapeCharacters = function(text) {

// .replace(/■/g,□)　という命令である。スラッシュ内の文字を置き換え。
// \\は\一文字を示してるいつもの。
//前半はデフォルトのソースをコピペ。

    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');

    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));

    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));

    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));

    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);

//後半。
//バックログに＼！の！だけ残るのでそれを消す。また類似の命令があれば追加
//\x1bは前半に変換された＼である。
    text = text.replace(/\x1bC\[(\d+)\]/gi, '\x1b');
    text = text.replace(/\x1bI\[(\d+)\]/gi, '\x1b');

    text = text.replace(/\x1b!/g, '\x1b');
    text = text.replace(/\x1b>/g, '\x1b');
    text = text.replace(/\x1b</g, '\x1b');
    text = text.replace(/\x1bN/g, '\x1b');
//そのまま使えない文字は\を追加する。
    text = text.replace(/\x1b\|/g, '\x1b');
    text = text.replace(/\x1b\^/g, '\x1b');
    text = text.replace(/\x1b\./g, '\x1b');
    text = text.replace(/\x1b\{/g, '\x1b');
    text = text.replace(/\x1b\}/g, '\x1b');
    text = text.replace(/\x1b\$/g, '\x1b');

//YEPメッセージコアのサブウィンドウのネームボックスがある場合の処理
//名前欄を別途改行表示するので、この場では消す。
//文頭にネームボックスタグがあるとは限らないので。
    text = text.replace(/\x1bnc\<(.*)\>/g, '\x1b');
    text = text.replace(/\x1bnr\<(.*)\>/g, '\x1b');
    text = text.replace(/\x1bn\<(.*)\>/g, '\x1b');

    return text;
};

//直接$gameActorsをreturnしたら駄目っぽかったので
//トリアコンタン氏のスクリプトを参考にした。
    Game_Message.prototype.actorName = function(n) {
        var actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : '';
    };

    Game_Message.prototype.partyMemberName = function(n) {
        var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : '';
    };

    //==========================================================
//	data
//	============
function BackLog(){}

BackLog.prototype.initialize = function() {
this._BackLogBusy=0;
this._nBackLogPage=null;


this._sNameBoxSet_ponidogBackLog="";
this._sNameBoxPrev_ponidogBackLog="";

};

BackLog.prototype.BackLogBusy =function(){
return this._BackLogBusy;
};

BackLog.prototype.nBackLogPage =function(){
return this._nBackLogPage;
};

BackLog.prototype.sNameBoxSet_ponidogBackLog =function(){
return this._sNameBoxSet_ponidogBackLog;
};
BackLog.prototype.sNameBoxPrev_ponidogBackLog =function(){
return this._sNameBoxPrev_ponidogBackLog;
};
//------

BackLog.prototype.BackLog_add = function(text) {


//console.log(nBackLogLimitMax);
//上限ログ数を付けてみたい
if(nBackLogLimitMax>0){
	if(an_BackLog.length>=nBackLogLimitMax)an_BackLog.shift();
}//nBackLogLimitMax>0


an_BackLog.push(text);
  //  this._texts.push(text);
};


BackLog.prototype.BackLog_isBusy = function(){
return this._BackLogBusy;}
    //==========================================================
    //
    //==========================================================
//■■■■■■■■■■■■■■■■■■■■■■■■■■■
BackLog.prototype.BackLog_Call = function(){


if(this._nBackLogPage<0 ||!this._nBackLogPage)this._nBackLogPage=0;
if(this._nBackLogPage==null)this._nBackLogPage=0;

an_BackLogNowText.delete;
an_BackLogNowText=[];


var sBackLog=an_BackLog;
var nBackLogPage= this._nBackLogPage;

//
if(this._nBackLogPage <= 0){
this._BackLogBusy=false;
return;}


var nBackLogLineNum=nBackLogDisplayLine;//
this._BackLogBusy=true;

if (sBackLog.length > 0) {


var nStart=sBackLog.length - nBackLogLineNum*(nBackLogPage);
if(nStart<=0 || nStart==null){
nStart=0;
//ページ遡りの上限
	nBackLogPage = sBackLog.length%nBackLogLineNum==0 ? parseInt(sBackLog.length/nBackLogLineNum)  :parseInt(sBackLog.length/nBackLogLineNum) +1 ;
	this._nBackLogPage=nBackLogPage;
		}

var nLast=nStart+nBackLogLineNum	//sBackLog.length - nBackLogLineNum*(nBackLogPage);


an_BackLogNowText[0]="##Log "+Number(nBackLogPage)+" Page ##";
var j=1;

for(var i= nStart;i< nLast ;i++){
if(sBackLog[i])an_BackLogNowText[j]=sBackLog[i] ;
if(!sBackLog[i])an_BackLogNowText[j]="";
	j++;
}//for



}//if (sBackLog.length > 0) {





return;
};//

//■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■

    //==========================================================
    //==========================================================
    //==========================================================


    //==========================================================
//	Sp
  //==========================================================
 function Buck_logSp() {
   this.initialize.apply(this, arguments);
}

Buck_logSp.prototype = Object.create(Sprite.prototype);
Buck_logSp.prototype.constructor = Buck_logSp;

Buck_logSp.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.createBitmap();
    this.update();
}; 


Buck_logSp.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(Graphics.width  , Graphics.height);
    this.bitmap.fontSize = 32;


};

Buck_logSp.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateVisibility();
};

Buck_logSp.prototype.updateBitmap = function() {
        this.redraw();
};

Buck_logSp.prototype.redraw = function() {
    var width = this.bitmap.width;
    var height = this.bitmap.height;
//drawTextのyは以下で計算する。
//var ty = y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;
//       = y+ lineHeight/2 -0.7*this.fontSize/2

    this.bitmap.clear();
var _s_rgba= "rgba(0,0,0,0.5)"; 
this.bitmap.fillAll(_s_rgba);



var i,nLast=0;
if(an_BackLogNowText)nLast=an_BackLogNowText.length -1;// 0から入るので

if(an_BackLogNowText ==null)return;



for(i=0 ;i<=nLast;i++){
    var text = this.BackLogText(i);
    this.bitmap.drawText(text, 10, 10 -height/2+0.7*this.bitmap.fontSize +this.bitmap.fontSize*i, width, height, 'Left');

}//for
};

Buck_logSp.prototype.BackLogText = function(i) {
    var sText= an_BackLogNowText[i];
if(sText==null)sText="";
    return sText;
};

Buck_logSp.prototype.updateVisibility = function() {
this.visible=false;
    if(oBackLog._BackLogBusy)this.visible = true;
};


//========表示======

//Spriteset_Base
Spriteset_Base.prototype.createBackLog = function() {
    this._BackLog = new Buck_logSp();
    this.addChild(this._BackLog);
};

var _Spriteset_Base_prototype_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
Spriteset_Base.prototype.createUpperLayer = function() {
 _Spriteset_Base_prototype_createUpperLayer.call(this);
    this.createBackLog();
 //   this.createBackLogButton();
};

var _Spriteset_Base_prototype_createSpriteset=Spriteset_Base.prototype.createSpriteset;
Spriteset_Base.prototype.createSpriteset = function() {
_Spriteset_Base_prototype_createSpriteset.call(this);
    this.createBackLog();
   // this.createBackLogButton();
};

    //==========================================================

var _Spriteset_Base_prototype_update = Spriteset_Base.prototype.update;
Spriteset_Base.prototype.update = function() {
_Spriteset_Base_prototype_update.call(this);
   this._BackLog.redraw();
};

//==============

    //==========================================================
    //==========================================================
    //==========================================================
    //==========================================================
    //==========================================================
    //==========================================================
    //==========================================================
//上書き


//クリック待ち中のウィンドウを消す。
//トリアコンタン氏のスクリプトを参考にした。
//バックログ実行中ならばウィンドウを全てハイドする
//またメッセージウィンドウを右クリックで隠す処理も追加した。
//

    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (oBackLog._BackLogBusy) {
                this.hide();
                this.subWindows().forEach(function(subWindow) { subWindow.hide(); });
            }
 else {


//右クリックを押した時に通常のメッセージウィンドウを消去する。
if (TouchInput.isCancelled()){ TouchInput.clear () ;  
//console.log("キャンセル");
if (this.visible) {
                this.hide();
                this.subWindows().forEach(function(subWindow) { subWindow.hide(); });
}  else {
 		this.show();
                this.subWindows().forEach(function(subWindow) { subWindow.show();});
	}

}//if (TouchInput.isCancelled()){

//メッセージウィンドウが隠れている場合、右クリックでも復帰するように処理
if (!this.visible) {
if (TouchInput.isTriggered () ){ TouchInput.clear () ;   
 		this.show();
                this.subWindows().forEach(function(subWindow) { subWindow.show();});
				}//
//ついでページダウンで戻った際もウィンドウを復帰表示
if (Input.isTriggered('pagedown') ||TouchInput._wheelY >0 ){ TouchInput.clear () ;   
 		this.show();
                this.subWindows().forEach(function(subWindow) { subWindow.show();});
				}//

}//if (!this.visible) {

            }// if (!oBackLog._BackLogBusy)
 
        return _Window_Message_updateWait.call(this);
    };

//--------------
//yepメッセージコアと競合するのでプラグインの順番に注意せざるをえない

    var _Window_Message_updateInput = Window_Message.prototype.updateInput;
Window_Message.prototype.updateInput = function() {



    if (this.isAnySubWindowActive()) {
        return true;
    }

//ボタンを押して呼び出しした場合のチェック
if(TouchInput.isTriggered()){

//もしセーブやスキップボタンを追加したいのなら
//別途変数を追加定義して
// if文の中に　oBackLog.ButtonPress(nSaveButtonId)
//等を付けたせばよい。ピクチャidね。
//そして押さえれたら実際の処理呼び出し。
//
if(oBackLog.ButtonPress(nBackLogButtonDownId)||oBackLog.ButtonPress(nBackLogButtonUpId) ){

if(oBackLog.ButtonPress(nBackLogButtonDownId))oBackLog._nBackLogPage--;
if(oBackLog.ButtonPress(nBackLogButtonUpId))oBackLog._nBackLogPage++;
            Input.update();         
TouchInput.update();  
oBackLog.BackLog_Call();
        return true;
}//if(oBackLog.ButtonPress(nBackLogButtonDownId)||oBackLog.ButtonPress(nBackLogButtonUpId) ){
}//if(TouchInput.isTriggered()


//バックログを表示中の処理
if(oBackLog._BackLogBusy){

//遡る
if (Input.isTriggered('pageup') ||TouchInput._wheelY <0 ){
            Input.update();   
oBackLog._nBackLogPage++;


oBackLog.BackLog_Call();
        return true;
}//pageup

//進める
if (Input.isTriggered('pagedown') ||TouchInput._wheelY >0 ){
            Input.update();   
oBackLog._nBackLogPage--;
oBackLog.BackLog_Call();
        return true;
}//pagedownn



//ページマイナスで閉じる。
if(oBackLog._nBackLogPage < 0){
 oBackLog._BackLogBusy=false;
 oBackLog._nBackLogPage=0;
            Input.clear();
            this.pause = false;
             //   this.terminateMessage();
//メッセージウィンドウを表示させる。
 		this.show();
                this.subWindows().forEach(function(subWindow) { subWindow.show();});
}//

//右クリック等でもバックログを閉じる。
if (this.isTriggered()){
 oBackLog._BackLogBusy=false;
 oBackLog._nBackLogPage=0;
//メッセージウィンドウを表示させる。
 		this.show();
                this.subWindows().forEach(function(subWindow) { subWindow.show();});
}//if (this.isTriggered()){


        return true;
}//oBackLog._BackLogBusy


    if (this.pause ) {






//backlog-call
        if (Input.isTriggered('pageup')&& !oBackLog._BackLogBusy || TouchInput._wheelY <0 && !oBackLog._BackLogBusy) {
            Input.update();         
oBackLog._nBackLogPage++;
oBackLog.BackLog_Call();
        return true;
        }//            Input


//通常のメッセージ処理
        if (this.isTriggered()) {
            Input.update();
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
        }//if (this.isTriggered()) 

        return true;
    }//if (this.pause)


    return false;



};
//上書きここまで
//--------------


//ボタン押したかどうか。
//マウスカーソルの位置がピクチャの範囲内にあるか調べる。
//メッセージ表示中でも判定が行えるようにしている。


BackLog.prototype.ButtonPress = function(picID) {

if($gameScreen.picture(picID)==null)return 0;
if($gameScreen.picture(picID)._visible==false)return 0;

        var tx = TouchInput.x;
        var ty = TouchInput.y;

var nPictureId=picID-1;
//配列の[0]に１番を入れて順に格納してるのでアクセスする際にずれを訂正しておく。

//
var nButtonW,nButtonH;

var w=parseInt(SceneManager._scene._spriteset._pictureContainer.children[nPictureId].width );//
var h=parseInt(SceneManager._scene._spriteset._pictureContainer.children[nPictureId].height);//
nButtonW=w;
nButtonH=h;

var nButton_X=parseInt($gameScreen.picture(picID)._x);
var nButton_Y=parseInt($gameScreen.picture(picID)._y);
var nButton_w= parseInt(nButtonW* $gameScreen.picture(picID)._scaleX/100);
var nButton_h= parseInt(nButtonH* $gameScreen.picture(picID)._scaleY/100);


//中心座標ならずれる
if($gameScreen.picture(picID)._origin==1){
nButton_X=nButton_X-w/2;
nButton_Y=nButton_Y-h/2;	
}//

return (tx >= nButton_X) && (tx <= nButton_X+nButton_w) && (ty >= nButton_Y) && (ty <= nButton_Y+nButton_h);
};




})();
