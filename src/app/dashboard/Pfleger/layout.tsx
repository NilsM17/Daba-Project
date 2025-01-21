import React from 'react'

export default function PflegerLayout({
    children,
}: Readonly<{
    children: React.ReactNode[];
}>) {
    return (
        <>
            {children}
        </>
    );
}
