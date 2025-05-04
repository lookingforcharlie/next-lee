'use client'

export default function PromisePage() {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('50')
      // reject('100')
    }, 300)
  })

  // convert promise to async await
  async function executePromise() {
    // myPromise
    //   .then((result) => {
    //     console.log(result + ' from then')
    //     return 'I want you to hit me as hard as you can'
    //   })
    //   .then((result) => {
    //     console.log(result + ' from then 2')
    //   })
    //   .catch((result) => {
    //     console.log(result + ' from catch')
    //   })

    const result = await myPromise
    console.log(result + ' from async await')
  }

  executePromise()

  return <div>PromisePage</div>
}
