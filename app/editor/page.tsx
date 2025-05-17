"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, tone, content }),
    });
    const data = await res.json();
    if (res.ok) {
      const postId = data.post.id;
      // Générer lien partageable
      const shareRes = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const shareData = await shareRes.json();
      setShareUrl(`${window.location.origin}/shared/${shareData.id}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <input
        className="text-2xl font-bold w-full outline-none mb-4"
        placeholder="Titre du document"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full h-[60vh] border rounded-md p-4 text-lg resize-none outline-none"
        placeholder="Écrivez votre document ici..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-4 flex items-center justify-between">
        <select
          className="border px-2 py-1 rounded"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="neutral">Ton neutre</option>
          <option value="friendly">Amical</option>
          <option value="formal">Formel</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer & Partager"}
        </button>
      </div>
      {shareUrl && (
        <div className="mt-4 text-green-600">
          Document partagé: <a className="underline" href={shareUrl}>{shareUrl}</a>
        </div>
      )}
    </div>
  );
}
