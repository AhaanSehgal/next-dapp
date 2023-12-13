//@ts-nocheck
"use client"
import dynamic from 'next/dynamic'

const Application = dynamic(
    () => import("@tria-sdk/authenticate"),
    { ssr: false }
)

const Tria = () => {
    return (
        <Application
            logo="https://www.empireofsight.com/assets/images/logo-icon.svg"
            dappName="Empire of Sight"
            dappDomain={window?.parent?.origin}
            primaryColor="#AAFF00"
            defaultChain="FUSE"
            supportedChains={["FUSE", "POLYGON"]}
        />
    )
}

export default Tria