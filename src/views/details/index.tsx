import axios from "axios";
import { FC, useEffect, useState } from "react";
import { MetaDataInterface } from "../../../types/MetaDataInterface";

export const DetailsView: FC<{ bike }> = ({ bike }) => {
  const [metaData, setMetaData] = useState<MetaDataInterface>();
  useEffect(() => {
    const fetchMetaData = async () => {
      await axios.get(bike.uri).then((response) => setMetaData(response.data));
    };
    fetchMetaData().catch((e) => console.log(e));
  }, [bike]);

  return metaData ? (
    <div className="flex">
      <div className="w-1/2">
        <img src={metaData.image} alt="bike" className="w-full" />
      </div>
      <div className="w-1/2 mx-8 grid grid-rows-5 grid-flow-col gap-4">
        <h2 className="pt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {bike.name}
        </h2>
        <p className="">{metaData.description}</p>
        <div className="flex flex-row">
          <div className="basis-1/2 flex flex-col justify-between">
            <div>
              <div className="font-bold inline">City:</div>{" "}
              {metaData.attributes[1].value}
            </div>
            <div className="mt-8">
              <div className="font-bold inline">Price:</div> $
              {metaData.attributes[2].value}
            </div>
          </div>
          <div className="mx-4">
            <div className="bg-white mx-auto px-4 text-black h-40 w-80 text-center">
              Maps Location
            </div>
          </div>
        </div>

        <label htmlFor="my-modal" className="btn btn-secondary text-black">
          Buy now
        </label>

        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Congratulations to your new bike!
            </h3>
            <p className="py-4">
              The combination to unlock the bike lock is: 123456
            </p>
            <div className="modal-action">
              <label htmlFor="my-modal" className="btn">
                Yay!
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};
