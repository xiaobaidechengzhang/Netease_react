import React, { useState, useEffect, useRef } from "react";

let startDistance = ""; //拖动开始位置
let is_moving = false; //是否开始滚动
let is_mine_ref = ""; //是否是本组件
let interval_id = null; //播放定时

export default function BasicSlider(props) {
  const SliderRef = useRef(); //滑动条Ref
  const SliderBackRef = useRef(); //已滑动条Ref
  const SliderRoundBtnRef = useRef(); //圆形按钮ref
  const [backWidth, setBackWidth] = useState("0%"); //已滑动滚动条宽度
  const [sliderRoundLeft, setSliderRoundLeft] = useState("0%"); //滑动条上按钮距离左边距离
  //设置滑动宽度
  const setWidth = (width) => {
    let slider = SliderRef.current;
    let sliderBack = SliderBackRef.current;
    let sliderRoundBtn = SliderRoundBtnRef.current;
    let percent = (width / slider.scrollWidth) * 100;
    percent = percent.toFixed(2);
    percent = parseFloat(percent);
    //获取背景滑动条宽度, 数值, 半分比
    let back_width = sliderBack.style.width;
    //获取圆形按钮绝对定位left,
    // let round_btn_position = sliderRoundBtn.style.left;
    //因为back_width是百分比, 所以要转为Number
    back_width = parseFloat(back_width);
    //percent有可能是正值/负值, 所以需要用原来的值直接相加,
    back_width += percent;
    //如果相加后百分比>100; 则最大取100%
    if (parseFloat(back_width) > 100) {
      back_width = "100";
    } else if (parseFloat(back_width) < 0) {
      //同理, 相加后百分比<0, 则最小取0
      back_width = "0";
    }
    back_width += "%";
    //背景条/圆形拖动按钮, 百分比相同,
    // console.log("component", back_width);
    setBackWidth(back_width);
    setSliderRoundLeft(back_width);
    props.onChange(back_width);
  };

  //props.value变化
  useEffect(() => {
    console.log('props value', props.value)
    setBackWidth(props.value);
    setSliderRoundLeft(props.value);
  }, [props.value])

  //只加载一次
  useEffect(() => {
    //取得相应ref所对应的组件
    let slider = SliderRef.current;
    let sliderBack = SliderBackRef.current;
    let sliderRoundBtn = SliderRoundBtnRef.current;
    sliderRoundBtn.addEventListener("click", (e) => {
      //阻止冒泡
      e.stopPropagation() || (e.cancelBubble = true);
    });
    //鼠标在圆形按钮上开始拖动
    sliderRoundBtn.addEventListener("mousedown", (e) => {
      clearTimeout(interval_id);
      //记录拖动开始位置, 初始化所需的属性
      startDistance = e.clientX;
      //是否开始移动
      is_moving = true;
      //是否是拖动的组件,(一个页面有可能有多个MusicSliderComponent)
      is_mine_ref = SliderRef;
    });
    document.addEventListener("mousemove", (e) => {
      if (is_moving && is_mine_ref == SliderRef) {
        interval_id && clearTimeout(interval_id);
        //计算出移动距离, 并更新startDistance,
        //便于计算
        //当然也可以不用更新startDistance, 那么setWidth中back_width就不用与percent相加了
        let moveDistance = e.clientX - startDistance;
        startDistance = e.clientX;
        setWidth(moveDistance);
      }
    });
    document.addEventListener("mouseup", (e) => {
      //放开鼠标, 重置拖动过程中所需的属性
      if (is_moving && is_mine_ref == SliderRef) {
        is_moving = false;
        is_mine_ref = null;
        startDistance = 0;
      }
    });
    document.addEventListener("dragstart", (e) => {
      //为了配合dragend事件
      is_moving = true;
      is_mine_ref = SliderRef;
      document.onselectstart = function () {
        return false;
      };
    });
    document.addEventListener("dragend", (e) => {
      //不能只用moveup事件, 因为鼠标在拖动过程中, 不会触发mouseup事件, , 但是滑动条还是能滑动, 这个时候会触发dragend事件, 在这里可以处理一下
      if (is_moving && SliderRef == is_mine_ref) {
        //获取移动距离
        let moveX = e.clientX - startDistance;
        //将最终距离赋值给startDistance
        startDistance = e.clientX;
        setWidth(moveX);
        is_moving = false;
        is_mine_ref = "";
        document.onselectstart = function () {
          return true;
        };
      }
    });
    slider.addEventListener("click", (e) => {
      //点击滑动条, 改变已滑动条宽度
      let slider_back_width = e.offsetX;
      let slider_width = slider.scrollWidth;
      let percent = (slider_back_width / slider_width) * 100;
      percent = percent.toFixed(2);
      percent = parseFloat(percent);
      //可以作为值, 传回组件onchange事件,
      if (percent > 100) {
        percent = "100";
      } else if (percent < 0) {
        percent = "0";
      }
      let percentStr = percent + "%";
      //实际情况应该是: 先暂停播放, 获取加载资源, 加载完毕, 继续播放; 如果处于加载状态下, 暂停播放
      // interval_id && clearInterval(interval_id)
      setBackWidth(percentStr);
      setSliderRoundLeft(percentStr);
      props.onChange(percentStr);
    });
  }, []);
  return (
    <div
      id="slider"
      ref={SliderRef}
      style={{
        width: "100%",
        height: 5,
        backgroundColor: "#ccc",
        position: "relative",
      }}
    >
      <div
        id="sliderBack"
        ref={SliderBackRef}
        style={{ width: backWidth, height: 5, backgroundColor: "#DD001B" }}
      ></div>
      <div
        id="sliderRoundBtn"
        ref={SliderRoundBtnRef}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#DD001B",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: sliderRoundLeft,
          zIndex: 999
        }}
      ></div>
    </div>
  );
}
