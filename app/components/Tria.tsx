//@ts-nocheck
"use client"
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import "authenticate-test-2/dist/index.css"

const Application = dynamic(
    () => import("authenticate-test-2"),
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
                    dappDomain={window?.parent?.origin}
                    primaryColor="#AAFF00"
                    defaultChain="FUSE"
                    supportedChains={["FUSE", "POLYGON"]}
                    uiType="yes"
                />}
        </>
    )
}

export default Tria