'use client';
import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    console.log(error);
    console.log(reset);
    return (
        <div>
            <h1>Error</h1>
            <p>{error.message}</p>
            <button onClick={reset}>Reset</button>
        </div>
    );
}