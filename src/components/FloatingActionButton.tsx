import { useRouter } from "next/router";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const FloatingActionButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/bike/new")}
      className="fixed right-20 bottom-20 bg-secondary hover:brightness-90 text-neutral font-bold p-4 rounded-full"
    >
      <AiOutlinePlus size={40} className="text-white" />
    </button>
  );
};

export default FloatingActionButton;
