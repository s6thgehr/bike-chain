import Link from "next/link";

const BikeCard = ({ listing }) => {
  return (
    <Link
      href={{
        pathname: `/details/${listing.asset.address}`,
        query: {
          object: JSON.stringify(listing),
        },
      }}
    >
      <div className="transition transform duration-200 card bg-neutral shadow-xl mx-12 sm:mx-0 hover:scale-105">
        <figure className="hover:opacity-75 aspect-[4/3] ">
          <img
            className="h-full w-full object-cover object-center"
            src={listing.asset.json.image}
            alt="Bike"
          />
        </figure>

        <div className="card-body p-4">
          <h2 className="card-title text-neutral-content">
            {/* <span aria-hidden="true" className="absolute inset-0" /> */}
            <div className="flex flex-row gap-4 items-center">
              <p className="truncate"> {listing.asset.json.name}</p>

              <div className="badge badge-accent truncate">
                {listing.asset.json.attributes[0].value}
              </div>
            </div>
          </h2>

          <p className="text-neutral-content truncate mb-2">
            {listing.asset.json.description}
          </p>

          <div className="card-actions justify-start items-center gap-8">
            <div className="rounded-md px-3 py-1 w-fit text-secondary-content bg-secondary">
              {listing.asset.json.attributes[1].value}
            </div>
            <div className="rounded-md px-3 py-1 w-fit text-secondary-content bg-secondary">
              $ {listing.asset.json.attributes[2].value}
            </div>
          </div>
        </div>
      </div>{" "}
    </Link>
  );
};

export default BikeCard;
