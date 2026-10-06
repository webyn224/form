# malt. design LP

PCを中心に制作した、FV → INTRO / EMPATHY → CHANGE → WORKS → STORY → WHAT I DO → SERVICE → FLOW → PRICE → ABOUT → CTA の静的LPです。SPは基本的な可変幅・積み替えに対応しています。フロントエンドは外部ライブラリ・外部フォント・通信に依存しません。

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

最初に指定された **FV → INTRO / EMPATHY → CHANGE → WORKS → STORY** の順序と、初版の見出し・本文を維持しています。参考画像から取り入れるのは、白に近い背景と青みの墨色、ピーチ〜ラベンダーのにじむ光、濃色のCTA、薄い英字、余白などの視覚表現だけです。参考画像をもとに追加した導入文やサブ見出しは削除し、INTROは悩みから返答へ文章として読む構成、CHANGEは1つずつ読む配置に戻しています。WORKSは大小・上下のずれがある2列構成、STORYは全ての原文と写真プレースホルダーを維持しています。今後のデザイン調整でも、承認なしにコピー・セクション構成を変えないでください。

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
│   │                         # top-story / top-what-i-do / top-service / top-flow
│   │                         # top-price / top-about / top-cta / consultation
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

## 続きのセクションと更新ルール

ユーザーから受け取った続きの原稿に沿って、以下を追加しています。既存5セクションの見出し・本文は変更していません。小さな章番号は今回の01〜11構成に合わせ、FVの「制作について見る」は新しいSERVICEへ移動します。

- `p-top-what-i-do`: Listen.／Find.／Design. の3ステップ。
- `p-top-service`: お客様の疑問と、それぞれに合ったWebサイトを一緒に考える本文。専門用語を前面に出しません。
- `p-top-flow`: 相談 → ヒアリング → ご提案・お見積り → デザイン → 制作 → 公開 → 必要に応じて運用サポート。`ol` の1項目単位で管理。
- `p-top-price`: 金額は未確定のため「準備中」。公開前に料金の目安・条件を確定して、このセクション内に入力してください。仮の金額、税区分、提供プランは作っていません。
- `p-top-about`: Web Designer／こいた ゆな／岡山、パン屋で9年間働いた経歴とmalt. designの名前の由来。写真はプレースホルダー。
- `p-top-cta`: いただいた相談への問いかけ。相談先URLが未提供のため、「相談してみる」は既存の準備中案内ダイアログを開きます。無料相談・無理な営業をしない等の未確定な条件は記載していません。

本文は候補として提示された原稿を使用しています。FLOW・PRICE・ABOUTの見出しは内容を示す中立的なラベルにしています。原稿の差し替えは対象のsection内だけで行い、他セクションを変更しないでください。新しい本文を独断で追加・要約しないでください。

追加・改修では、各Project専用のSCSSファイル、既存デザイントークン、共通Componentを利用してください。複数箇所で必要になったUIだけComponentへ移します。JSが必要なら役割別モジュールを追加して `main.js` で初期化し、インラインJSとIDに依存したスタイルを避けます。変更後は `npm run build` でCSSと直接開くためのpreviewを再生成し、`npm test` を実行してください。

## WordPress化で切り出す箇所

- `<head>` と `.l-header` → `header.php`、`.l-footer` → `footer.php`。CSSとES Modulesはenqueueを通して読み込み、テーマURIを使用。
- 各 `p-top-*` のsection → `template-parts/top/*.php`。`front-page.php` から順に呼び出す構成。
- 実績article → `template-parts/works/card.php`。カスタム投稿などのループへ差し替え、業種・説明・大切にしたこと・画像をデータ化。クラス構造は維持。
- STORYの文章と写真 → 固定ページの編集フィールド／ブロックへ。画像のalt・寸法・遅延読込はWordPressの画像APIで出力。
- ナビゲーションと相談先 → メニュー・設定フィールドへ。出力値に適切なエスケープ処理を適用。

静的段階から、各セクションの見出しID、繰り返しarticle、画像figure、共通UIを独立させています。テーマ化のために今からPHPや管理画面用ライブラリを導入する必要はありません。
