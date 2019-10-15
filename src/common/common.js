import qs from 'qs'
import jsSHA from 'jssha'

export function getQuery (search) {
  return qs.parse(search, { ignoreQueryPrefix: true }) || {}
}

export function setQuery (obj) {
  return qs.stringify(obj, { ignoreQueryPrefix: true })
}

export function downLoadFile (fileName, data) {
  const blob = new Blob([data])
  const elink = document.createElement('a')
  elink.download = `${fileName}.xlsx`
  elink.style.display = 'none'
  elink.href = URL.createObjectURL(blob)
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href)// 释放 URL 对象
  document.body.removeChild(elink)
}

export const encryptPassword = (password) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT')
  shaObj.update(password)
  const hash = shaObj.getHash('HEX')
  return hash
}

export function formatDate (value) {
  return value < 10 ? `0${value}` : value
}

// 加入收藏夹
export function addFavorite2 () {
  const url = window.location
  const { title } = document
  const ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('360se') > -1) {
    alert('由于360浏览器功能限制，请按 Ctrl+D 手动收藏！')
  } else if (ua.indexOf('msie 8') > -1) {
    window.external.AddToFavoritesBar(url, title)
  } else if (document.all) {
    try {
      window.external.addFavorite(url, title)
    } catch (e) {
      alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!')
    }
  } else if (window.sidebar) {
    window.sidebar.addPanel(title, url, '')
  } else {
    alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!')
  }
}
// 设为首页
export function SetHome (obj, url) {
  try {
    obj.style.behavior = 'url(#default#homepage)'
    obj.setHomePage(url)
  } catch (e) {
    if (window.netscape) {
      try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
      } catch (e2) {
        alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
      }
      const prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch)
      prefs.setCharPref('browser.startup.homepage', url);
    } else {
      alert('您的浏览器不支持，请手动设置。');
    }
  }
}

// 非接口下载文件
function getBlob (url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }
    xhr.send()
  })
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs (blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)
    link.click()
    body.removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}

export function download (url, filename) {
  getBlob(url).then(blob => {
    saveAs(blob, filename)
  })
}

// 生成数组 ['a,b,c','a1,b1,c1'] => ['a','b','c','a1','b1','c1']
export function generateArray (array) {
  const result = []
  array.forEach(item => {
    const splits = item.split(',')
    result.push.apply(result, splits)
  })
  return result
}

