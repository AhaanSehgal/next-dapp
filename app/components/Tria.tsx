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
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 89,
                        height: 0,
                        width: 0,
                    }}
                >
                    <Application
                        logo="https://www.stackos.io/stackos-logo.svg"
                        dappName="Stack OS"
                        dappDomain={"https://dapp-testing-nine.vercel.app"}
                        uiType={"yes"}
                        primaryColor="#AAFF00"
                        defaultChain="FUSE"
                        supportedChains={["FUSE", "POLYGON"]}
                    />
                </div>
            }
        </>
    )
}

export default Tria