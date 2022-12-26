import { FC, ReactNode } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
export const ContentContainer: FC<{ children: ReactNode }> = (props) => {
    const wallet = useWallet();

    return (
        <div className="flex-1 drawer h-52">
            {/* <div className="h-screen drawer drawer-mobile w-full"> */}
            <input
                id="my-drawer"
                type="checkbox"
                className="grow drawer-toggle"
            />
            <div className="items-center  drawer-content">{props.children}</div>

            {/* SideBar / Drawer */}
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="p-4 overflow-y-auto menu w-80 bg-base-100">
                    <li>
                        <h1>Menu</h1>
                    </li>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    {wallet.connected && (
                        <li>
                            <Link href="your-bikes">Your bikes</Link>
                        </li>
                    )}
                    <li>
                        <Link href="/basics">Airdrop</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};
