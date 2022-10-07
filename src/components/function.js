
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

// 提交图片获取指标
export function getsn(imageA, imageB) {
  return new Promise(function(resolve) {
    var formData = new FormData()
    formData.append('hr', imageA, 'hr')
    formData.append('sr', imageB, 'sr')
    var xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://yifus.win:5000/upload', true)
    xhr.onload = function() {
      if (xhr.status === 200) {
        // console.log(xhr.response)
        resolve(xhr.responseText)
      }
    }
    xhr.send(formData)
  })
}

// 前端 base64图片转换为文件格式
export async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], fileName, { type: 'image/png' })
}

// 获取文件内容
export async function getfiledata(url) {
  const res = await fetch(url)

  if (res.status === 200 || res.status === '200') {
    const result = await res.text()
    const arr = result.split('\n')
    const dataArr = arr[1].split(',')

    return {
      PI: Math.round(dataArr[0] * 100) / 100,
      Ma: Math.round(dataArr[1] * 100) / 100,
      NIQE: Math.round(dataArr[2] * 100) / 100,
      MSE: Math.round(dataArr[3] * 100) / 100,
      RMSE: Math.round(dataArr[4] * 100) / 100,
      PSNR: Math.round(dataArr[5] * 100) / 100,
      SSIM: Math.round(dataArr[6] * 100) / 100,
      LPIPS: Math.round(dataArr[7] * 100) / 100
    }
  } else return ''
}

// 传入2个图base64 算出结果
export async function getmetrics(imageA, imageB) {
  const fileA = await dataUrlToFile(imageA, 'hr.png')
  const fileB = await dataUrlToFile(imageB, 'sr.png')
  const sn = await getsn(fileA, fileB)
  const sn_url = 'http://yifus.win:5000/download/' + sn + '.txt'
  await delay(5)
  let text = await getfiledata(sn_url)
  let count = 5 // 重试次数
  while (!text) {
    await delay(60)
    text = await getfiledata(sn_url)
    count--
    if (count === 0) {
      console.log('重试次数超过5次')
      break
    }
  }
  return text
}

