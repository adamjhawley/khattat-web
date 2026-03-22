import { test, expect } from '@playwright/test'

test.describe('DrawingCanvas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice')
    await page.waitForLoadState('networkidle')
    // Scroll canvas into view and wait for Framer Motion animation to settle
    const canvas = page.locator('canvas')
    await canvas.waitFor({ state: 'visible', timeout: 10000 })
    await canvas.scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
  })

  // Helper: sample pixels near a viewport coordinate and find any with the stroke color (#E8C99B = 232,201,155)
  async function hasStrokeAt(page: Parameters<typeof test>[1], vpX: number, vpY: number, radius = 10) {
    return page.evaluate(
      ([vpX, vpY, radius]) => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        for (let dx = -radius; dx <= radius; dx += 2) {
          for (let dy = -radius; dy <= radius; dy += 2) {
            const px = Math.round((vpX - rect.left + dx) * dpr)
            const py = Math.round((vpY - rect.top + dy) * dpr)
            if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue
            const d = ctx.getImageData(px, py, 1, 1).data
            // Stroke is #E8C99B (r≈232, g≈201, b≈155) — check for warm tan pixels
            if (d[0] > 180 && d[1] > 150 && d[2] > 100 && d[3] > 200) return true
          }
        }
        return false
      },
      [vpX, vpY, radius] as [number, number, number],
    )
  }

  test('strokes persist after mouse release', async ({ page }) => {
    const canvas = page.locator('canvas')
    const box = await canvas.boundingBox()
    expect(box).not.toBeNull()

    const { x, y, width, height } = box!
    const cx = x + width / 2
    const cy = y + height / 2

    // Draw a diagonal stroke through the center
    await page.mouse.move(cx - 50, cy - 50)
    await page.mouse.down()
    for (let i = 0; i <= 10; i++) {
      await page.mouse.move(cx - 50 + i * 10, cy - 50 + i * 10)
    }
    await page.mouse.up()
    await page.waitForTimeout(100)

    // Verify stroke pixels are visible at several points along the path
    let found = false
    for (let i = 2; i <= 8; i++) {
      const px = cx - 50 + i * 10
      const py = cy - 50 + i * 10
      if (await hasStrokeAt(page, px, py)) {
        found = true
        break
      }
    }
    expect(found).toBe(true)
  })

  test('multiple strokes accumulate', async ({ page }) => {
    const canvas = page.locator('canvas')
    const box = await canvas.boundingBox()
    expect(box).not.toBeNull()

    const { x, y, width, height } = box!

    const drawStroke = async (fromX: number, fromY: number, toX: number, toY: number) => {
      await page.mouse.move(fromX, fromY)
      await page.mouse.down()
      for (let i = 0; i <= 8; i++) {
        const t = i / 8
        await page.mouse.move(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t)
      }
      await page.mouse.up()
      await page.waitForTimeout(80)
    }

    // Draw two separate horizontal strokes in different areas
    const y1 = y + height * 0.35
    await drawStroke(x + width * 0.2, y1, x + width * 0.4, y1)
    const y2 = y + height * 0.65
    await drawStroke(x + width * 0.6, y2, x + width * 0.8, y2)

    // Both strokes should be visible
    const stroke1 = await hasStrokeAt(page, x + width * 0.3, y1, 12)
    const stroke2 = await hasStrokeAt(page, x + width * 0.7, y2, 12)

    expect(stroke1).toBe(true)
    expect(stroke2).toBe(true)
  })

  test('clear button removes all strokes', async ({ page }) => {
    const canvas = page.locator('canvas')
    const box = await canvas.boundingBox()
    expect(box).not.toBeNull()

    const { x, y, width, height } = box!
    const cy = y + height / 2

    // Draw a horizontal stroke across the middle
    await page.mouse.move(x + width * 0.2, cy)
    await page.mouse.down()
    for (let i = 0; i <= 8; i++) {
      await page.mouse.move(x + width * 0.2 + (width * 0.6) * (i / 8), cy)
    }
    await page.mouse.up()
    await page.waitForTimeout(80)

    // Verify stroke is visible
    const before = await hasStrokeAt(page, x + width / 2, cy, 12)
    expect(before).toBe(true)

    // Click Clear
    await page.getByRole('button', { name: /clear/i }).click()
    await page.waitForTimeout(80)

    // Verify stroke is gone
    const after = await hasStrokeAt(page, x + width / 2, cy, 12)
    expect(after).toBe(false)
  })
})
