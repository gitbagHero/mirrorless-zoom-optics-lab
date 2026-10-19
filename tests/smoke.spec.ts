import { expect, test } from '@playwright/test'

test('renders the v1.0 lab and the 19-element structure', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Mirrorless Zoom Optics Lab/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('24–200mm')
  await expect(page.getByTestId('lens-structure')).toBeVisible()
  await expect(page.getByText('v1.0 RELEASE')).toBeVisible()
  await expect(page.locator('.build-badge')).toContainText('v1.0')
  await expect(page.getByTestId('element-L11')).toBeVisible()
  await expect(page.getByTestId('element-L62')).toBeVisible()
  await expect(page.locator('[data-testid^="element-"]')).toHaveCount(19)
  await expect(page.getByTestId('ray-canvas')).toBeVisible()
  await expect(page.getByTestId('efl-value')).toContainText('24.70')
})

test('selects an element and switches between 19 elements and 6 groups', async ({ page }) => {
  await page.goto('/')

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
  await page.goto('/')

  const slider = page.getByRole('slider', { name: '焦距' })
  await expect(slider).toHaveValue('24')
  await expect(page.getByTestId('efl-value')).toContainText('24.70')
  await expect(page.getByTestId('motion-G1')).toContainText('0.0')

  await slider.focus()
  await page.keyboard.press('End')
  await expect(slider).toHaveValue('200')
  await expect(page.locator('.zoom-value')).toContainText('200')
  await expect(page.getByTestId('efl-value')).toContainText('194.00')
  await expect(page.getByTestId('motion-G1')).toContainText('69.8')
  await expect(page.getByTestId('motion-G3')).toContainText('31.0')
  await expect(page.getByTestId('motion-G6')).toContainText('31.0')

  await page.keyboard.press('Home')
  await expect(slider).toHaveValue('24')
  await expect(page.getByTestId('efl-value')).toContainText('24.70')
  await expect(page.getByTestId('motion-G1')).toContainText('0.0')
})

test('guide presets drive the workbench and open the model notes', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('guide-try-zoom').click()
  await expect(page.locator('#focal-range')).toHaveValue('200')
  await expect(page.getByRole('button', { name: '6 组功能' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByTestId('inspector-selection')).toContainText('G5')

  await page.getByTestId('guide-try-elements').click()
  await expect(page.locator('#focal-range')).toHaveValue('50')
  await expect(page.getByTestId('inspector-selection')).toContainText('L12')

  await page.getByTestId('guide-try-model').click()
  await expect(page.locator('#data-notes details')).toHaveAttribute('open', '')
})

test('focuses manually and with AF-S / AF-C', async ({ page }) => {
  await page.goto('/')

  const status = page.getByTestId('focus-status')
  const clarity = page.getByTestId('focus-clarity')
  await expect(status).toHaveText('合焦')
  await expect(clarity).toHaveText('100%')
  await expect(page.getByTestId('target-scene')).toBeVisible()

  const manual = page.getByRole('slider', { name: '手动对焦' })
  await manual.press('End')
  await expect(status).toHaveText('离焦')
  await expect(clarity).toHaveText('0%')

  await page.getByRole('button', { name: /AF-S 单次对焦/ }).click()
  await expect(status).toHaveText('合焦', { timeout: 3000 })
  await expect(clarity).toHaveText('100%')

  await page.getByRole('button', { name: /近景/ }).click()
  await expect(status).toHaveText('合焦', { timeout: 3000 })

  await page.getByRole('button', { name: /连续 AF-C/ }).click()
  await page.getByRole('button', { name: /远景 20 m/ }).click()
  await expect(status).toHaveText('合焦', { timeout: 3000 })
})

test('switches ray presets and toggles the ray layer', async ({ page }) => {
  await page.goto('/')

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

test('opens the data notes and exposes sources', async ({ page }) => {
  await page.goto('/')

  const notes = page.locator('#data-notes details')
  await expect(notes).not.toHaveAttribute('open', '')
  await notes.locator('summary').click()
  await expect(notes).toHaveAttribute('open', '')
  await expect(notes.getByRole('link', { name: /产品页/ })).toBeVisible()
})

test('does not overflow the viewport on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const overflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth - root.clientWidth
  })

  expect(overflow).toBeLessThanOrEqual(1)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
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

  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#workbench$/)

  await page.getByTestId('element-L12').focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('inspector-selection')).toContainText('L12')
  expect(errors).toEqual([])
})

test('keyboard main path: zoom, manual defocus, AF-S refocus', async ({ page }) => {
  await page.goto('/')

  const zoom = page.getByRole('slider', { name: '焦距' })
  await zoom.focus()
  await page.keyboard.press('End')
  await expect(zoom).toHaveValue('200')

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
  await page.goto('/')

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
