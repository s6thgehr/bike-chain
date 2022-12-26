import { bikes } from "data/bikes";
import { useRouter } from "next/router";
import { DetailsView } from "views";

const bikeData = bikes;

const Details = () => {
    const router = useRouter();
    const { id } = router.query;
    const bike = bikes.filter((bike) => bike.id.toString() === id)[0];

    return <DetailsView bike={bike} />;
};

export default Details;
