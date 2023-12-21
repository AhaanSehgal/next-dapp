//@ts-nocheck
"use client"
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import "@tria-sdk/authenticate/dist/index.css"

const Application = dynamic(
    () => import("@tria-sdk/authenticate"),
    { ssr: false }
)


const Tria = () => {

    const [defined, setDefined] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDefined(true)
        }
    }, [])

    return (
        <>
            {defined &&
                <Application
                    logo="https://www.empireofsight.com/assets/images/logo-icon.svg"
                    dappName="Empire of Sight"
                    dappDomain={"https://empireofsight.com"}
                    primaryColor="#AAFF00"
                    defaultChain="FUSE"
                    supportedChains={["FUSE", "POLYGON"]}
                    uiType="yes"
                />}
        </>
    )
}

export default Tria