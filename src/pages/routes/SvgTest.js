import React from 'react';

function SVGTest(){
    return (
        <div>
            <svg width="400" height="200" viewBox="0 0 200 300" preserveAspectRatio="xMinYMin meet" style={{ border:'1px solid #cd0000' }} >
                <rect x="10" y="10" width="150" height="150" fill="#cd0000"/>
                <rect x="160" y="10" width="250" height="150" fill="rgba(0,0,0,0.3)"/>

            </svg>
        </div>
    )
}

export default SVGTest;