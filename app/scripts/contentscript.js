// iframe内のみを操作
if (window != parent) {
  const galleryItems = document.querySelectorAll('#gallery > li');

  galleryItems.forEach((galleryItem) => {
    const fileName = galleryItem
      .querySelector('.thumb_wrapper')
      .title.replace(/\.mp4$/, '') // 入っている場合がある
      .replace(/[\/\\\:\*\?"<>\|\.]+/g, '-') // ファイル名に使えない文字は置き換え
      .replace(/\s+/g, '_'); // スペースはダウンロードURL指定の際に使えない

    // hrefからvideoIDのみを抽出
    const videoId = galleryItem
      .querySelector('.item_link')
      .href.match(/(?<=\/)[a-zA-Z_0-9]*(?=\/\d+$)/);
    const targetUrl =
      'https://cdnapisec.kaltura.com/p/2075011/sp/207501100/playManifest/entryId/' +
      videoId +
      '/format/download/protocol/https/flavorParamIds/0';

    const dlBtn = document.createElement('input');
    dlBtn.type = 'button';
    dlBtn.value = 'ダウンロード';
    dlBtn.alt = 'download';
    dlBtn.style.position = 'absolute';
    dlBtn.style.right = 0;
    dlBtn.addEventListener('click', {
      targetUrl: targetUrl,
      fileName: fileName,
      handleEvent: downloadItem,
    });
    galleryItem.querySelector('.thumb_wrapper').appendChild(dlBtn);
  });
}

function downloadItem(ev) {
  // targetUrlにアクセスすると302コードが返ってくるが、そのままリダイレクトに従うとファイル名が不適切になる
  fetch(this.targetUrl, { method: 'GET' }).then((res) => {
    // res.urlは以下のようになっている
    // https://cfvod.kaltura.com/scf/pd/p/2075011/sp/207501100/serveFlavor/entryId/{id}/v/1/ev/3/flavorId/{id}/fileName/{全角文字等が_で置き換えられている}_(Source).mp4/name/a.mp4?{以下トークン}
    // /fileName/{任意の文字列}/name でダウンロードファイル名を指定できる

    const dlLink = document.createElement('a');

    // 適切なファイル名に修正
    dlLink.href = res.url.replace(
      /(?<=fileName\/).*(?=\..+?\/name)/,
      this.fileName
    );
    dlLink.click();
    dlLink.remove();
  });
  ev.preventDefault();
}
