// iframe内のみを操作
if (window != parent) {
  const galleryItems = document.querySelectorAll('#gallery > li');

  galleryItems.forEach((galleryItem) => {
    // ファイル名に使えない文字は置き換え
    const fileName = galleryItem
      .querySelector('.thumb_wrapper')
      .title.replace(/[\/\\\:\*\?"<>\|\.]/, '-');

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
  // 302コードが返ってくるが、そのままリダイレクトに従うとファイル名が不適切になる
  fetch(this.targetUrl, { method: 'GET' }).then((res) => {
    const dlLink = document.createElement('a');

    // ファイル名を適切に指定するために、URLを修正
    dlLink.href = res.url.replace(/(?<=fileName\/).*?(?=\.)/, this.fileName);
    dlLink.click();
    dlLink.remove();
  });
  ev.preventDefault();
}
