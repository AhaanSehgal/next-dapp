//@ts-nocheck
"use client"
import dynamic from 'next/dynamic'
import "authenticate-test-2/dist/index.css"
import { useState } from 'react'
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
                    logo="https://www.stackos.io/stackos-logo.svg"
                    dappName="Stack OS"
                    dappDomain={window?.parent?.origin}
                    uiType={"yes"}
                    primaryColor="#AAFF00"
                    defaultChain="FUSE"
                    supportedChains={["FUSE", "POLYGON"]}
                />}
        </>
    )
}

export default Tria