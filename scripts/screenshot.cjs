/* README 用のスクリーンショット撮影スクリプト */
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 820, height: 940 } })
  await page.goto('https://takekawa-kpc.github.io/todo2/')
  await page.evaluate(() => {
    localStorage.clear()
    location.reload()
  })
  await page.waitForLoadState('networkidle')
  await page.getByTestId('add-input').fill('メールの返信')
  await page.getByTestId('add-input').press('Enter')
  await page.getByTestId('add-input').fill('買い物リストを作成')
  await page.getByTestId('add-input').press('Enter')
  await page.getByTestId('add-input').fill('レポートの提出を忘れない')
  await page.getByTestId('add-input').press('Enter')
  // アプリ本体の実際のコンテンツ高さにビューポートを合わせて、main 領域だけを撮影して余白をトリミングする
  const height = await page.evaluate(() => {
    const footer = document.querySelector('footer')
    const main = document.querySelector('main')
    const bottom = (footer ?? main).getBoundingClientRect().bottom
    return Math.ceil(bottom + Number.parseFloat(getComputedStyle(main).paddingBottom))
  })
  await page.setViewportSize({ width: 820, height })
  await page.locator('main').screenshot({ path: 'docs/screenshot.png' })
  await browser.close()
  console.log('saved: docs/screenshot.png')
})()
