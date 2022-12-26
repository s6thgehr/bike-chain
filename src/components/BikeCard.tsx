const BikeCard = ({ data: { imageUrl, model, type, city, price } }) => {
    return (
        <div className="card w-96 bg-base-100 shadow-xl group relative">
            <figure className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                <img
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    src={imageUrl}
                    alt="Shoes"
                />
            </figure>
            <div className="card-body first-letter px-2 pt-4">
                <h2 className="card-title">
                    <p>{model}</p>
                    <div className="badge badge-primary">{type}</div>
                </h2>
                <div className="card-actions justify-between">
                    <div className="badge badge-outline">{city}</div>
                    <div className="badge badge-outline">${price}</div>
                </div>
            </div>
        </div>
    );
};

export default BikeCard;
