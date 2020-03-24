# XpirlCamsicumMessageGenerator
巨大トウガラシ採取は３分半ぐらいしかポップしないため、最短経路で採取するための経路検索を行う。

## 開発環境
- TypeScript
- WebPack
- babel
- jQuery
  - 近い目標としてフロントエンドのフレームワークに完全移行

## ビルド方法
1. nodejsのインストールでnpmをインストール
2. プロジェクトのトップで依存関係を解決
3. 各種コマンドで生成

### 依存関係
- npm + webpackで管理をしている
```sh
npm install
```
- package.jsonにて以下のコマンドを有効にしている
  - `npm run build`
    - デバッグ用のmapファイルを出力する形式
  - `npm run production`
    - mapファイルを出力しない本番用の形式
  - `npm run dev`
    - リアルタイムにビルドする開発用

## ディレクトリ構成
- (プロジェクトroot)
  + dist
  + public
  - src
    + data
    + entity
    + libs
    + ts
    + types

- public
  - 変更要素のないファイルの格納先
- src
  - data
    - 位置情報などのデータ
  - entity
    - オブジェクトなデータ型を
  - libs
    - 共通的に使うライブラリ
  - ts
    - typescript本体
  - types
    - jsonから各データにマッピングするための`d.ts`形式ファイル

## ライセンス
MIT
