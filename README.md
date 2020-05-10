# XpirlCamsicumMessageGenerator
巨大トウガラシ採取は３分半ぐらいしかポップしないため、最短経路で採取するための経路検索を行う。

## 利用環境
- TypeScript
- WebPack
- babel
- React（Hooks）

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
    + @types
    + component
    + data
    + function
    + lib
    + types

- public
  - 変更要素のないファイルの格納先
- src
  - @types
    - jsonから各データにマッピングするための`d.ts`形式ファイル
  - component
    - Reachのソースとコンポーネント
  - data
    - 位置情報などのデータ
  - function
    - App.tsxで流用する関数
  - lib
    - 共通的に使うライブラリ
  - types
    - 型定義をtypesで宣言

## ライセンス
MIT
