import { FC } from "react";
import { AiOutlinePlus } from "react-icons/ai";

export const AddBikeCard: FC = () => {
    return (
        <button onClick={() => console.log("clicked")}>
            <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 w-48 h-48 hover:opacity-50">
                <div className="flex flex-col justify-center">
                    <AiOutlinePlus className="text-4xl text-gray-400 mx-auto" />
                    <label className="mt-2 text-sm font-medium text-gray-500">
                        AddBike
                    </label>
                </div>
            </div>
        </button>
    );
};

export default AddBikeCard;
