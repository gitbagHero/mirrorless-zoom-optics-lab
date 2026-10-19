import { expect, test } from '@playwright/test'

test('renders the I0 shell and static lens stage', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Mirrorless Zoom Optics Lab/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('24–200mm')
  await expect(page.getByTestId('lens-stage-preview')).toBeVisible()
  await expect(page.getByText('19 片 / 15 组').first()).toBeVisible()
  await expect(page.getByText('I0 SKELETON')).toBeVisible()
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

test('supports the keyboard skip link without console errors', async ({ page }) => {
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
  expect(errors).toEqual([])
})
