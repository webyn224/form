# malt. design LP

PCを中心に制作した、FV → INTRO / EMPATHY → CHANGE → WORKS → STORY の静的LPです。SPは基本的な可変幅・積み替えに対応しています。フロントエンドは外部ライブラリ・外部フォント・通信に依存しません。

## ダウンロードして表示確認する

GitHubでこのLPのブランチを選択し、**Code → Download ZIP** からダウンロードしてください。ZIPを展開して、フォルダ直下の **`preview.html`** をブラウザで開くだけで表示できます。Node.jsのインストールやサーバー起動は不要です。HTMLだけを別の場所に移さず、`css/`・`js/`と同じフォルダに置いてください。

`index.html` は通常の開発・配信用、`preview.html` と `js/preview.js` は直接開くための生成ファイルです。更新時は `npm run build` でCSSと表示確認用ファイルを再生成します。`npm run build:preview` は表示確認用ファイルだけを再生成します。写真はプレースホルダー、相談窓口は準備中の案内です。

## 開発

Node.js 24 / npm 11 / Python 3 を使用。Sassとブラウザ検証用Playwrightは開発依存のみです。

```sh
npm ci
npm run build  # CSSと表示確認用ファイルを生成
npm run serve  # 静的配信、ポート8000
```

別のターミナルで `npm run watch` を実行するとSCSSの変更を監視します。編集元は `scss/` です。`css/style.css` は生成ファイルですが、ビルドなしでも配信できるようGitに含めています。SCSS変更時はCSSも再生成してください。

```sh
npm test
```

ブラウザ検証はインストール済みChromiumを利用します。既定は `/usr/bin/chromium`。別の場所なら `CHROMIUM_PATH=/path/to/chromium npm test`。テスト専用サーバーをポート8765で立ち上げ、終了時に停止します。5画面幅の横はみ出し、セクション構成、画像等の404、内部リンク、相談ダイアログのフォーカス・Escape、スクロール出現、動きを減らす設定、JavaScript無効時の可読性を確認します。

## デザインの狙い

いただいた参考画像に合わせ、白に近い背景と青みの墨色、ピーチからラベンダーへにじむ光、小さめの余白のあるタイポグラフィへ調整しました。FVは左側にコンパクトにまとめ、ダークなCTAと薄いピーチの下線をアクセントに。INTROは中央の文章 → 淡いラベンダーのThoughts → 想いを聞く文章という流れです。Thoughtsの言葉は少し位置をずらして浮かべ、小さな粒がスクロールとともに集まります。CHANGEはピーチ〜ラベンダーの背景に2列の連続した文章を配置。WORKSはご希望に沿って、当初の大小・上下のずれがある2列構成を維持しています。STORYは淡い背景と写真プレースホルダーで長文の呼吸をつくります。

大きな薄い英字は装飾用SVGテキスト（`aria-hidden`）です。内容は別の日本語見出しで伝え、本文・操作UIは必要なコントラストを確保しています。ノイズはローカルの `images/noise.svg` による薄い装飾で、外部通信はありません。

## ディレクトリとFLOCSS

```text
index.html
css/style.css                 # コンパイル済みCSS
scss/
├── foundation/               # reset / base / variable / mixin / function
├── layout/                   # header / main / footer
├── object/
│   ├── component/            # button / heading / inner
│   ├── project/              # top-fv / top-intro / top-change / top-works
│   │                         # top-story / consultation
│   └── utility/              # display（必要なものだけ）
└── style.scss                # @use の読み込み入口
js/
├── main.js                   # 初期化のみ
└── modules/                  # fade / particle / consultation
tests/smoke.cjs              # ブラウザ検証
scripts/build-preview.mjs    # 直接開けるpreviewの生成
images/noise.svg             # 背景用の微細なテクスチャ
```

- **Foundation**: CSS変数を `_variable.scss` に集約。色・フォント・余白・コンテンツ幅をここで変更。ブレイクポイントは同ファイルのSCSS変数。`_mixin.scss` にレスポンシブ・欧文ラベルの共通処理、`_function.scss` に単位換算。
- **Layout (`l-`)**: サイト全体のヘッダー・メイン・フッター。
- **Component (`c-`)**: 再利用するボタン、テキストリンク、見出し、インナー、スキップリンク。
- **Project (`p-`)**: トップ専用セクションと実績の繰り返し記事。単発の装飾は各Projectに閉じ込めます。
- **Utility (`u-`)**: 狭い画面だけの改行。用途が生じるまで余白・テキスト用ファイルを増やしません。

BEMの `block__element` / `block--modifier` を使用。IDはアンカーや見出しのアクセシブルな関連付けに限定し、スタイル・JSはクラス／data属性で選択しています。JS無効でも本文は表示され、`prefers-reduced-motion` ではフェード・グラデーション・粒の移動を止めます。

## 実績・写真の更新

`index.html` の `.p-top-works__list` 内にある `article.p-top-works-card` が1案件です。案件名、業種、説明、`dl` 内の「大切にしたこと」を差し替え、記事単位で複製してください。偶数番目の上下のずれはCSS側で自動適用されます。参考画像に合わせた改修後も、この実績の配置は維持しています。現時点では制作の成果や背景を推測せず、紹介文も準備中と明記しています。

各 `figure` のプレースホルダーを次のような画像に置き換えます。画像は `images/works/`、STORY写真は `images/story/` などに整理できます。

```html
<figure class="p-top-works-card__visual">
  <img
    src="images/works/all-hair.webp"
    alt="ALL HAIRのWebサイト画面"
    width="1200"
    height="900"
    loading="lazy"
    decoding="async"
  />
</figure>
```

実画像の比率を揃える場合は、`.p-top-works-card__visual img` に `aspect-ratio` と `object-fit` を指定します。STORYは `.p-top-story__photo` 内の `div[role="img"]` を画像に置き換え、文脈に沿ったaltと寸法を指定し、必要に応じて仮のfigcaptionも更新してください。

相談先は未提供なので、現在の「相談する」は準備中の案内ダイアログを開きます。公開前に実際のフォーム／メール／予約先が決まったら、`data-consultation` のボタンをリンクへ変更し、ダイアログと `consultation.js`、対応SCSSを取り除きます。既存サイトの外部送信処理はこのLPでは使用していません。

## SERVICE以降を追加するルール

1. `<main>` 内のSTORYの後に、見出しを持つsemanticな `<section class="p-top-service">` 等を追加。
2. `scss/object/project/_top-service.scss`（flow / price / about / ctaも同様）を追加し、`style.scss` で `@use`。
3. 色・間隔は既存トークン、幅・見出し・ボタンは既存Componentを利用。複数箇所で必要になったUIだけComponentへ移す。
4. JSが必要なら役割別モジュールを追加し `main.js` で初期化。インラインJS、IDに依存したスタイル、汎用的すぎるProjectクラスは避ける。
5. `npm run build` 後、セクションが増えた分だけテストの期待構成を更新し、`npm test` で確認。

## WordPress化で切り出す箇所

- `<head>` と `.l-header` → `header.php`、`.l-footer` → `footer.php`。CSSとES Modulesはenqueueを通して読み込み、テーマURIを使用。
- 各 `p-top-*` のsection → `template-parts/top/*.php`。`front-page.php` から順に呼び出す構成。
- 実績article → `template-parts/works/card.php`。カスタム投稿などのループへ差し替え、業種・説明・大切にしたこと・画像をデータ化。クラス構造は維持。
- STORYの文章と写真 → 固定ページの編集フィールド／ブロックへ。画像のalt・寸法・遅延読込はWordPressの画像APIで出力。
- ナビゲーションと相談先 → メニュー・設定フィールドへ。出力値に適切なエスケープ処理を適用。

静的段階から、各セクションの見出しID、繰り返しarticle、画像figure、共通UIを独立させています。テーマ化のために今からPHPや管理画面用ライブラリを導入する必要はありません。
