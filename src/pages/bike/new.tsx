import BikeForm from "../../components/BikeForm";
import { useRouter } from "next/router";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
    bundlrStorage,
    Metaplex,
    walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

function NewBike() {
    const router = useRouter();
    const wallet = useWallet();
    const { connection } = useConnection();

    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(
            bundlrStorage({
                address: "https://devnet.bundlr.network",
                providerUrl: "https://api.devnet.solana.com",
                timeout: 60000,
            })
        );

    async function handleSubmit(formData) {
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: formData.model,
            description: formData.description,
            image: formData.imageUrl,
            attributes: [
                { trait_type: "bike_type", value: formData.type },
                { trait_type: "city", value: formData.city },
                { trait_type: "price", value: formData.price },
            ],
        });

        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: formData.model,
            sellerFeeBasisPoints: 0,
            collection: new PublicKey(
                "2ULpn2o8yVFbvSumUWHXiZPifk76W2jGU59Vy5v9z2zP"
            ),
        });

        console.log(nft);

        router.push("/your-bikes");
    }

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
                handleSubmit={handleSubmit}
            />
        </div>
    );
}

export default NewBike;
