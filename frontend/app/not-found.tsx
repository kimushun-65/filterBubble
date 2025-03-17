"use client";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">ページが存在しません</h1>
      <button
        className="mt-4 text-sky-500 hover:text-sky-600 hover:underline"
        onClick={() => (window.location.href = "/")}
      >
        ログインページへ戻る
      </button>
    </div>
  );
};

export default NotFound;
