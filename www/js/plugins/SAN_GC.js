//=============================================================================
// SAN_GC.js
//=============================================================================
// Copyright (c) 2016-2017 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc ガベージコレクター 1.1.3
 * 使用済の画像オブジェクトのメモリを開放します。
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.1.3 2017/01/01 不要コード削除。更新履歴の日付の誤りを修正。
 * 1.1.2 2016/12/30 ヘルプを修正。天候の表示の対応コードを削除。
 * 1.1.1 2016/12/22 GCタイミングをシーン終了時から生成時に変更。
 * 1.1.0 2016/12/21 GCタイミングをシーン開始時から終了時に変更。プラグインパラメータ名変更。初期値をver1.0.1以前の値に復元。
 * 1.0.2 2016/12/20 ヘルプに競合の回避方法を追記。プラグインパラメータの初期値を変更。メモリ使用状況表示の一部簡略化。
 * 1.0.1 2016/12/13 リファクタリング。
 * 1.0.0 2016/12/09 正規版公開
 * 
 * @param MaxChacheSizeMB
 * @desc 画像キャッシュのメモリ使用量の上限です。[MB]
 * 少なすぎると画像が正常に表示されなくなる場合があります。
 * @default 200
 * 
 * @param NonChacheSizeMB
 * @desc 画像キャッシュ外の画像のメモリ使用量の上限です。[MB]
 * 競合発生時にこの値を増やすと回避できる可能性があります。
 * @default 0
 * 
 * @param ShowStats
 * @desc メモリ使用状況のコンソール表示の有効化スイッチです。
 * "ON"で有効化します。
 * @default OFF
 * 
 * @help
 * ■概要
 * 使用済の画像オブジェクト(Bitmapオブジェクト)の
 * メモリを開放(ガベージコレクト/GC)します。
 * 
 * 画像キャッシュ外の使用済の画像オブジェクトのメモリはすべて解放されます。
 * また画像キャッシュのメモリ使用量が設定した上限値を超過した場合
 * 画像キャッシュ内の画像オブジェクトのメモリを
 * アクセスの古い順から超過した分だけ解放します。
 * 使用中の画像オブジェクトのメモリは解放されません。
 * 
 * ■ガベージコレクト実行タイミング
 * 次のタイミングでガベージコレクトが実行されます。
 * ・シーン生成時
 * ・マップシーンの場所移動時
 * ・バトルシーンのターン終了時
 * 
 * ■画像キャッシュのメモリ使用量上限の設定
 * プラグインパラメータ「MaxChacheSizeMB」により
 * 画像キャッシュのメモリ使用量の上限を設定します。
 * 設定値が少なすぎると画像が正常に表示されなくなる場合があります。
 * また多すぎるとガベージコレクトの処理にかかる時間が増加します。
 * 100～300[MB]程度の設定を推奨します。
 * 
 * ■画像キャッシュ外のメモリ使用量上限の設定
 * プラグインパラメータ「NonChacheSizeMB」により
 * 画像キャッシュ外かつ未表示の画像オブジェクトの
 * メモリ使用量の上限を設定できます。
 * この数値を設定するとキャッシュ外の画像オブジェクトを
 * 設定したメモリ量だけ解放せずに保持するようになります。
 * 
 * ■競合を回避するために
 * お使いのプラグインによっては競合によるエラーが発生する場合があります。
 * 他プラグインによって生成された必要な画像オブジェクトが
 * 「SAN_GC」によって解放されるとエラーが発生します。
 * 他プラグインに次のコードがある場合は少しだけ警戒してください。
 * 
 *     new Bitmap
 * 
 * ほとんどの場合は問題なく動作しますが
 * もしエラーが発生する場合は次の2つの方法のいずれかで回避できます。
 * 
 * ・画像オブジェクトのキャッシュ登録(上級者向け)
 *   画像(Bitmap)オブジェクトを画像キャッシュに登録する方法です。
 *   キャッシュ登録された画像オブジェクトは
 *   メモリ使用量が上限値を越えない限りメモリ解放されず、
 *   また新しい画像オブジェクトほど優先的に保護されます。
 *   他プラグインに次のようなコードがある場合
 *   キャッシュ登録するように書き換えてください。
 * 
 *     // 書き換え前
 *     var bitmap = new Bitmap(48, 48);
 * 
 *     // 書き換え後
 *     var bitmap = ImageManager.cache.getItem('UniqueCacheKey');
 *     if (!bitmap) {
 *         bitmap = new Bitmap(48, 48);
 *         ImageManager.cache.setItem('UniqueCacheKey', bitmap);
 *     }
 * 
 *     // 'UniqueCacheKey'はキャッシュキーです。
 *     // 一意に定まる文字列を設定してください。
 * 
 * ・画像キャッシュ外のメモリ使用量上限の設定(初級者向け)
 *   プラグインパラメータ「NonChacheSizeMB」の設定の数値を増やす方法です。
 *   これにより画像キャッシュ外の画像オブジェクトも保護するようになります。
 *   50[MB]もあればかなり安全です(過剰かもしれません)。
 * 
 * これら2つの方法のうち「画像オブジェクトのキャッシュ登録」のほうが
 * より安全です。
 * 
 * ■参考情報・謝辞
 * このプラグイン「SAN_GC」はliply氏によるプラグイン「liply_GC」と
 * 以下の解説記事の情報をもとに作成されました。
 * 
 * ・liplyのブロマガ
 *   RPGツクールMVのモバイルブラウザにおける
 *   描画・メモリの解説（メモリパッチ付き）
 *   http://ch.nicovideo.jp/liply/blomaga/ar1124914
 *   ※「liply_GC」のダウンロードURLは解説記事中にあり
 * 
 * 「liply_GC」の一部引用、及び「SAN_GC」を公開することを
 * 快諾してくださったliply氏に感謝します。
 * また、このプラグインを試用、報告してくださった皆様に感謝します。
 * ありがとうございます＞＜。
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

var Imported = Imported || {};
Imported.SAN_GC = true;

var Sanshiro = Sanshiro || {};
Sanshiro.GC = Sanshiro.GC || {};
Sanshiro.GC.version = '1.1.3';

(function(SAN) {
'use strict';

//-----------------------------------------------------------------------------
// Bitmap
//
// ビットマップ

// 1ピクセルあたりの使用メモリ量[Byte]
Bitmap._pixelMemorySize = 4;

// オブジェクト初期化
var _Bitmap_initialize = Bitmap.prototype.initialize;
Bitmap.prototype.initialize = function(width, height) {
    _Bitmap_initialize.call(this, width, height);
    ImageManager.pushCreatedBitmap(this);
};

// 使用中のメモリ量
Bitmap.prototype.memorySize = function() {
    var memorySize = (
        this.canvas.width *
        this.canvas.height *
        Bitmap._pixelMemorySize
    );
    return memorySize;
};

// メモリ解放
Bitmap.prototype.free = function() {
    this.baseTexture.destroy();
    this.baseTexture.hasLoaded = false;
};

//-----------------------------------------------------------------------------
// CacheEntry
//
// キャッシュエントリー

// メモリ解放
var _CacheEntry_free = CacheEntry.prototype.free;
CacheEntry.prototype.free = function(byTTL) {
    this.cache.keyQueue().removeItem(this.key);
    _CacheEntry_free.call(this, byTTL);
};

//-----------------------------------------------------------------------------
// CacheMap
//
// キャッシュマップ

// キーのキュー
CacheMap.prototype.keyQueue = function() {
    if (!this._keyQueue) {
        this._keyQueue = new CacheQueue();
    }
    return this._keyQueue;
};

// 要素の取得
var _CacheMap_getItem = CacheMap.prototype.getItem;
CacheMap.prototype.getItem = function(key) {
    var item = _CacheMap_getItem.call(this, key);
    if (!!item) {
        this.pushKey(key);
    }
    return item;
};

// 要素の追加
var _CacheMap_setItem = CacheMap.prototype.setItem;
CacheMap.prototype.setItem = function(key, item) {
    var entry = _CacheMap_setItem.call(this, key, item);
    if (!!entry) {
        this.pushKey(key);
    }
    return entry;
};

// キーの追加
CacheMap.prototype.pushKey = function(key) {
    this.keyQueue().pushItem(key);
};

// 要素の除去
CacheMap.prototype.removeItem = function(item) {
    var key = this.key(item);
    if (!!key) {
        // キャッシュマップからの除去はキャッシュエントリーが行う
        var entry = this._inner[key];
        entry.free();
    }
};

// キーの取得
CacheMap.prototype.key = function(item) {
    for (var key in this._inner) {
        if (this._inner[key].item === item) {
            return key;
        }
    }
    return undefined;
};

// 全要素の取得
CacheMap.prototype.items = function() {
    var items = [];
    var keys = this.keyQueue().items();
    keys.forEach(function(key) {
        items.push(this._inner[key].item);
    }, this);
    return items;
};

//-----------------------------------------------------------------------------
// CacheQueue
//
// キャッシュキュー(重複除外キュー)

function CacheQueue() {
    this.initialize.apply(this, arguments);
}

// オブジェクト初期化
CacheQueue.prototype.initialize = function() {
    this._items = [];
};

// 要素の追加
CacheQueue.prototype.pushItem = function(item) {
    this.removeItem(item);
    this._items.push(item);
};

// 要素の除去
CacheQueue.prototype.removeItem = function(item) {
    var index = this._items.indexOf(item);
    if (index !== -1) {
        this._items.splice(index, 1);
    }
};

// 要素の取り出し
CacheQueue.prototype.shiftItem = function() {
    var bitmap = this._data.shift();
    return bitmap;
};

// 要素のリスト
CacheQueue.prototype.items = function() {
    var items = [];
    this._items.forEach(function(item) {
        items.push(item);
    });
    return items;
};

//-----------------------------------------------------------------------------
// ImageManager
//
// イメージマネージャー

// ガベージコレクト状況の表示有効化スイッチ
ImageManager._showGcStats = (
    PluginManager.parameters('SAN_GC')['ShowStats'] === 'ON'
);

// キャッシュの最大メモリ量[Byte]
ImageManager._maxChacheMemorySize = Math.max(0,
    Number(PluginManager.parameters('SAN_GC')['MaxChacheSizeMB']) *
    (1024 * 1024)
);

// キャッシュ外かつ未表示の画像オブジェクトの最大メモリ量[Byte]
ImageManager._nonChacheMemorySize = Math.max(0,
    Number(PluginManager.parameters('SAN_GC')['NonChacheSizeMB']) *
    (1024 * 1024)
);

// 生成されたビットマップのキュー
ImageManager._createdBitmapQueue = new CacheQueue();

// システムビットマップのキュー
ImageManager._systemBitmapQueue = new CacheQueue();

// ガベージコレクト回数
ImageManager._gcCount = 0;

// 生成されたビットマップのリスト
ImageManager.createdBitmaps = function() {
    return this._createdBitmapQueue.items();
};

// キャッシュ登録されたビットマップのリスト
ImageManager.cachedBitmaps = function() {
    return this.cache.items();
};

// システムビットマップのリスト
ImageManager.systemBitmaps = function() {
    return this._systemBitmapQueue.items();
};

// 使用中のビットマップのリスト
ImageManager.aliveBitmaps = function() {
    return SceneManager.aliveBitmaps();
};

// 生成されたビットマップの使用中のメモリ量[Byte]
ImageManager.createdBitmapMemorySize = function() {
    var bitmaps = this.createdBitmaps();
    var memorySize = this.bitmapsMemorySize(bitmaps);
    return memorySize;
};

// キャッシュ登録されたビットマップのメモリ量[Byte]
ImageManager.cachedBitmapMemorySize = function() {
    var bitmaps = this.cache.items();
    var memorySize = this.bitmapsMemorySize(bitmaps);
    return memorySize;
};

// ビットマップリストのメモリ量[Byte]
ImageManager.bitmapsMemorySize = function(bitmaps) {
    var memorySize = 0;
    bitmaps.forEach(function(bitmap) {
        memorySize += bitmap.memorySize();
    });
    return memorySize;
};

// 生成されたビットマップの登録
ImageManager.pushCreatedBitmap = function(bitmap) {
    this._createdBitmapQueue.pushItem(bitmap);
};

// システムビットマップの登録
ImageManager.pushSystemBitmap = function(bitmap) {
    this._systemBitmapQueue.pushItem(bitmap);
};

// ガベージコレクト
ImageManager.gc = function() {
    this.deleteNonCachedBitmaps();
    this.deleteCachedBitmaps();
    this._gcCount++;
    if (this._showGcStats) {
        this.printGcStats();
    }
};

// キャッシュ登録されていないビットマップの削除
ImageManager.deleteNonCachedBitmaps = function() {
    var protectedBitmaps = (new Array()).concat(
        this.cachedBitmaps(),
        this.aliveBitmaps(),
        this.systemBitmaps()
    );
    var candidateBitmaps = this.createdBitmaps().filter(function(bitmap) {
        return protectedBitmaps.indexOf(bitmap) === -1;
    });
    var maxMemorySize = this._nonChacheMemorySize;
    this.deleteBitmaps(candidateBitmaps, maxMemorySize);
};

// キャッシュ登録されたビットマップの削除
ImageManager.deleteCachedBitmaps = function() {
    var protectedBitmaps = (new Array()).concat(
        this.aliveBitmaps(),
        this.systemBitmaps()
    );
    var candidateBitmaps = this.cachedBitmaps().filter(function(bitmap) {
        return protectedBitmaps.indexOf(bitmap) === -1;
    });
    var maxMemorySize = this._maxChacheMemorySize;
    this.deleteBitmaps(candidateBitmaps, maxMemorySize);
};

// ビットマップリストによるビットマップの削除
ImageManager.deleteBitmaps = function(bitmaps, maxMemorySize) {
    var bitmapsMemorySize = this.bitmapsMemorySize(bitmaps);
    for(var i = 0; i < bitmaps.length; i++) {
        if (!!maxMemorySize && bitmapsMemorySize <= maxMemorySize) {
            break;
        }
        bitmapsMemorySize -= bitmaps[i].memorySize();
        this.deleteBitmap(bitmaps[i]);
    }
};

// ビットマップの削除
ImageManager.deleteBitmap = function(bitmap) {
    this.removeBitmap(bitmap);
    bitmap.free();
};

// キャッシュとキューからビットマップを除去
ImageManager.removeBitmap = function(bitmap) {
    this._createdBitmapQueue.removeItem(bitmap);
    this._systemBitmapQueue.removeItem(bitmap);
    this.cache.removeItem(bitmap);
};

// システムビットマップのロード
var _ImageManager_loadSystem = ImageManager.loadSystem; 
ImageManager.loadSystem = function(filename, hue) {
    var bitmap = _ImageManager_loadSystem.call(this, filename, hue);
    this._systemBitmapQueue.pushItem(bitmap);
    return bitmap;
};

// エンプティビットマップのロード
var _ImageManager_loadEmptyBitmap = ImageManager.loadEmptyBitmap; 
ImageManager.loadEmptyBitmap = function() {
    var bitmap = _ImageManager_loadEmptyBitmap.call(this);
    this._systemBitmapQueue.pushItem(bitmap);
    return bitmap;
};

// 通常のビットマップのロード
var _ImageManager_loadNormalBitmap = ImageManager.loadNormalBitmap;
ImageManager.loadNormalBitmap = function(path, hue) {
    var bitmap = _ImageManager_loadNormalBitmap.call(this, path, hue);
    return bitmap;
};

// ガベージコレクト状況の表示
ImageManager.printGcStats = function() {
    console.log("======== SAN_GC ========");
    this.printGcCount();
    this.printBitmapNumber();
    this.printMemorySize();
    this.printCachedBitmapNumber();
    this.printCachedBitmapMemorySyze();
};

// ガベージコレクト回数の表示
ImageManager.printGcCount = function() {
    console.log("count : " + this._gcCount);
};

// 画像オブジェクトの個数の表示
ImageManager.printBitmapNumber = function() {
    var bitmapNumber = this.createdBitmaps().length;
    console.log("AllBitmapNum : " + bitmapNumber);
};

// 画像オブジェクトのメモリ量の表示
ImageManager.printMemorySize = function() {
    var m = (1024 * 1024);
    var memorySizeMb = Math.round(this.createdBitmapMemorySize() / m);
    console.log("AllMemSizeMB : " + memorySizeMb);
};

// キャッシュ登録された画像オブジェクトの個数の表示
ImageManager.printCachedBitmapNumber = function() {
    var bitmapNumber = this.cachedBitmaps().length;
    console.log("CachedBitmapNum : " + bitmapNumber);
};

// キャッシュ登録された画像オブジェクトのビットマップ数の表示
ImageManager.printCachedBitmapMemorySyze = function() {
    var m = (1024 * 1024);
    var memorySizeMb = Math.round(this.cachedBitmapMemorySize() / m);
    console.log("CachedMemSizeMB : " + memorySizeMb);
};

//-----------------------------------------------------------------------------
// SceneManager
//
// シーンマネージャー

// 生存中のビットマップリスト
SceneManager.aliveBitmaps = function() {
    var bitmaps = [];
    this.collectAliveBitmaps(this._scene, bitmaps);
    if (!!this.backgroundBitmap()) {
        bitmaps.push(this.backgroundBitmap());
    }
    return bitmaps;
};

// 生存中のビットマップの収集
SceneManager.collectAliveBitmaps = function(target, bitmaps) {
    if (!!target.bitmap) {
        bitmaps.push(target.bitmap);
    }
    if (!!target.children) {
        target.children.forEach(function(child) {
            this.collectAliveBitmaps(child, bitmaps);
        }, this);
    }
};

//-----------------------------------------------------------------------------
// BattleManager
//
// バトルマネージャー

// ターンの終了
var _BattleManager_endTurn = BattleManager.endTurn;
BattleManager.endTurn = function() {
    _BattleManager_endTurn.call(this);
    ImageManager.gc();
};

//-----------------------------------------------------------------------------
// Scene_Base
//
// シーンベース

// シーンの生成
var _Scene_Base_create = Scene_Base.prototype.create;
Scene_Base.prototype.create = function() {
    _Scene_Base_create.call(this);
    ImageManager.gc();
};

}) (Sanshiro);
