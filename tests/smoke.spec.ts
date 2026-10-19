import { expect, test } from '@playwright/test'

test('renders the I1 shell and the 19-element structure', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Mirrorless Zoom Optics Lab/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('24–200mm')
  await expect(page.getByTestId('lens-structure')).toBeVisible()
  await expect(page.getByText('I1 STRUCTURE')).toBeVisible()
  await expect(page.getByTestId('element-L11')).toBeVisible()
  await expect(page.getByTestId('element-L62')).toBeVisible()
  await expect(page.locator('[data-testid^="element-"]')).toHaveCount(19)
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
