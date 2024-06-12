"use client"

import QuoteClient from '../../../components/QuoteClient';
import ResetPasswordClient from '../../../components/ResetPasswordClient';
import { Suspense } from 'react';
import LoadingClient from '../../../components/LoadingClient';

export default function page() {

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 '>
            <div className='flex items-center justify-center bg-gradient-to-br from-violet-400/30 to-black/90 dark:bg-gradient-to-br'>
                <Suspense fallback={<LoadingClient/>}>
                    <ResetPasswordClient />
                </Suspense>
            </div>
            <div className='invisible lg:visible bg-white'>
                <QuoteClient/>
            </div>
        </div>
    )
}