# Huozi.me-converter

随着 Web 前端技术的发展，H5越来越深入大众的今天，如何开发出流畅快速高性能的前端应用，应该已经受到了普遍工程师的关注了吧。

最近在学习 React，这个是一个非常不错的框架，以及 Facebook 提出的 Flux，其中页面组件化和数据流的思想应该是我们非常值得学习和借鉴的。

然后我们再回头看看原生的移动端应用，就不难发现，一个好的 Web 应用也应该是这样的，如下：

![](http://7xqq2a.com1.z0.glb.clouddn.com/FoGhtLl7T7HWWtOHsPCXukP1Ln5_)

步骤：

1. View 调用 Store
2. Store 直接从 Local storage 获取数据
3. 返回数据给 View
4. 渲染页面
5. Http或者其他方式请求服务器
6. 调用 Action
7. 返回给 Dispatcher
8. 然后找到对应的 Store
9. 存储同步数据

> 英语不是很好，理解可能不是很准确，不过基本就是这个意思

原文如下: [http://www.tabforacause.org/blog/2015/01/29/using-reactjs-and-application-cache-fast-synced-app/](http://www.tabforacause.org/blog/2015/01/29/using-reactjs-and-application-cache-fast-synced-app/)
