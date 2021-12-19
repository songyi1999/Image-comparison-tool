export function delay(s) {
  return new Promise(function(resolve) {
    setTimeout(() => {
      resolve()
    }, s * 1000)
  })
}

// 获取图片大小
export function getimagesize(url) {
  return new Promise(function(resolve) {
    const divimg = document.createElement('img')
    divimg.src = url
    document.body.appendChild(divimg)
    setTimeout(function() {
      const img = new Image()
      img.src = divimg.src
      const out = { width: img.width, height: img.height }
      divimg.style.display = 'none'
      resolve(out)
    }, 100)
  })
}
