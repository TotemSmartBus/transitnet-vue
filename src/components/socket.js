export default {
    // websocket 对象
    ws: {},
    // 重连延迟
    delay: 1500,
    setWs: function(newWs) {
        this.ws = newWs
    },
    setDelay: function(newDelay) {
        this.delay = newDelay
    },
    sendMsg: function(msg) {
        this.ws.send(JSON.stringify(msg))
    },
    
}