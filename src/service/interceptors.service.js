import axios from 'axios'

const interceptor = axios.create()

interceptor.interceptors.request.use(
  function(config) {
    config.headers.Authorization = 'Bearer xhx'
    //设置headers传入用户的token
    if (localStorage.id_token) {
      config.headers.Authorization = 'Bearer ' + localStorage.id_token
    }
    //设置headers头传入当前使用的语言，提供给后端判断用。
    // config.headers['Accept-Language'] = i18n.locale

    //这边可以使用一些loading的动画，请求的时候loading动画运转，请求完成或者错误之后动画关闭
    //（这里用的是element-ui 的loading组件）
    // loadingInstance = Loading.service({
    //   lock: true,
    //   background: 'transparent'
    // })

    return config
  },
  function(error) {
    // 请求错误，关闭loading动画，返回错误。
    // loadingInstance.close()
    return Promise.reject(error)
  }
)

interceptor.interceptors.response.use(
  //成功返回数据
  function(response) {
    //关闭loading动画
    // loadingInstance.close();
    //返回数据待使用
    return response.data
  },
  //抓取数据，针对不同的错误进行不同的操作
  function(error) {
    //和后端小伙伴约定一下错误码的规则
    if (error.response.status === 400) {
      switch (error.response.data.message) {
        case 'Not found user':
        case 'Unauthorized':
          // do nothing.
          break
        case 'Blocked':
          router.push({ path: '/inactive' })
          break
        default:
          //页面输出错误讯息（element-ui）
          Message.error('Oop, something went wrong. Please contact us.')
      }
    }

    if (error.response.status === 403) {
      //页面输出错误讯息（element-ui）
      // this.$message.error(error.response.data.message);
    }

    if (error.response.status === 404) {
      //跳转404页面
      router.push({
        name: '404'
      })
    }
    //关闭loading动画
    // loadingInstance.close();

    return Promise.reject(error)
  }
)
export default interceptor