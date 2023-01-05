import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MetaDataInterface } from "../../types/MetaDataInterface";

const BikeCard = ({ data }) => {
  const [metaData, setMetaData] = useState<MetaDataInterface>();
  useEffect(() => {
    const fetchMetaData = async () => {
      await axios.get(data.uri).then((response) => setMetaData(response.data));
    };
    fetchMetaData().catch((e) => console.log(e));
  }, [data]);

  return metaData ? (
    <div className="card w-96 bg-base-100 shadow-xl group relative">
      <figure className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          src={metaData.image}
          alt="Bike"
        />
      </figure>
      <div className="card-body first-letter px-2 pt-4">
        <h2 className="card-title">
          <Link href={`/details/${data.mintAddress}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            <p> {data.name}</p>
          </Link>
          <div className="badge badge-accent">
            {metaData.attributes[0].value}
          </div>
        </h2>
        <div className="card-actions justify-between">
          <div className="badge badge-outline">
            {metaData.attributes[1].value}
          </div>
          <div className="badge badge-outline">
            ${metaData.attributes[2].value}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default BikeCard;
