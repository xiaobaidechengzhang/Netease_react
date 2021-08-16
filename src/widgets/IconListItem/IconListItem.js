import React, { useState, useEffect, useRef, } from 'react';
import { Input, message, Button, } from 'antd';
import HTTPUtils from '../../HTTPUtils/HTTPUtils';
import './IconListItem.less';

export default function IconListItem(props) {
    const [activeIndex, setActiveIndex] = useState('-1');
    const overDiv = (e) => {
        console.log('over')
        console.log(e.target.innerHTML)
        console.log(e.target.id)
        setActiveIndex(e.target.id)
    }
    const outDiv = (e) => {
        console.log('out')
        console.log(e)
        setActiveIndex('-1')
    }
    console.log(activeIndex)
    return (
        <div style={{  }}>
            <div id='0' className={`noExpand  ${activeIndex != '-1' ? (activeIndex == '0' ? 'expand' : 'small') : ''}`} onMouseOver={overDiv} onMouseOut={outDiv}>
                <div id='0' style={{ height: '100%', display: 'flex', flexDirection: 'row', }}>
                    <p id='0' style={{ flex: '2' }}>2</p>
                    <p id='0' style={{ flex: '3', backgroundColor: '#2B2E3B', padding: 0, margin: 0, borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'  }} className={`${activeIndex != '-1' ? (activeIndex == '0' ? 'show' : 'hide') : 'hide'}`}>desc</p>
                </div>
            </div>
            <div id='1' className={`noExpand  ${activeIndex != '-1' ? (activeIndex == '1' ? 'expand' : 'small') : ''}`} onMouseOver={overDiv} onMouseOut={outDiv}>
                <div id='1' style={{ height: '100%', display: 'flex', flexDirection: 'row', }}>
                    <p id='1' style={{ flex: '2' }}>2</p>
                    <p id='1' style={{ flex: '3', backgroundColor: '#2B2E3B', padding: 0, margin: 0, borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} className={`${activeIndex != '-1' ? (activeIndex == '1' ? 'show' : 'hide') : 'hide'}`}>desc</p>
                </div>
            </div>
            <div id='2' className={`noExpand  ${activeIndex != '-1' ? (activeIndex == '2' ? 'expand' : 'small') : ''}`} onMouseOver={overDiv} onMouseOut={outDiv}>
                <div id='2' style={{ height: '100%', display: 'flex', flexDirection: 'row', }}>
                    <p id='2' style={{ flex: '2' }}>2</p>
                    <p id='2' style={{ flex: '3', backgroundColor: '#2B2E3B', padding: 0, margin: 0, borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'  }} className={`${activeIndex != '-1' ? (activeIndex == '2' ? 'show' : 'hide') : 'hide'}`}>desc</p>
                </div>
            </div>
            <div id='3' className={`noExpand  ${activeIndex != '-1' ? (activeIndex == '3' ? 'expand' : 'small') : ''}`} onMouseOver={overDiv} onMouseOut={outDiv}>
                <div id='3' style={{ height: '100%', display: 'flex', flexDirection: 'row', }}>
                    <p id='3' style={{ flex: '2' }}>2</p>
                    <p id='3' style={{ flex: '3', backgroundColor: '#2B2E3B', padding: 0, margin: 0, borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'  }} className={`${activeIndex != '-1' ? (activeIndex == '3' ? 'show' : 'hide') : 'hide'}`}>desc</p>
                </div>
            </div>
        </div>
    )
}