import AddBikeCard from "components/AddBikeCard";
import BikeCard from "components/BikeCard";
import { FC, useState } from "react";
import useBikeStore from "stores/useBikeStore";

export const YourBikesView: FC = ({}) => {
    const bikes = useBikeStore((state) => state.bikes);

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col w-screen">
                <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                    Your Bikes
                </h1>
                {/* CONTENT GOES HERE */}
                <div className="mt-16 text-center flex flex-row flex-wrap gap-24 justify-start w-full">
                    <AddBikeCard />
                    {bikes.length > 0 &&
                        bikes.map((bike) => {
                            return <BikeCard key={bike.id} data={bike} />;
                        })}
                </div>
            </div>
        </div>
    );
};
