# API Response Saver

Chrome extention for capture and save API responses from specific URLs with high-resolution timestamps, organized by domain and path.

[日本語版はこちら](#日本語)

---

## Features

- **Main World Injection**: Reliably captures `fetch` and `XMLHttpRequest` calls before page scripts run.
- **Streaming Support**: Handles `text/event-stream` (e.g., ChatGPT responses) by waiting for the stream to finish before saving.
- **Automatic Organization**:
  - Creates folders by domain.
  - Includes URL path snippet in filenames.
  - High-resolution timestamps (milliseconds) to prevent filename collisions.
- **Privacy Focused**: Only intercepts requests matching your configured domain and URL prefixes.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top right.
4. Click **Load unpacked** and select the extension folder.

## Configuration

1. In `chrome://extensions`, find "API Response Saver" and click **Details** -> **Extension options**.
2. **Enable Extension**: Global toggle.
3. **Target Domains**: Enter domains (e.g., `chatgpt.com`).
4. **Target URL Prefixes**: Enter URL prefixes to capture (e.g., `https://chatgpt.com/backend-api/conversation`).
5. Click **Save Settings**.

## Automatic Saving (No dialogs)

To skip the "Save As" dialog for every file:
1. Go to Chrome Settings: `chrome://settings/downloads`.
2. Toggle **OFF** "Ask where to save each file before downloading".

---

<h1 id="日本語">日本語</h1>

特定のURLで始まるAPIレスポンスを、ドメインごとにフォルダ分けしてタイムスタンプ付きで保存するChrome拡張機能です。

## 主な機能

- **強力なキャプチャ**: ページ内の `fetch` および `XMLHttpRequest` を確実に補足します。
- **ストリーミング対応**: ChatGPT などのストリーミング形式（SSE）の応答も、完了を待機して保存します。
- **高度なファイル管理**:
  - ドメイン別のフォルダ分け。
  - URLパスをファイル名に含め、内容を識別しやすく。
  - ミリ秒単位のタイムスタンプ（衝突防止）。
- **プライバシー保護**: 設定したドメインとプレフィックスに一致する通信のみを捕捉します。

## インストール方法

1. このリポジトリをダウンロードまたはクローンします。
2. Chrome で `chrome://extensions` を開きます。
3. 右上の **「デベロッパー モード」** を有効にします。
4. **「パッケージ化されていない拡張機能を読み込む」** をクリックし、このフォルダを選択します。

## 設定方法

1. 拡張機能の詳細画面から **「拡張機能のオプション」** を開きます。
2. **対象ドメイン**: 捕捉を有効にするドメイン（例: `chatgpt.com`）を入力。
3. **対象URLプレフィックス**: 保存したいAPIのURLの始まり（例: `https://chatgpt.com/backend-api/conversation`）を入力。
4. 「設定を保存」をクリック。

## ダイアログなしで自動保存する方法

1. Chrome の設定（`chrome://settings/downloads`）を開きます。
2. **「ダウンロード前に各ファイルの保存場所を確認する」** を **オフ** にします。

