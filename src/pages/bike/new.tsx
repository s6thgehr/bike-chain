import BikeForm from "../../components/BikeForm";
import axios from "axios";
import { useRouter } from "next/router";

function NewBike() {
    const router = useRouter();

    return (
        <div className="flex justify-center my-16">
            <BikeForm
                formData={{
                    model: "",
                    type: "",
                    description: "",
                    imageUrl: "",
                    city: "",
                    price: "",
                }}
                handleSubmit={(x) => console.log(x)}
            />
        </div>
    );
}

export default NewBike;
