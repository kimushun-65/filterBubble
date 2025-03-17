import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import toast, { Toaster } from "react-hot-toast";

interface SignUpModalProps {
  onClose?: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    // Basic validation
    if (!userName || !password) {
      toast.error("ユーザー名とパスワードを入力してください");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("パスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      // Add user to Firestore
      const userRef = collection(db, "users");
      await addDoc(userRef, {
        userName,
        password, // Note: In a real app, you should hash passwords
        createdAt: serverTimestamp(),
      });

      toast.success("アカウント作成成功");

      // Close modal if onClose prop exists
      if (onClose) {
        onClose();
      }

      // Navigate to home page after a short delay
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("アカウント作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-500">
      <div className="w-96 rounded-lg bg-white p-8 shadow-xl">
        <Toaster position="top-center" />

        <h2 className="mb-6 text-center text-2xl font-semibold text-slate-700">
          アカウント作成
        </h2>

        <div className="mb-4">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="ユーザー名"
            required
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="パスワード（確認）"
            required
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="flex-1 rounded bg-slate-700 py-3 text-white transition-colors hover:bg-slate-800 disabled:bg-slate-400"
          >
            {isLoading ? "処理中..." : "登録"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded border border-slate-300 py-3 text-slate-700 transition-colors hover:bg-slate-100"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
