import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MetaDataInterface } from "../../types/MetaDataInterface";

const BikeCard = ({ listing }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl group relative">
      <figure className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          src={listing.asset.json.image}
          alt="Bike"
        />
      </figure>
      <div className="card-body first-letter px-2 pt-4">
        <h2 className="card-title">
          <Link
            href={{
              pathname: `/details/${listing.asset.address}`,
              query: {
                object: JSON.stringify(listing),
              },
            }}
          >
            {/* <Link href={`/details/${listing.tradeStateAddress}`}> */}
            <span aria-hidden="true" className="absolute inset-0" />
            <p> {listing.asset.json.name}</p>
          </Link>
          <div className="badge badge-accent">
            {listing.asset.json.attributes[0].value}
          </div>
        </h2>
        <div className="card-actions justify-between">
          <div className="badge badge-outline">
            {listing.asset.json.attributes[1].value}
          </div>
          <div className="badge badge-outline">
            ${listing.asset.json.attributes[2].value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
