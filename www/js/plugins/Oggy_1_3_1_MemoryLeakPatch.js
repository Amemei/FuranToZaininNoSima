//=============================================================================
// Oggy_1_3_1_MemoryLeakPatch.js
//=============================================================================

var _Oggy_TextureRpgUid_SnapTexture = 1;

// NOTE: This code deeply depends on PIXI 1.4.0 implementation.
// See  TextureGarbageCollector.prototype.run()
Oggy_destroyTexture = function(uid) {
    if (!Graphics.isWebGL()) {
        // The target bug had caused about WebGL mode, so we don't touch Canvas mode.
        return;
    }
    
    var gc = Graphics._renderer.textureGC;
    var tm = gc.renderer.textureManager;
    var managedTextures = tm._managedTextures;
    var wasRemoved = false;
    var i,j;

    for (i = 0; i < managedTextures.length; i++)
    {
        var texture = managedTextures[i];
            if (texture.hasOwnProperty("rpgUid") && texture.rpgUid === uid) {
                tm.destroyTexture(texture, true);
                managedTextures[i] = null;
                wasRemoved = true;    
            }
    }

    if (wasRemoved)
    {
        j = 0;

        for (i = 0; i < managedTextures.length; i++)
        {
            if (managedTextures[i] !== null)
            {
                managedTextures[j++] = managedTextures[i];
            }
        }

        managedTextures.length = j;
    }
};

(function() {
    
var _Oggy_SceneManager_snapForBackground = SceneManager.snapForBackground;
SceneManager.snapForBackground = function() {
    if (this._backgroundBitmap) {
        Oggy_destroyTexture(_Oggy_TextureRpgUid_SnapTexture);
    }
    _Oggy_SceneManager_snapForBackground.call(this);
}

// NOTE: This code hides the original code (rpg_core.js) 
Bitmap.snap = function(stage) {
    var width = Graphics.width;
    var height = Graphics.height;
    var bitmap = new Bitmap(width, height);
    var context = bitmap._context;
    var renderTexture = PIXI.RenderTexture.create(width, height);
    renderTexture.baseTexture.rpgUid = _Oggy_TextureRpgUid_SnapTexture;// add by oggy
    if (stage) {
        Graphics._renderer.render(stage, renderTexture);
        stage.worldTransform.identity();
        var canvas = null;
        if (Graphics.isWebGL()) {
            canvas = Graphics._renderer.extract.canvas(renderTexture);
        } else {
            canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
        }
        context.drawImage(canvas, 0, 0);
    } else {
        //TODO: Ivan: what if stage is not present?
    }
    bitmap._setDirty();
    return bitmap;
};

})();

