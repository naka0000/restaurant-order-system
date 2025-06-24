# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## システム概要

小型飲食店向けのシンプルなオーダー管理システム。HTML/CSS/JavaScriptで構築されたウェブベースのアプリケーションで、Google Sheets APIと連携してデータを管理します。

## 開発環境とコマンド

### 基本開発コマンド
- フロントエンドのみのプロジェクト（HTML/CSS/JavaScript）
- 動作確認: ブラウザで直接HTMLファイルを開く
- メイン機能テスト: `index.html`をブラウザで開く
- スクリーンショット生成: `python screenshot.py`（開発確認用）

### テスト・デバッグ
- リアルタイム動作確認のため複数のブラウザタブでindex.htmlを開く
- ブラウザの開発者ツールのConsoleでJavaScriptエラーをチェック
- Google Sheets API連携はネットワークタブで確認

### Google Sheets API設定
API連携設定後はSETUP.mdの手順に従って設定：
1. Google Cloud ConsoleでSheets API有効化
2. APIキー取得
3. index.html内のSHEET_IDとAPI_KEYを設定

## コードアーキテクチャ

### メインファイル構成

- `index.html` - メインのオーダー入力・管理システム
- `sheets-api.js` - Google Sheets API連携用のOrderManagerクラス
- 追加機能モジュール:
  - `dashboard.html` - 売上分析ダッシュボード
  - `menu-management.html` - メニュー管理
  - `customer-management.html` - 顧客管理
  - `inventory.html` - 在庫管理
  - `staff-management.html` - スタッフ管理
  - `receipt-printer.html` - レシート印刷
  - `qr-order.html` - QRコード注文
  - `reservation.html` - 予約管理

### Google Sheets API連携

`sheets-api.js`のOrderManagerクラスが中心的な役割を果たし、以下のAPIを提供:
- `addOrder(orderData)` - 注文データの追加
- `getOrders()` - 注文一覧の取得  
- `updateOrderStatus(orderId, newStatus)` - 注文ステータス更新
- `initializeSheet()` - スプレッドシート初期化
- `generateOrderId()` - 一意の注文ID生成

### 主要アーキテクチャパターン
- **MVC分離**: sheets-api.jsがModel、HTMLがView、インラインJSがController
- **状態管理**: ブラウザのlocalStorageで一時保存、Google Sheetsで永続化
- **リアルタイム更新**: 定期的なAPI polling（5秒間隔）でデータ同期
- **レスポンシブUI**: CSSグリッドとFlexboxによるモバイルファースト設計

### スプレッドシート形式
| A列 | B列 | C列 | D列 | E列 | F列 |
|-----|-----|-----|-----|-----|-----|
| 注文ID | 日時 | テーブル | 注文内容 | 特記事項 | ステータス |

### 注文ステータス
- 受付 → 調理中 → 完成 → 提供済

### 設定項目
- `SHEET_ID` - Google スプレッドシートID（index.html:314行目）
- `API_KEY` - Google API キー（index.html:315行目）
- テーブル番号はHTMLのselectオプションで変更可能（index.html:125-135行目）

### エラーハンドリング
- API接続エラー時はlocalStorageにフォールバック
- 「Google Sheets設定が必要です」メッセージで設定不備を通知
- Try-catchブロックで例外処理を実装

## 日本語での開発

このプロジェクトは日本語で開発されており、UIテキスト、コメント、変数名などは日本語を使用しています。新しいコードや機能を追加する際は、既存のコードスタイルに合わせて日本語を使用してください。