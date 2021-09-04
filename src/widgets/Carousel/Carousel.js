import React, { useState, useEffect, useRef, } from 'react';
import './Carousel.less';
import { Input, message, Button, } from 'antd';
import HTTPUtils from '../../HTTPUtils/HTTPUtils';;
let timer = ''
export default function Carousel(props) {
    const [index, setIndex] = useState('0');
    const [isHover, setIsHover] = useState(false);
    const [left, setLeft] = useState(true)
    const leftClickDiv = () => {
        setLeft(true)
        let dex = parseInt(index);
        if(dex < 3) {
            dex += 1;
        }else {
            dex = 1;
        }
        setIndex(dex.toString())
    }
    const rightClickDiv = () => {
        setLeft(false)
        let dex = parseInt(index);
        if(dex > 1) {
            dex -= 1;
        }else {
            dex = 3;
        }
        setIndex(dex.toString())
    }
    useEffect(() => {
        if(!isHover) {
            timer = setTimeout(leftClickDiv, 3000);
        }
        return () => {
            timer && clearTimeout(timer)
        }
    }, [index])
    const clearMyTimer = () => {
        setIsHover(true)
        clearTimeout(timer)
    }
    const createMyTimer = () => {
        setIsHover(false)
        timer = setTimeout(leftClickDiv, 3000);
    }
    return (
        <div style={{position: 'relative', height: '400px'}} onMouseOver={clearMyTimer} onMouseOut={createMyTimer}>
            {/* <div className='aniDiv' style={{width: '400px', height: '200px', backgroundColor: '#9FEAF9', margin: '10px', position: 'absolute', right: 0, top: 0, boxShadow: '0 0 10px gray'}}>

            </div>
            <div className='aniDiv' style={{width: '400px', height: '200px', backgroundColor: '#9FEAF9', margin: '10px', position: 'absolute', left: 0, top: 0, boxShadow: '0 0 10px gray'}}>

            </div> */}
            <div className={ `allT ${index == '1' ? `${left ? 'aniDiv' : 'aniDivReverse'}` : `${index == '2' ? `${left ? 'ani2' : 'ani2Reverse'}` : `${index == '3' ? `${left ? 'anima3' : 'anima3Reverse'}` : ''}`}`}`}>
                <img src={props.data.length > 0 ? props.data[0].imageUrl : ''} style={{width: '100%', height: '100%'}}/>
            </div>
            <div className={ `allT1 ${index == '1' ? `${left ? 'ani2' : 'ani2Reverse'}` : `${index == '2' ? `${left ? 'anima3' : 'anima3Reverse'}` : `${index == '3' ? `${left ? 'aniDiv' : 'aniDivReverse'}` : ''}`}`}`}>
                <img src={props.data.length > 0 ? props.data[1].imageUrl : ''} style={{width: '100%', height: '100%'}}/>
            </div>
            <div className={ `allT2 ${index == '1' ? `${left ? 'anima3' : 'anima3Reverse'}` : `${index == '2' ? `${left ? 'aniDiv' : 'aniDivReverse'}` : `${index == '3' ? `${left ? 'ani2' : 'ani2Reverse'}` : ''}`}`}`}>
                <img src={props.data.length > 0 ? props.data[2].imageUrl : ''} style={{width: '100%', height: '100%'}}/>
            </div>
            <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 3, opacity: 0.5, display: 'flex', flexDirection: 'row'}}>
                <div style={{flex: 1, opacity: 0.5, cursor: 'pointer'}} onClick={leftClickDiv}>

                </div>
                <div style={{flex: 1, opacity: 0.5, cursor: 'pointer'}} onClick={rightClickDiv}>

                </div>
            </div>
        </div>
    )
}