let middleContainerWallets = document.querySelector('.middle-container__wallets')

export function wallets(arr) {
  for (const item of arr) {
    let middleContainerWallet = document.createElement('div')
    let h3 = document.createElement('h3')
    let middleContainerWalletContent = document.createElement('div')
    let WalletContentCircle_1 = document.createElement('div')
    let WalletContentCircle_2 = document.createElement('div')
    let WalletContentImg = document.createElement('img')
    let WalletContentPrice = document.createElement('div')
    let WalletContentPriceCrypto = document.createElement('span')
    let WalletContentPriceUSD = document.createElement('span')
    let WalletContentCurrency = document.createElement('div')
    for (const element of item.currencyBox) {
      let WalletContentCurrencyBox = document.createElement('div')
      let WalletContentCurrencyBoxImg = document.createElement('img')
      let __currencyBox = document.createElement('div')
      let totalCurrency = document.createElement('span')
      let cryptoCurrency = document.createElement('span')

      WalletContentCurrencyBox.classList.add('wallet-content__currency-box')
      __currencyBox.classList.add('__currency-box')
      totalCurrency.classList.add('total-currency')
      cryptoCurrency.classList.add('crypto-currency')

      totalCurrency.innerHTML = element.totalCurrency
      cryptoCurrency.innerHTML = element.cryptoCurrency

      __currencyBox.append(totalCurrency, cryptoCurrency)
      WalletContentCurrencyBox.append(WalletContentCurrencyBoxImg, __currencyBox)
      WalletContentCurrency.append(WalletContentCurrencyBox)
    }

    middleContainerWallet.classList.add('middle-container__wallet', '__first-wallet')
    middleContainerWalletContent.classList.add('middle-container__wallet-content')
    WalletContentCircle_1.classList.add('wallet-content__circle1')
    WalletContentCircle_2.classList.add('wallet-content__circle2')
    WalletContentImg.classList.add('wallet-content__img')
    WalletContentPrice.classList.add('wallet-content__price')
    WalletContentPriceCrypto.classList.add('wallet-content__price-crypto')
    WalletContentPriceUSD.classList.add('wallet-content__price-usd')
    WalletContentCurrency.classList.add('wallet-content__currency')

    h3.innerHTML = item.crypto
    WalletContentPriceCrypto.innerHTML = item.walletContentPriceCrypto + ' ' + item.cryptoCurrency
    WalletContentPriceUSD.innerHTML = '$ ' + (item.walletContentPriceUSD).toLocaleString()


    WalletContentCircle_1.append(WalletContentCircle_2)
    WalletContentCircle_2.append(WalletContentImg)
    WalletContentPrice.append(WalletContentPriceCrypto, WalletContentPriceUSD)
    middleContainerWalletContent.append(WalletContentCircle_1, WalletContentPrice, WalletContentCurrency)
    middleContainerWallet.append(h3, middleContainerWalletContent)
    middleContainerWallets.prepend(middleContainerWallet)
  }
}