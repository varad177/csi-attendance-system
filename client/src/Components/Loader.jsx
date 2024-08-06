import React from 'react';
import img from '../assets/images/CSI_LOGO.png';

const Loader = ({msg}) => {
    return (
        <div className="w-full flex-col h-screen flex items-center justify-center">

            <div class="typewriter">
                <div class="slide"><i></i></div>
                <div class="paper"></div>
                <div class="keyboard"></div>
            </div>

            <p className='text-2xl max-md:text-xl font-bold mt-4'>{msg ? msg:""}</p>
        </div>

    );
};

export default Loader;
