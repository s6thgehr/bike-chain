import { FC } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";

export const AddBikeCard: FC = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/bike/new")}>
      <div className="flex justify-center rounded-md border-2 border-dashed border-secondary px-6 pt-5 pb-6 w-48 h-48 hover:opacity-50">
        <div className="flex flex-col justify-center">
          <AiOutlinePlus className="text-4xl text-secondary mx-auto" />
          <label className="mt-2 text-sm font-medium text-secondary">
            AddBike
          </label>
        </div>
      </div>
    </button>
  );
};

export default AddBikeCard;
