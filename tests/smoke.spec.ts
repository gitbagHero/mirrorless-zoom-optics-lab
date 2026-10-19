import { expect, test, type Page } from '@playwright/test'

async function goTo(page: Page, label: string) {
  await page
    .getByRole('navigation', { name: '模块导航' })
    .getByRole('button', { name: new RegExp(label) })
    .click()
}

test('renders the landing and enters the workbench', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Mirrorless Zoom Optics Lab/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('看见一支变焦镜头的内部。')
  await expect(page.getByRole('button', { name: /进入工作台/ }).first()).toBeVisible()
  await expect(page.locator('.landing-lens')).toBeVisible()
  await expect(page.getByRole('navigation', { name: '模块导航' })).toHaveCount(0)

  await page.getByRole('button', { name: '进入工作台', exact: true }).click()
  await expect(page).toHaveURL(/#workbench$/)
  await expect(page.getByRole('heading', { level: 1, name: '光学工作台' })).toBeVisible()
  await expect(page.getByTestId('lens-structure')).toBeVisible()
  await expect(page.getByText('v1.0 RELEASE')).toBeVisible()
  await expect(page.getByTestId('element-L11')).toBeVisible()
  await expect(page.getByTestId('element-L62')).toBeVisible()
  await expect(page.locator('[data-testid^="element-"]')).toHaveCount(19)
  await expect(page.getByTestId('ray-canvas')).toBeVisible()
  await expect(page.getByTestId('efl-value')).toContainText('24.70')
  await expect(page.getByLabel('外壳')).not.toBeChecked()
  await expect(page.getByTestId('lens-shell')).toHaveCount(0)
  await expect(page.locator('.landing-page')).toHaveCount(0)

  await page.getByRole('link', { name: '返回起始页' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('看见一支变焦镜头的内部。')
  await expect(page.getByRole('navigation', { name: '模块导航' })).toHaveCount(0)
})

test('selects an element and switches between 19 elements and 6 groups', async ({ page }) => {
  await page.goto('/#workbench')

  const inspector = page.getByTestId('inspector-selection')
  await expect(inspector).toContainText('G1')

  await page.getByTestId('element-L12').click()
  await expect(inspector).toContainText('L12')
  await expect(inspector).toContainText('ED')

  await page.getByRole('button', { name: '6 组功能' }).click()
  await expect(page.getByTestId('group-G1')).toBeVisible()
  await expect(inspector).toContainText('G1')

  await page.getByTestId('group-G5').click()
  await expect(inspector).toContainText('G5')
  await expect(inspector).toContainText('对焦')

  await page.getByRole('button', { name: '19 片结构' }).click()
  await expect(page.getByTestId('element-L11')).toBeVisible()
})

test('moves the six groups across the zoom range', async ({ page }) => {
  await page.goto('/#workbench')

  const slider = page.getByRole('slider', { name: '焦距' })
  await expect(slider).toHaveValue('24')
  await expect(page.getByTestId('efl-value')).toContainText('24.70')

  await slider.focus()
  await page.keyboard.press('End')
  await expect(slider).toHaveValue('200')
  await expect(page.locator('.zoom-value')).toContainText('200')
  await expect(page.getByTestId('efl-value')).toContainText('194.00')

  await page.getByRole('tab', { name: '变焦运动' }).click()
  await expect(page.getByTestId('motion-panel')).toBeVisible()
  await expect(page.getByTestId('motion-G1')).toContainText('69.8')
  await expect(page.getByTestId('motion-G3')).toContainText('31.0')
  await expect(page.getByTestId('motion-G6')).toContainText('31.0')
  await expect(page.getByTestId('inspector-selection')).toHaveCount(0)

  await slider.focus()
  await page.keyboard.press('Home')
  await expect(slider).toHaveValue('24')
  await expect(page.getByTestId('motion-G1')).toContainText('0.0')
})

test('guide presets switch modules and target the right panel', async ({ page }) => {
  await page.goto('/#guide')

  await page.getByTestId('guide-nav-zoom').click()
  await expect(page.getByTestId('guide-try-zoom')).toBeVisible()
  await page.getByTestId('guide-try-zoom').click()
  await expect(page.getByRole('heading', { level: 1, name: '光学工作台' })).toBeVisible()
  await expect(page.locator('#focal-range')).toHaveValue('200')
  await expect(page.getByRole('tab', { name: '变焦运动' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByTestId('motion-panel')).toBeVisible()

  await page.getByRole('tab', { name: '结构说明' }).click()
  await expect(page.getByRole('button', { name: '6 组功能' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByTestId('inspector-selection')).toContainText('G5')

  await goTo(page, '导览')
  await page.getByTestId('guide-nav-elements').click()
  await page.getByTestId('guide-try-elements').click()
  await expect(page.locator('#focal-range')).toHaveValue('50')
  await expect(page.getByTestId('inspector-selection')).toContainText('L12')

  await goTo(page, '导览')
  await page.getByTestId('guide-nav-model').click()
  await page.getByTestId('guide-try-model').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('数据说明与来源')
  await expect(page.getByTestId('repo-link')).toHaveAttribute(
    'href',
    'https://github.com/gitbagHero/mirrorless-zoom-optics-lab',
  )
})

test('focuses manually and with AF-S / AF-C', async ({ page }) => {
  await page.goto('/#focus')

  const status = page.getByTestId('focus-status')
  const viewer = page.getByTestId('focus-group-viewer')
  await expect(status).toHaveText('合焦')
  await expect(viewer).toBeVisible()
  const initialPosition = Number(await viewer.getAttribute('data-position'))
  expect(initialPosition).toBeGreaterThan(0)
  expect(initialPosition).toBeLessThan(1)

  const manual = page.getByRole('slider', { name: '手动对焦' })
  await manual.press('End')
  await expect(status).toHaveText('离焦')
  await expect(viewer).toHaveAttribute('data-position', '1.000')

  await page.getByRole('button', { name: /AF-S 单次对焦/ }).click()
  await expect(status).toHaveText('合焦', { timeout: 3000 })
  await expect(Number(await viewer.getAttribute('data-position'))).toBeCloseTo(initialPosition, 2)

  await page.getByRole('button', { name: /近景/ }).click()
  await expect(status).toHaveText('合焦', { timeout: 3000 })
  await expect(Number(await viewer.getAttribute('data-position'))).toBeGreaterThan(0.95)

  await page.getByRole('button', { name: /连续 AF-C/ }).click()
  await page.getByRole('button', { name: /远景 20 m/ }).click()
  await expect(status).toHaveText('合焦', { timeout: 3000 })
  await expect(Number(await viewer.getAttribute('data-position'))).toBeLessThan(0.1)
})

test('switches ray presets and toggles the ray layer', async ({ page }) => {
  await page.goto('/#workbench')

  const canvas = page.getByTestId('ray-canvas')
  await expect(canvas).toBeVisible()
  const size = await canvas.evaluate((element) => ({
    width: (element as HTMLCanvasElement).width,
    height: (element as HTMLCanvasElement).height,
  }))
  expect(size.width).toBeGreaterThan(0)
  expect(size.height).toBeGreaterThan(0)

  const offAxis = page.getByRole('button', { name: '轴外' })
  await offAxis.click()
  await expect(offAxis).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: '光线扇' }).click()
  await expect(page.getByRole('button', { name: '光线扇' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  const toggle = page.getByLabel('显示光线')
  await toggle.uncheck()
  await expect(toggle).not.toBeChecked()
  await toggle.check()
  await expect(toggle).toBeChecked()
})

test('toggles the lens shell and moves its front with zoom', async ({ page }) => {
  await page.goto('/#workbench')

  const shell = page.getByTestId('lens-shell')
  await expect(shell).toHaveCount(0)
  const shellToggle = page.getByLabel('外壳')
  await shellToggle.check()
  await expect(shell).toBeVisible()
  const frontAt24 = Number(await shell.getAttribute('data-front-x'))
  const g1At24 = Number(await shell.getAttribute('data-g1-front'))
  const midAt24 = Number(await shell.getAttribute('data-mid-x'))
  const frontLength24 = await shell.getAttribute('data-front-length')
  const midLength24 = await shell.getAttribute('data-mid-length')
  expect(g1At24 - frontAt24).toBeCloseTo(18, 1)

  const slider = page.getByRole('slider', { name: '焦距' })
  await slider.focus()
  await page.keyboard.press('End')
  await expect(slider).toHaveValue('200')
  const frontAt200 = Number(await shell.getAttribute('data-front-x'))
  const g1At200 = Number(await shell.getAttribute('data-g1-front'))
  const midAt200 = Number(await shell.getAttribute('data-mid-x'))
  const frontLength200 = await shell.getAttribute('data-front-length')
  const midLength200 = await shell.getAttribute('data-mid-length')
  expect(g1At200 - frontAt200).toBeCloseTo(18, 1)
  expect(frontAt200).toBeLessThan(frontAt24)
  expect(midAt200).toBeLessThan(midAt24)
  expect(frontLength200).toBe(frontLength24)
  expect(midLength200).toBe(midLength24)

  await shellToggle.uncheck()
  await expect(shell).toHaveCount(0)
})

test('collapses the sidebar and persists the state', async ({ page }) => {
  await page.goto('/#workbench')

  await page.getByRole('button', { name: '折叠菜单' }).click()
  await expect(page.locator('.app-shell')).toHaveClass(/is-collapsed/)
  await expect(page.getByRole('button', { name: '展开菜单' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )

  await page.reload()
  await expect(page.locator('.app-shell')).toHaveClass(/is-collapsed/)
  await page.getByRole('button', { name: '展开菜单' }).click()
  await expect(page.locator('.app-shell')).not.toHaveClass(/is-collapsed/)
})

test('data module exposes sources and the repository address', async ({ page }) => {
  await page.goto('/#data')

  await expect(page.getByText('模型边界', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /产品页/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /US20220121021A1/ })).toBeVisible()
  await expect(page.getByTestId('repo-link')).toBeVisible()
  await expect(page.getByTestId('repo-link')).toHaveAttribute(
    'href',
    'https://github.com/gitbagHero/mirrorless-zoom-optics-lab',
  )
})

test('does not overflow the viewport on mobile for every module', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  let overflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth - root.clientWidth
  })
  expect(overflow, 'landing').toBeLessThanOrEqual(1)

  await page.getByRole('button', { name: '进入工作台', exact: true }).click()
  await expect(page.locator('.app-shell')).toBeVisible()

  for (const label of ['工作台', '对焦', '导览', '数据说明']) {
    await goTo(page, label)
    overflow = await page.evaluate(() => {
      const root = document.documentElement
      return root.scrollWidth - root.clientWidth
    })
    expect(overflow, label).toBeLessThanOrEqual(1)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
})

test('supports keyboard selection and the skip link without console errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  await page.goto('/#workbench')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#module-main$/)
  await expect(page.getByRole('heading', { level: 1, name: '光学工作台' })).toBeVisible()

  await page.getByTestId('element-L12').focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('inspector-selection')).toContainText('L12')
  expect(errors).toEqual([])
})

test('keyboard main path: zoom, module switch, manual defocus, AF-S refocus', async ({
  page,
}) => {
  await page.goto('/#workbench')

  const zoom = page.getByRole('slider', { name: '焦距' })
  await zoom.focus()
  await page.keyboard.press('End')
  await expect(zoom).toHaveValue('200')

  await goTo(page, '对焦')
  const manual = page.getByRole('slider', { name: '手动对焦' })
  await manual.focus()
  await page.keyboard.press('End')
  await expect(page.getByTestId('focus-status')).toHaveText('离焦')

  const afs = page.getByRole('button', { name: /AF-S 单次对焦/ })
  await afs.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('focus-status')).toHaveText('合焦', { timeout: 3000 })
})

test('respects reduced motion and exposes accessible names', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#focus')

  await page.getByRole('slider', { name: '手动对焦' }).press('End')
  await expect(page.getByTestId('focus-status')).toHaveText('离焦')
  await page.getByRole('button', { name: /AF-S 单次对焦/ }).click()
  await expect(page.getByTestId('focus-status')).toHaveText('合焦', { timeout: 1000 })

  const unnamedButtons = await page.locator('button').evaluateAll((buttons) =>
    buttons.filter(
      (button) =>
        !button.textContent?.trim() && !button.getAttribute('aria-label'),
    ).length,
  )
  expect(unnamedButtons).toBe(0)

  const unlabeledRanges = await page.locator('input[type="range"]').evaluateAll((inputs) =>
    inputs.filter(
      (input) =>
        !input.getAttribute('aria-label') &&
        !input.getAttribute('aria-labelledby') &&
        !(input as HTMLInputElement).labels?.length,
    ).length,
  )
  expect(unlabeledRanges).toBe(0)
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
})
