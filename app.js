const CronJob = require('cron').CronJob
const Chromy = require('chromy')
const opn = require('opn')

const shops = {
  nintendo: {
    url: 'https://store.nintendo.co.jp/customize.html',
    name: 'My Nintendo Store',
    checkStore: client => {
      return client.evaluate(() => {
        return document.querySelector('#HAC_S_KAYAA p.stock').innerText !== 'SOLD OUT'
      })
    }
  },
  amazon: {
    url: 'http://amzn.asia/79RsjhF',
    name: 'Amazon',
    checkStore: client => {
      return client.evaluate(() => {
        const rawPrice = document.querySelector('#priceblock_ourprice').innerText
        const price = Number(
          rawPrice
            .substr(1)
            .replace(',', '')
            .trim()
        )
        return price < 35000
      })
    }
  },
  yamada: {
    splatoon: {
      url: 'http://www.yamada-denkiweb.com/1178028018',
      name: 'ヤマダ電機:スプラトゥーン2セット',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('p.note').innerText !== '好評につき売り切れました'
        })
      }
    },
    color: {
      url: 'http://www.yamada-denkiweb.com/1177992013',
      name: 'ヤマダ電機:NB/NR',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('p.note').innerText !== '好評につき売り切れました'
        })
      }
    },
    gray: {
      url: 'http://www.yamada-denkiweb.com/1177991016',
      name: 'ヤマダ電機:グレー',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('p.note').innerText !== '好評につき売り切れました'
        })
      }
    }
  },
  yodobashi: {
    splatoon: {
      url: 'http://www.yodobashi.com/product/100000001003570628/',
      name: 'ヨドバシカメラ:スプラトゥーン2セット',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('#js_buyBoxMain p').innerText !== '予約受付を終了しました'
        })
      }
    },
    monster: {
      url: 'http://www.yodobashi.com/product/100000001003583883/',
      name: 'ヨドバシカメラ:モンハンセット',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('#js_buyBoxMain p').innerText !== '予約受付を終了しました'
        })
      }
    },
    color: {
      url: 'http://www.yodobashi.com/product/100000001003431566/',
      name: 'ヨドバシカメラ:NB/NR',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('#js_buyBoxMain p').innerText !== '予定数の販売を終了しました'
        })
      }
    },
    gray: {
      url: 'http://www.yodobashi.com/product/100000001003431565/',
      name: 'ヨドバシカメラ:グレー',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('#js_buyBoxMain p').innerText !== '予定数の販売を終了しました'
        })
      }
    }
  },
  nojima: {
    splatoon: {
      url: 'https://online.nojima.co.jp/Nintendo-HAC-S-KACEA-ESET-%E3%80%90Switch%E3%80%91-%E3%83%8B%E3%83%B3%E3%83%86%E3%83%B3%E3%83%89%E3%83%BC%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E6%9C%AC%E4%BD%93-%E3%82%B9%E3%83%97%E3%83%A9%E3%83%88%E3%82%A5%E3%83%BC%E3%83%B32%E3%82%BB%E3%83%83%E3%83%88%EF%BC%885%E5%B9%B4%E4%BF%9D%E8%A8%BC%E3%82%BB%E3%83%83%E3%83%88%EF%BC%89/2810000040986/1/cd/',
      name: 'ノジマオンライン:HAC-S-KACEA-ESET',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('.hassoumeyasu2 strong span').innerText !== '完売御礼'
        })
      }
    },
    monster: {
      url: 'https://online.nojima.co.jp/CAPCOM-HAC-S-KCAEB-ESET-%E3%80%90Switch%E3%80%91-%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%8F%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%80%E3%83%96%E3%83%AB%E3%82%AF%E3%83%AD%E3%82%B9-Nintendo-Switch-Ver--%E3%82%B9%E3%83%9A%E3%82%B7%E3%83%A3%E3%83%AB%E3%83%91%E3%83%83%E3%82%AF%EF%BC%885%E5%B9%B4%E4%BF%9D%E8%A8%BC%E3%82%BB%E3%83%83%E3%83%88%EF%BC%89/2810000041433/1/cd/',
      name: 'ノジマオンライン:HAC-S-KCAEB-ESET',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('.hassoumeyasu2 strong span').innerText !== '完売御礼'
        })
      }
    },
    color: {
      url: 'https://online.nojima.co.jp/Nintendo-HAC-S-KABAA-ESET-%E3%80%90Switch%E3%80%91-%E3%83%8B%E3%83%B3%E3%83%86%E3%83%B3%E3%83%89%E3%83%BC%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E6%9C%AC%E4%BD%93-Joy-Con%28L%29-%E3%83%8D%E3%82%AA%E3%83%B3%E3%83%96%E3%83%AB%E3%83%BC-%28R%29-%E3%83%8D%E3%82%AA%E3%83%B3%E3%83%AC%E3%83%83%E3%83%89%EF%BC%885%E5%B9%B4%E4%BF%9D%E8%A8%BC%E3%82%BB%E3%83%83%E3%83%88%EF%BC%89-/2810000036439/1/cd/',
      name: 'ノジマオンライン:HAC-S-KABAA-ESET',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('.hassoumeyasu2 strong span').innerText !== '完売御礼'
        })
      }
    },
    color2: {
      url: 'https://online.nojima.co.jp/Nintendo-HAC-S-KABAA-%E3%80%90Switch%E3%80%91-%E3%83%8B%E3%83%B3%E3%83%86%E3%83%B3%E3%83%89%E3%83%BC%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E6%9C%AC%E4%BD%93-Joy-Con%28L%29-%E3%83%8D%E3%82%AA%E3%83%B3%E3%83%96%E3%83%AB%E3%83%BC-%28R%29-%E3%83%8D%E3%82%AA%E3%83%B3%E3%83%AC%E3%83%83%E3%83%89/4902370535716/1/cd/',
      name: 'ノジマオンライン:HAC-S-KABAA:no-guarantee',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('.hassoumeyasu2 strong span').innerText !== '完売御礼'
        })
      }
    },
    gray: {
      url: 'https://online.nojima.co.jp/Nintendo-HAC-S-KAAAA-ESET-%E3%80%90Switch%E3%80%91-%E3%83%8B%E3%83%B3%E3%83%86%E3%83%B3%E3%83%89%E3%83%BC%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E6%9C%AC%E4%BD%93-Joy-Con%28L%29-%28R%29-%E3%82%B0%E3%83%AC%E3%83%BC%EF%BC%885%E5%B9%B4%E4%BF%9D%E8%A8%BC%E3%82%BB%E3%83%83%E3%83%88%EF%BC%89-/2810000036422/1/cd/',
      name: 'ノジマオンライン:HAC-S-KAAAA-ESET',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('.hassoumeyasu2 strong span').innerText !== '完売御礼'
        })
      }
    },
    gray2: {
      url: 'https://online.nojima.co.jp/Nintendo-HAC-S-KAAAA-%E3%80%90Switch%E3%80%91-%E3%83%8B%E3%83%B3%E3%83%86%E3%83%B3%E3%83%89%E3%83%BC%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E6%9C%AC%E4%BD%93-Joy-Con%28L%29-%28R%29-%E3%82%B0%E3%83%AC%E3%83%BC/4902370535709/1/cd/',
      name: 'ノジマオンライン:HAC-S-KAAAA:no-guarantee',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('.hassoumeyasu2 strong span').innerText !== '完売御礼'
        })
      }
    }
  },
  seven: {
    url: 'http://7net.omni7.jp/detail/2110595636',
    name: 'セブンネットショッピング',
    checkStore: client => {
      return client.evaluate(() => {
        return document.querySelector('.btnStrongest input').getAttribute('title') !== '在庫切れ'
      })
    }
  },
  rakuten: {
    onetwo: {
      url: 'http://books.rakuten.co.jp/rb/14779141/',
      name: 'rakutenブックス:NB/NR + 1-2-Switch',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品'
        })
      }
    },
    marica: {
      url: 'http://books.rakuten.co.jp/rb/14779141/',
      name: 'rakutenブックス:NB/NR + マリオカート8 デラックス',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品'
        })
      }
    },
    zelda: {
      url: 'http://books.rakuten.co.jp/rb/14779136/',
      name: 'rakutenブックス:グレー + ゼルダの伝説　ブレス オブ ザ ワイルド',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品'
        })
      }
    },
    splatoon: {
      url: 'http://books.rakuten.co.jp/rb/14943334/',
      name: 'rakutenブックス:スプラトゥーン2セット',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品*'
        })
      }
    },
    color: {
      url: 'http://books.rakuten.co.jp/rb/14655635/',
      name: 'rakutenブックス:NB/NR 【楽天あんしん延長保証（自然故障＋物損プラン）セット】',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品'
        })
      }
    },
    color2: {
      url: 'http://books.rakuten.co.jp/rb/14647222/',
      name: 'rakutenブックス:NB/NR',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品*'
        })
      }
    },
    gray: {
      url: 'http://books.rakuten.co.jp/rb/14655634/',
      name: 'rakutenブックス:グレー 【楽天あんしん延長保証（自然故障＋物損プラン）セット】',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品'
        })
      }
    },
    gray2: {
      url: 'http://books.rakuten.co.jp/rb/14647221/',
      name: 'rakutenブックス:グレー',
      checkStore: client => {
        return client.evaluate(() => {
          return document.querySelector('span.status').innerText.trim() !== 'ご注文できない商品*'
        })
      }
    }
  },
  tsutaya: {
    url: 'http://shop.tsutaya.co.jp/game/product/4902370535716/',
    name: 'TSUTAYA',
    checkStore: client => {
      return client.evaluate(() => {
        return document.querySelector('li.tolBtn img').getAttribute('alt') !== '在庫なし'
      })
    }
  }
}

function zeroPadding(num, length) {
  return ('0000000000' + num).slice(-length);
}

function logger(msg) {
  const now = new Date();
  console.log(zeroPadding(now.getHours(), 2) + ':' + zeroPadding(now.getMinutes(), 2) + ' > ' + msg);
}

async function check(client, options) {
  try {
    await client.goto(options.url)
    const result = await options.checkStore(client)
    if (result) {
      logger(`[${options.name}] \u001b[31mTime is Now!!!\u001b[0m`)
        opn(options.url)
      } else {
        logger(`[${options.name}] \u001b[34mTime is Not Now...\u001b[0m`)
      }
  } catch(e) {
    logger(e)
  }
}

async function main () {
  let chromy = new Chromy()
  await check(chromy, shops.nintendo)
  await check(chromy, shops.amazon)
  await check(chromy, shops.yamada.splatoon)
  await check(chromy, shops.yamada.color)
  await check(chromy, shops.yamada.gray)
  await check(chromy, shops.yodobashi.splatoon)
  await check(chromy, shops.yodobashi.monster)
  await check(chromy, shops.yodobashi.color)
  await check(chromy, shops.yodobashi.gray)
  await check(chromy, shops.nojima.splatoon)
  await check(chromy, shops.nojima.monster)
  await check(chromy, shops.nojima.color)
  await check(chromy, shops.nojima.color2)
  await check(chromy, shops.nojima.gray)
  await check(chromy, shops.nojima.gray2)
  await check(chromy, shops.seven)
  await check(chromy, shops.rakuten.onetwo)
  await check(chromy, shops.rakuten.marica)
  await check(chromy, shops.rakuten.zelda)
  await check(chromy, shops.rakuten.splatoon)
  await check(chromy, shops.rakuten.color)
  await check(chromy, shops.rakuten.color2)
  await check(chromy, shops.rakuten.gray)
  await check(chromy, shops.rakuten.gray2)
  await check(chromy, shops.tsutaya)
  await chromy.close()
}

logger('Switch Watcher Start')
new CronJob('0 */3 * * * *', main).start();
