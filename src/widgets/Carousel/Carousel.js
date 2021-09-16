import React, { useState, useEffect, useRef, } from 'react';
import './Carousel.less';
import { Input, message, Button, } from 'antd';
import HTTPUtils from '../../HTTPUtils/HTTPUtils';;
let timer = ''
export default function Carousel(props) {
    const [index, setIndex] = useState('0');//用于控制class
    const [left, setLeft] = useState(true)//和index配合使用, 控制class
    const [isHover, setIsHover] = useState(false);//鼠标在组件上, 那么组件就不进行左移/右移
    const [dataStartIndex, setDataStartIndex] = useState(0);//传过来数据, 截取数据的开始index, 第一次进来, 默认为0
    const [bannerData, setBannerData] = useState([])//banner总数据, 
    const [activeBannerData, setActiveBannerData] = useState([]);//当前显示的banner数据
    //点击组件的左侧, banner向左滚动
    const leftClickDiv = () => {
        //向左滚动, 如果当前位置不是bannerData的最后项, 那么 + 1 ; 如果是第一项, 那么需要设为bannerData的第一项

        let bannerDataLength = bannerData.length;
        if (dataStartIndex > 0 && dataStartIndex <= bannerDataLength - 1) {
            setDataStartIndex(dataStartIndex - 1)
        } else {
            setDataStartIndex(bannerDataLength - 1)
        }
        // setDataStartIndex(dataStartIndex + 1)
        let dex = parseInt(index);
        //123分别对应第一次进入页面的banner元素div顺序
        //index=1 左边 312 右边 123
        //index=2 左边 231 右边 312
        //index=3 左边 123 右边 231
        //下面是动画变化逻辑
        //动画 left一直为true, 说明一直left click, 或者 left一直为false, 说明一直right click 那么index正常加减
        //重要的是left从true变为false, 或者left从false变为true
        //例如index=1, left从true变为false, 此时 页面是需要从312变回123, 对应右边的index=1的情况, 所以此时不需要对index进行加减
        //其他的这种情况, 也是同要的处理方式
        if(left) {
            if (dex < 3) {
                dex += 1;
            } else {
                dex = 1;
            }
        }
        //其他情况, 从left为true变为false的时候, 不需要进行改变index的操作, 因为动画animation是如下对应关系
        
        console.log('左边点击');
        console.log(dex);
        setIndex(dex.toString())
        setLeft(true)
    }
    //点击组件的右侧, banner向右滚动
    const rightClickDiv = () => {
        //向右滚动, 如果当前位置不是bannerData的第一项, 那么 - 1 ; 如果是第一项, 那么需要设为bannerData的最后一项

        let bannerDataLength = bannerData.length;
        if (dataStartIndex >= 0 && dataStartIndex < bannerDataLength - 1) {
            setDataStartIndex(dataStartIndex + 1)
            console.log('数据开始位置');
            console.log(dataStartIndex + 1);
        } else {
            setDataStartIndex(0)
            console.log('数据开始位置');
            console.log(0);
        }
        // if(dataStartIndex - 1 < 0) {
        //     setDataStartIndex(bannerData.length-1);
        // }else {
        //     setDataStartIndex(dataStartIndex-1)
        // }
        let dex = parseInt(index);
        //123分别对应第一次进入页面的banner元素div顺序
        //index=1 左边 312 右边 123
        //index=2 左边 231 右边 312
        //index=3 左边 123 右边 231
        //下面是动画变化逻辑
        //动画 left一直为true, 说明一直left click, 或者 left一直为false, 说明一直right click 那么index正常加减
        //重要的是left从true变为false, 或者left从false变为true
        //例如index=1, left从true变为false, 此时 页面是需要从312变回123, 对应右边的index=1的情况, 所以此时不需要对index进行加减
        //其他的这种情况, 也是同要的处理方式
        if(!left) {
            //每次
            if (dex > 1) {
                dex -= 1;
            } else {
                dex = 3;
            }
        }else if(left && dex == '0') {
            //第一次进入页面, 此时index还处于0, 且left为true的时候, 此时需要将index设为3
            dex = 3
        }
        //其他情况, 从left为true变为false的时候, 不需要进行改变index的操作,
        console.log('右边点击');
        console.log(dex);
        setIndex(dex.toString())
        setLeft(false)
    }
    //index会变, 如果当前没有处于hover状态, 那么继续原先的timer
    useEffect(() => {
        if (!isHover) {
            timer = setTimeout(leftClickDiv, 3000);
        }
        return () => {
            timer && clearTimeout(timer)
        }
    }, [index])
    //清除定时器
    const clearMyTimer = () => {
        setIsHover(true)
        clearTimeout(timer)
    }
    //创建定时器
    const createMyTimer = () => {
        setIsHover(false)
        timer = setTimeout(leftClickDiv, 3000);
    }

    //截取数组数据 例如arr = [1, 2, 3, 4, 5, 6], start = 4; num = 3; 那么type为1: 返回数据为[5, 6, 1], type: 2 返回数据 [1, 5, 6];
    const sliceArr = (arr, start = 0, type = 1, num = 3) => {
        if (start >= 0 && num >= 0) {
            start %= arr.length;
            //differStartToEndCount: 获取startArr的长度,
            let differStartToEndCount = arr.length - start;
            if (arr.length > 0) {
                //开始位置到数组结尾数据放入startArr
                let startArr = [];
                if (start + num <= arr.length - 1) {
                    startArr = arr.slice(start, start + num);
                } else {
                    startArr = arr.slice(start)
                }
                //如果num<arr.length; name loopArrCount为0;
                let loopArrCount = Math.floor((num - differStartToEndCount) / arr.length);//循环次数
                let loopArr = [];
                let i = 1;
                //循环次数内 添加arr到loopArr
                while (i <= loopArrCount) {
                    loopArr = loopArr.concat(arr)
                    i++
                }
                let loopEndSurplusArr = []
                if (differStartToEndCount < num) {
                    let lastCount = (num - differStartToEndCount) % arr.length;//循环后剩余的次数
                    //循环剩余的数据放入数组loopEndSurplusArr
                    loopEndSurplusArr = arr.slice(0, lastCount);
                }
                let res = startArr.concat(loopArr);
                res = type == 1 ? res.concat(loopEndSurplusArr) : loopEndSurplusArr.concat(res)
                return res
            }
            else {
                return []
            }
        }
    }
    
    //变换数据顺序
    const sortDataByStartIndex = (start, arr) => {
        let loopLength = arr.length;//数组长度
        let loopCount = Math.ceil(start / loopLength);
        let keyIndex = (loopLength * loopCount - start);
        let startToEndArr = arr.slice(keyIndex);
        let zeroToStartArr = arr.slice(0, keyIndex);
        return startToEndArr.concat(zeroToStartArr);
    }

    useEffect(() => {
        if ((bannerData instanceof Array) && bannerData.length >= 3) {
            let newBannerData = JSON.parse(JSON.stringify(bannerData));
            // let newActiveBannerData = newBannerData.slice(dataStartIndex, dataStartIndex + 4)
            //截取数据
            let newActiveBannerData = sliceArr(newBannerData, dataStartIndex);
            //然后变化数据顺序, 和view层面顺序相符
            let sortBannerData = sortDataByStartIndex(dataStartIndex, newActiveBannerData)
            setActiveBannerData(sortBannerData)
        }
    }, [bannerData, dataStartIndex])

    //依赖传过来的banner 数据
    useEffect(() => {
        setBannerData(props.data)
    }, [props.data])

    return (
        // <div style={{position: 'relative', height: '400px'}} onMouseOver={clearMyTimer} onMouseOut={createMyTimer}>
        <div style={{ position: 'relative', height: '400px' }} onMouseOver={clearMyTimer}>
            {/* <div className='aniDiv' style={{width: '400px', height: '200px', backgroundColor: '#9FEAF9', margin: '10px', position: 'absolute', right: 0, top: 0, boxShadow: '0 0 10px gray'}}>

            </div>
            <div className='aniDiv' style={{width: '400px', height: '200px', backgroundColor: '#9FEAF9', margin: '10px', position: 'absolute', left: 0, top: 0, boxShadow: '0 0 10px gray'}}>

            </div> */}

            {/* <div className={ `allT ${index == '1' ? `${left ? 'aniDiv' : 'aniDivReverse'}` : `${index == '2' ? `${left ? 'ani2' : 'ani2Reverse'}` : `${index == '3' ? `${left ? 'anima3' : 'anima3Reverse'}` : ''}`}`}`}>
                <img src={props.data.length > 0 ? props.data[0].imageUrl : ''} style={{width: '100%', height: '100%'}}/>
            </div>
            <div className={ `allT1 ${index == '1' ? `${left ? 'ani2' : 'ani2Reverse'}` : `${index == '2' ? `${left ? 'anima3' : 'anima3Reverse'}` : `${index == '3' ? `${left ? 'aniDiv' : 'aniDivReverse'}` : ''}`}`}`}>
                <img src={props.data.length > 0 ? props.data[1].imageUrl : ''} style={{width: '100%', height: '100%'}}/>
            </div>
            <div className={ `allT2 ${index == '1' ? `${left ? 'anima3' : 'anima3Reverse'}` : `${index == '2' ? `${left ? 'aniDiv' : 'aniDivReverse'}` : `${index == '3' ? `${left ? 'ani2' : 'ani2Reverse'}` : ''}`}`}`}>
                <img src={props.data.length > 0 ? props.data[2].imageUrl : ''} style={{width: '100%', height: '100%'}}/>
            </div> */}

            <div className={`allT1 ${index == '1' ? `${!left ? 'aniDiv' : 'ani2Reverse'}` : `${index == '2' ? `${!left ? 'anima3' : 'aniDivReverse'}` : `${index == '3' ? `${!left ? 'ani2' : 'anima3Reverse'}` : ''}`}`}`}>
                <img src={activeBannerData && activeBannerData.length > 0 ? activeBannerData[0].imageUrl : ''} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className={`allT ${index == '1' ? `${!left ? 'anima3' : 'aniDivReverse'}` : `${index == '2' ? `${!left ? 'ani2' : 'anima3Reverse'}` : `${index == '3' ? `${!left ? 'aniDiv' : 'ani2Reverse'}` : ''}`}`}`}>
                <img src={activeBannerData && activeBannerData.length > 0 ? activeBannerData[1].imageUrl : ''} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className={`allT2 ${index == '1' ? `${!left ? 'ani2' : 'anima3Reverse'}` : `${index == '2' ? `${!left ? 'aniDiv' : 'ani2Reverse'}` : `${index == '3' ? `${!left ? 'anima3' : 'aniDivReverse'}` : ''}`}`}`}>
                <img src={activeBannerData && activeBannerData.length > 0 ? activeBannerData[2].imageUrl : ''} style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 3, opacity: 0.5, display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, opacity: 0.5, cursor: 'pointer' }} onClick={leftClickDiv}>

                </div>
                <div style={{ flex: 1, opacity: 0.5, cursor: 'pointer' }} onClick={rightClickDiv}>

                </div>
            </div>
        </div>
    )
}