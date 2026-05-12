"use client";

import React, { useState, useEffect } from 'react';

// メモのデータ型
type Memo = {
  id: string;
  text: string;
  createdAt: string;
};

export default function CuteChatMemo() {
  const [inputValue, setInputValue] = useState('');
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回読み込み時に、ブラウザの記憶（localStorage）からメモを復元する
  useEffect(() => {
    const savedMemos = localStorage.getItem('cute-memos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
    setIsLoaded(true);
  }, []);

  // メモが追加されるたびに、ブラウザの記憶を更新する
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cute-memos', JSON.stringify(memos));
    }
  }, [memos, isLoaded]);

  const addMemo = () => {
    if (!inputValue.trim()) return;

    const newMemo: Memo = {
      id: crypto.randomUUID(), // ランダムなIDを生成
      text: inputValue,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // 例: "14:30"
    };

    setMemos([...memos, newMemo]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    addMemo();
  };

  // 画面のチラつき防止（データ読み込み完了まで何も表示しない）
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-10 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-6 flex flex-col h-[80vh]">
        
        {/* ヘッダー部分 */}
        <div className="flex items-center gap-3 border-b pb-4 mb-4">
          <div className="text-4xl">🐻</div>
          <div>
            <h1 className="text-xl font-bold text-gray-700">くまのメモ帳</h1>
            <p className="text-xs text-gray-400">あなたのつぶやき、覚えておきます🌱</p>
          </div>
        </div>

        {/* メモ（チャット）表示エリア */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
          {memos.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 text-sm">
              予定やTodoをつぶやいてみてね！
            </div>
          ) : (
            memos.map((memo) => (
              <div key={memo.id} className="flex flex-col items-end">
                <div className="bg-green-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  {memo.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mr-1">{memo.createdAt}</span>
              </div>
            ))
          )}
        </div>

        {/* 入力エリア */}
        <div className="mt-4 flex gap-2 items-center bg-gray-50 p-2 rounded-full border border-gray-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ここにメモを入力..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700"
          />
          <button
            onClick={addMemo}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95"
          >
            ↑
          </button>
        </div>

      </div>
    </div>
  );
}