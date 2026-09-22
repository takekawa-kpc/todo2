# [Feature] localStorage による永続化

**状態:** 未着手

## 背景
データはサーバーに依存せずブラウザ内で保持する（spec.md §5）。

## 内容
- キー `todo-app.items` で JSON として保存する
- データ構造: `{ "items": [{ id, text, done, createdAt, updatedAt }] }`
- 追加・編集・削除・完了切替の直後に保存する
- 読み込み時にパース失敗時は空リストで初期化し、壊れたデータを `todo-app.items.bak` にバックアップ
- `QuotaExceededError` 発生時はエラーを表示し既存データを保持する

## 受け入れ基準
- [ ] 変更のたびに localStorage に反映される
- [ ] 壊れた JSON を置いた場合、クラッシュせず空リスト + バックアップが作られる
- [ ] 容量超過時にエラーメッセージが表示され、既存データは失われない

## 関連
- spec.md §5.2, §5.3, §5.4, §7
