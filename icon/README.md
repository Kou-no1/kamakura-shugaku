# アイコン

深緑の背景と金色の鳥居で、鎌倉の探検を表しています。小さいタブでも見分けられるよう、文字を使わず線を太くしています。

- `favicon.svg`：ベクター形式の基本図案。
- `favicon.ico`：16・32・48・64pxを含む従来ブラウザ用。
- `favicon-16.png`・`favicon-32.png`・`favicon-48.png`：タブ用。
- `apple-touch-icon.png`：180px、Apple端末のホーム画面用。
- `icon-192.png`・`icon-512.png`：192px・512pxのアプリ用。
- `maskable-512.png`：端末が丸や角丸に切り抜いても鳥居が残る、安全領域つきの512px画像。

HTMLとマニフェストは `./icon/` への相対パスを使用します。GitHub Pagesのリポジトリ名を含むURLでも、そのまま配置できます。1枚HTMLの教材書き出しでは、内蔵のSVGアイコンを使います。

再生成：`python3 scripts/build-icons.py`（Pillowが必要）。`favicon.svg`を変更した場合は、生成スクリプトの図形も同じ図案に合わせてください。
