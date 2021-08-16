
import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Checkbox, Select, Tooltip, message } from 'antd'
import './Login.less'
import { CloseOutlined } from '@ant-design/icons'
import HTTPUtils from '../HTTPUtils/HTTPUtils';

const { Option } = Select;

const FormItem = Form.Item;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
}
const tailLayout = {
    wrapperCol: { offset: 6, span: 16 }
}
const loginLayout = {
    wrapperCol: { span: 24 }
}

/**
 *
 *
 * @export  登录页面
 * @return {*} 
 */
export default function Login(props) {
    const formRef = useRef();
    const [isPhoneMode, setIsPhoneMode] = useState('1');             //是否使用手机验证码登录
    const [namePlaceholder, setNamePlaceholder] = useState('请输入手机号码');         //用户名input框placeholder
    const [isOnSendCode, setIsonsendcode] = useState(false);                      //是否处于发送验证码
    const [sendCodeMil, setSendcodeMil] = useState(60);                           //处于发送验证码时间段内, 定时读秒的秒数


    /**
     * sendVerifCode和下面的useEffect 是发送验证码相关事件
     */
    /**
     * 处于手机登录状态下, 点击发送验证码, 出现'已发送60秒'
     */
    const sendVerifCode = async () => {
        let currentValue = formRef.current.getFieldsValue()
        console.log(formRef.current.getFieldsValue())
        let phone = currentValue.userName;
        if(!phone) {
            message.error('请先输入手机号');
            return false;
        }
        let params = {
            phone: phone,
        }
        let data = await HTTPUtils.captcha_sent(params);
        console.log(data)
        console.log(data)
        setIsonsendcode(true)
        setSendcodeMil(sendCodeMil)
    }
    /**
     * 处于发送验证码时间段内, 定时读秒, sendcodemil为0时, 恢复显示发送验证码按钮, 并将读秒重置为60s
     * 依赖isOnSendCode和sendCodeMil
     */
    useEffect(() => {
        if(isOnSendCode) {
            let codeTimer = setInterval(() => {
                if(sendCodeMil >0 && sendCodeMil <= 60) {
                    setSendcodeMil(sendCodeMil-1)
                }else if(sendCodeMil == 0) {
                    setIsonsendcode(false)
                    setSendcodeMil(60)
                }
            }, 1000)
            //为了清除codeTimer
            return () => {
                clearInterval(codeTimer)
            }
        }
    }, [isOnSendCode, sendCodeMil])



    /**
     *提交成功
     *
     * @param {value: Object} value: 参数: userName: 手机号/邮箱; password: 密码; remember: 是否记住用户和密码
     * isphonemode: true: 用手机登录; false: 邮箱登录
     */
    const onFinish = async (value) => {
        isPhoneMode != '3' ? await loginWithPhone(value) : await loginWithEmail(value);
    }
    /**
     *提交失败
     *
     * @param {*} err
     */
    const onFinishFailed = (err) => {
        console.log(err)
    }
    /**
     * 
     * @param {obj: Object} obj : value: 参数: userName: 手机号/邮箱; password: 密码; remember: 是否记住用户和密码
     */
    const loginWithPhone = async (obj) => {
        console.log(obj)
        let password = obj['password'];
        let phone = obj['userName']
        if(isPhoneMode == '1') {
            //手机验证码登录
            let params1 = {
                phone,
                captcha: password,
            }
            let data1 = await HTTPUtils.captcha_verify(params1);
            console.log(data1)
        }else {
            //手机密码登录
            let params = {
                phone,
                password,
            }
            let data = await HTTPUtils.login_cellphone(params);
            console.log(data)
        }
        message.success('登录成功')
        props.history.push('/home')
        // let params = {
        //     phone: obj.userName,
        //     password: obj.password,
        //     timestamp: Date.now()
        // }
        // let data = await HTTPUtils.login_cellphone(params);
        // if(data.code !== 200) {
        //     console.log(data)
        //     message.error(data.msg || '请输入正确的用户名或者密码');
        //     return
        // }
        // console.log(data)

    }
     /**
     * 
     * @param {obj: Object} obj : value: 参数: userName: 手机号/邮箱; password: 密码; remember: 是否记住用户和密码
     */
    const loginWithEmail = async (obj) => {
        let params = {
            email: obj.userName,
            password: obj.password,
            timestamp: Date.now()
        }
        let data = await HTTPUtils.login(params);
        document.cookie = data.cookie;//登录以后, 要存储cookie, 为的是保持登录状态, 请求需要登录的接口
        props.history.push('/home')
    }

    /**
     * 
     * @param {val: String} val : 选择手机/邮箱, 设置密码框里的tooltips, 用户名里的placeholder
     */
    const selectedType = (val) => {
        setIsPhoneMode(val);
        let holder = val === '3' ? '请输入邮箱' : '请输入手机号码';
        setNamePlaceholder(holder)
    }



    const getdata = async () => {
        let obj = {
            id: 58100
        }
        let data = await HTTPUtils.video_group(obj);
        console.log('视频')
        console.log(data)
    }
    return (
        <div className='login'>
            <div
                className='loginContent'
                draggable='true'
            >
                <Button
                    className='closeBtn'
                >
                    <CloseOutlined className='closeImg' />
                </Button>
                <Form
                    ref={formRef}
                    {...layout}
                    name='loginData'
                    autoComplete='false'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <FormItem
                        {...loginLayout}
                    >
                        <p
                            style={{ textAlign: 'center', fontSize: '25px', borderBottom: '1px solid #C20C0C', paddingBottom: '10px', color: '#C20C0C' }}
                        >
                            网易云音乐
                        </p>
                    </FormItem>
                    <FormItem
                        label='用户名'
                        style={{ width: '500px' }}
                    >
                        <Input.Group compact>
                            <Select
                                defaultValue="1"
                                style={{ width: '35%', height: '50px' }}
                                onSelect={selectedType}
                            >
                                <Option value="1">手机验证码</Option>
                                <Option value="2">手机密码</Option>
                                <Option value="3">邮箱</Option>
                            </Select>
                            <FormItem
                                name='userName'
                                style={{ width: '65%' }}
                                rules={[{ required: true, message: '请输入用户名' }]}
                            >
                                <Input
                                    style={{ height: '50px' }}
                                    placeholder={namePlaceholder}
                                />
                            </FormItem>
                        </Input.Group>
                    </FormItem>
                    <FormItem
                        label='密码'
                        name='password'
                        style={{ width: '500px' }}
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        {
                            !(isPhoneMode == '1') ?
                                <Input.Password
                                    style={{ height: '50px' }}
                                    placeholder='请输入密码'
                                />
                                :
                                <Input
                                    style={{ height: '50px' }}
                                    placeholder='请输入验证码'
                                    suffix={
                                        <Tooltip
                                            title="Extra information"
                                        >
                                            {
                                                !isOnSendCode ?
                                                    <Button
                                                        type='text'
                                                        style={{ color: '#1890ff' }}
                                                        onClick={sendVerifCode}
                                                    >
                                                        发送验证码
                                                </Button>
                                                    :
                                                    <span
                                                        style={{ color: 'gray' }}
                                                    >
                                                        已发送
                                                    <span
                                                        style={{padding: 5}}
                                                    >
                                                            {sendCodeMil}
                                                        </span>
                                                    秒
                                                </span>
                                            }
                                        </Tooltip>
                                    }
                                />
                        }
                    </FormItem>
                    <FormItem
                        name='remember'
                        {...tailLayout}
                        valuePropName='checked'
                    >
                        <Checkbox
                        >
                            记住我
                        </Checkbox>
                    </FormItem>
                    <FormItem
                        wrapperCol={{ offset: 6, span: 12 }}

                    >
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='subBtn'
                            shape='round'
                        >
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
            {/* <Button onClick={getdata}>获取登录</Button> */}
        </div>
    )
}