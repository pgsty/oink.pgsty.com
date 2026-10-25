import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const album='/expo/studies/';
const fixture='/tests/expo-runtime/';
const viewer=page=>page.locator('[data-td-expo-viewer]');
const open=async (page,id)=>{await page.locator(`#img-${id} [data-td-expo-image]`).click();await expect(viewer(page)).toBeVisible();await expect(viewer(page).locator('[data-td-expo-full]')).toBeVisible();};
const chooseMode=(page,mode)=>page.locator(`input[data-td-expo-mode="${mode}"]`).check();
const panPosition=page=>viewer(page).locator('[data-td-expo-stage]').evaluate(s=>({x:s.scrollLeft,y:s.scrollTop}));
const contained=async page=>{
 await expect.poll(()=>viewer(page).locator('[data-td-expo-stage]').evaluate(stage=>{
  const image=stage.querySelector('img').getBoundingClientRect();
  return image.width<=stage.clientWidth+.01 && image.height<=stage.clientHeight+.01 && stage.scrollWidth<=stage.clientWidth && stage.scrollHeight<=stage.clientHeight;
 })).toBe(true);
};

test('Expo coordinates viewer closure and preserves focus during a handoff',async({page})=>{
 await page.goto(album);
 await open(page,'small');
 await page.evaluate(()=>window.OinkSurfaceCoordinator.closeAll(true));
 await expect(viewer(page)).toBeHidden();
 await expect(page.locator('#img-small [data-td-expo-image]')).toBeFocused();
 await open(page,'small');
 await page.evaluate(()=>{
  window.OinkSurfaceCoordinator.closeOthers('palette');
  window.OinkCommandPalette.instance.open();
 });
 await expect(viewer(page)).toBeHidden();
 await expect(page.locator('#td-shell-search')).toBeVisible();
 await expect(page.locator('#td-shell-search').getByRole('combobox')).toBeFocused();
});

for(const locale of ['', '/zh']) for(const mobile of [false,true]) {
 test(`Expo ${locale||'en'} ${mobile?'mobile':'desktop'}: modes, sizing, focus and accessibility`,async({page})=>{
  await page.setViewportSize(mobile?{width:390,height:844}:{width:1440,height:900});
  await page.goto(locale+album);
  const expo=page.locator('[data-td-expo]');
  await expect(page.locator('[data-td-expo-item]')).toHaveCount(6);
  for(const mode of ['cards','seamless','wall']) {
   await chooseMode(page,mode);
   await expect(expo).toHaveAttribute('data-td-expo-mode',mode);
   await expect(page.locator(`input[data-td-expo-mode="${mode}"]`)).toBeChecked();
   await expect(page.locator('input[data-td-expo-mode]:checked')).toHaveCount(1);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   const boxes=await page.locator('[data-td-expo-item]').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};}));
   for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++) {
    const a=boxes[i],b=boxes[j];expect(a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+1||b.bottom<=a.top+1).toBe(true);
   }
  }
  await expect(page.locator('input[data-td-expo-size]')).toBeVisible();
  await page.locator('input[data-td-expo-size]').press('ArrowRight');
  await expect(page.locator('input[data-td-expo-size]')).toHaveValue('260');
  await expect(page.locator('input[data-td-expo-size]')).toBeFocused();
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
  await open(page,'small');
  const dialogScan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(dialogScan.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.locator('#img-small [data-td-expo-image]')).toBeFocused();
 });
}

test('Expo preserves original size, contains expansion and resets manual zoom',async({page})=>{
 await page.setViewportSize({width:1280,height:800});
 await page.goto(fixture);
 await open(page,'small');
 const image=viewer(page).locator('[data-td-expo-full]');
 await expect(image).toHaveCSS('width','160px');await expect(image).toHaveCSS('height','100px');
 await viewer(page).locator('[data-td-expo-plus]').click();await expect(image).toHaveCSS('width','200px');
 await viewer(page).locator('[data-td-expo-minus]').click();await expect(image).toHaveCSS('width','160px');
 await viewer(page).locator('[data-td-expo-expand]').click();await contained(page);
 expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toBeGreaterThan(160);
 await viewer(page).locator('[data-td-expo-fit]').click();await expect(image).toHaveCSS('width','160px');
 await viewer(page).locator('[data-td-expo-next]').click();
 await expect(viewer(page).locator('[data-td-expo-position]')).toHaveText('2 / 5');
 expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toBeLessThan(1800);
 await viewer(page).locator('[data-td-expo-next]').click();
 await viewer(page).locator('[data-td-expo-expand]').click();await contained(page);
 await viewer(page).locator('[data-td-expo-plus]').click();
 expect(await viewer(page).locator('[data-td-expo-stage]').evaluate(s=>s.scrollHeight>s.clientHeight)).toBe(true);
 await viewer(page).locator('[data-td-expo-expand]').click();await contained(page);
 await viewer(page).locator('[data-td-expo-locate]').click();
 await expect(viewer(page)).toBeHidden();await expect(page).toHaveURL(/#img-long$/);
 await expect(page.locator('#img-long [data-td-expo-image]')).toBeFocused();
});

for(const mobile of [false,true]) test(`Expo expansion contains every aspect ratio on ${mobile?'mobile':'desktop'}`,async({page})=>{
 await page.setViewportSize(mobile?{width:390,height:844}:{width:1280,height:800});
 await page.goto(fixture);
 for(const id of ['small','large','long','wide']) {
  await open(page,id);
  await viewer(page).locator('[data-td-expo-expand]').click();await contained(page);
  await expect(page.locator('html')).toHaveCSS('overflow','hidden');
  const edges=await viewer(page).locator('[data-td-expo-stage]').evaluate(stage=>{
   const image=stage.querySelector('img').getBoundingClientRect();
   return Math.min(Math.abs(image.width-stage.clientWidth),Math.abs(image.height-stage.clientHeight));
  });
  expect(edges).toBeLessThan(1);
  await page.keyboard.press('Escape');
 }
});

test('Expo GIFs play by default, pause, and honor reduced motion with an explicit override',async({page})=>{
 await page.goto(fixture);
 const gif=page.locator('#img-motion img');await expect(gif).toHaveAttribute('src',/motion\.gif$/);
 await open(page,'motion');await expect(viewer(page).locator('[data-td-expo-full]')).toHaveAttribute('src',/motion\.gif$/);
 await viewer(page).locator('[data-td-expo-viewer-motion]').click();await expect(viewer(page).locator('[data-td-expo-full]')).not.toHaveAttribute('src',/\.gif$/);
 await page.keyboard.press('Escape');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 await expect(gif).not.toHaveAttribute('src',/\.gif$/);
 await page.locator('[data-td-expo-motion]').click();await expect(gif).toHaveAttribute('src',/motion\.gif$/);
});

for(const preset of ['paper','slate','ink','terminal']) for(const color of ['light','dark']) for(const mobile of [false,true]) {
 test(`Expo ${preset} ${color} ${mobile?'mobile':'desktop'}: palette and dialog`,async({page})=>{
  await page.setViewportSize(mobile?{width:390,height:844}:{width:1440,height:900});
  await page.addInitScript(({preset,color})=>{localStorage.setItem('td-preset',preset);localStorage.setItem('td-color-theme',color);},{preset,color});
  await page.goto(album);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await open(page,'small');
  await expect(page.locator('html')).toHaveAttribute('data-td-preset',preset);
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme',color);
  await page.keyboard.press('f');await contained(page);
  expect(await viewer(page).evaluate(dialog=>dialog.scrollWidth<=dialog.clientWidth&&dialog.scrollHeight<=dialog.clientHeight)).toBe(true);
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(scan.violations).toEqual([]);
 });
}

test('Expo no-JS links and captions survive, and Print and Markdown contain images without viewer',async({browser,baseURL,page})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});const plain=await context.newPage();await plain.goto(album);
 await expect(plain.locator('[data-td-expo-image]')).toHaveCount(6);await expect(plain.locator('[data-td-expo-controls]')).toBeHidden();await expect(plain.locator('.td-expo-caption').first()).toBeVisible();await context.close();
 for(const route of ['/expo/studies/index.md','/_print/expo/index.html','/expo/llms-full.txt']) {
  const response=await page.request.get(route);expect(response.ok()).toBe(true);const text=await response.text();expect(text).toContain('/expo/studies/images/small.svg');expect(text).not.toContain('data-td-expo-viewer');
 }
});

test('Expo keeps appearance in navigation, omits article actions, and prints readable captions',async({page})=>{
 await page.goto(album);
 await chooseMode(page,'cards');
 await expect(page.locator('main [data-td-appearance]')).toHaveCount(0);
 await expect(page.locator('main .td-page-actions')).toHaveCount(0);
 const trigger=page.locator('.td-site-header [aria-controls="td-appearance-navbar"]');
 // The documentation site opts into auto-hide; keyboard focus reveals its navbar.
 await trigger.focus();
 await trigger.click();
 const panel=page.locator('#td-appearance-navbar');
 for(const preset of ['slate','ink','terminal','paper']) {
  await panel.locator(`[data-td-preset-value="${preset}"]`).check();
  await expect(page.locator('html')).toHaveAttribute('data-td-preset',preset);
  await expect(page.locator('[data-td-expo]')).toHaveAttribute('data-td-expo-mode','cards');
 }
 await panel.locator('[data-bs-theme-value="dark"]').check();
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
 await chooseMode(page,'wall');
 await page.emulateMedia({media:'print'});
 await expect(page.locator('[data-td-expo-controls]')).toBeHidden();
 await expect(page.locator('.td-expo-caption').first()).toHaveCSS('position','static');
 await expect(page.locator('.td-expo-caption').first()).toHaveCSS('background-image','none');
 await expect(page.locator('.td-expo-caption small').first()).toHaveCSS('color','rgb(33, 32, 28)');
});

test('Expo remembers mode and size across albums, language routes and reloads',async({page})=>{
 await page.goto(album);await chooseMode(page,'seamless');
 const slider=page.locator('input[data-td-expo-size]');
 await slider.press('End');await slider.press('ArrowLeft');await slider.press('ArrowLeft');
 await expect(slider).toHaveValue('320');
 for(const route of ['/expo/sketches/','/zh/expo/studies/',album]) {
  await page.goto(route);
  await expect(page.locator('[data-td-expo]')).toHaveAttribute('data-td-expo-mode','seamless');
  await expect(page.locator('input[data-td-expo-mode="seamless"]')).toBeChecked();
  await expect(slider).toHaveValue('320');
 }
 await page.reload();await expect(slider).toHaveValue('320');
 await expect(page.locator('[data-td-expo]')).toHaveAttribute('data-td-expo-mode','seamless');
});

for(const storage of ['invalid','unavailable']) test(`Expo falls back safely with ${storage} reader storage`,async({page})=>{
 await page.addInitScript(storage=>{
  if(storage==='unavailable') Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});
  else {localStorage.setItem('td-expo-mode','unknown');localStorage.setItem('td-expo-size','9999');}
 },storage);
 await page.goto(album);
 await expect(page.locator('[data-td-expo]')).toHaveAttribute('data-td-expo-mode','wall');
 await expect(page.locator('input[data-td-expo-size]')).toHaveValue('240');
 await chooseMode(page,'cards');
 await expect(page.locator('[data-td-expo]')).toHaveAttribute('data-td-expo-mode','cards');
 await open(page,'small');await page.keyboard.press('Escape');
});

test('Expo toolbar keeps its segmented choice, motion control and size slider on one aligned row',async({page})=>{
 for(const width of [320,390,1440]) {
  await page.setViewportSize({width,height:900});await page.goto(fixture);
  const centers=await page.locator('.td-expo-modes,[data-td-expo-controls] > [data-td-expo-motion],.td-expo-size').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y+r.height/2};}));
  expect(Math.max(...centers.map(r=>r.y))-Math.min(...centers.map(r=>r.y))).toBeLessThan(1);
  expect(centers[0].right).toBeLessThan(centers[1].x);expect(centers[1].right).toBeLessThan(centers[2].x);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('input[data-td-expo-size]')).toBeVisible();
  await expect(page.locator('[data-td-expo-motion]')).toBeEnabled();
  const iconSizes=await page.locator('.td-expo-size i').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width));
  expect(iconSizes[1]).toBeGreaterThan(iconSizes[0]);
 }
 await page.goto(album);await expect(page.locator('[data-td-expo-motion]')).toBeVisible();
 await expect(page.locator('[data-td-expo-motion]')).toBeDisabled();
});

test('Expo mouse drag follows the pointer, respects bounds and releases capture',async({page})=>{
 await page.setViewportSize({width:1280,height:800});await page.goto(fixture);await open(page,'large');
 const stage=viewer(page).locator('[data-td-expo-stage]');
 for(let i=0;i<4;i++) await page.keyboard.press('k');
 await expect(stage).toHaveCSS('cursor','grab');
 const box=await stage.boundingBox(), x=box.x+box.width/2, y=box.y+box.height/2;
 const before=await panPosition(page);
 await page.mouse.move(x,y);await page.mouse.down();await expect(stage).toHaveCSS('cursor','grabbing');
 await page.mouse.move(x-120,y-80,{steps:5});
 await expect.poll(async()=>{const p=await panPosition(page);return Math.abs(p.x-before.x-120)<2&&Math.abs(p.y-before.y-80)<2;}).toBe(true);
 await page.mouse.up();await expect(stage).toHaveCSS('cursor','grab');
 const released=await panPosition(page);await page.mouse.move(x+80,y+60);expect(await panPosition(page)).toEqual(released);
 await page.mouse.down({button:'right'});await page.mouse.move(x,y);await page.mouse.up({button:'right'});expect(await panPosition(page)).toEqual(released);
 // Pointer capture keeps dragging active outside the stage and cannot move beyond the image.
 await page.mouse.down();await page.mouse.move(0,0,{steps:4});await page.mouse.up();
 const end=await stage.evaluate(s=>({x:s.scrollLeft,y:s.scrollTop,maxX:s.scrollWidth-s.clientWidth,maxY:s.scrollHeight-s.clientHeight}));
 expect(end.x).toBeGreaterThan(released.x);expect(end.x).toBeLessThanOrEqual(end.maxX);expect(end.y).toBeLessThanOrEqual(end.maxY);
 // Cancellation and closing during a drag must not leave a stuck grabbing state.
 await page.mouse.move(x,y);await page.mouse.down();await stage.dispatchEvent('pointercancel');
 await expect(stage).not.toHaveClass(/is-dragging/);await page.mouse.up();
 await page.mouse.down();await page.keyboard.press('Escape');await page.mouse.up();
 await open(page,'small');await expect(stage).not.toHaveClass(/is-dragging|is-pannable/);
 await expect(viewer(page).locator('[data-td-expo-full]')).toHaveAttribute('draggable','false');
});

test('Expo keyboard pans, zooms, fits, resets and navigates while enlarged',async({page})=>{
 await page.setViewportSize({width:1280,height:800});await page.goto(fixture);await open(page,'large');
 const image=viewer(page).locator('[data-td-expo-full]'), position=viewer(page).locator('[data-td-expo-position]');
 const initialWidth=await image.evaluate(i=>i.getBoundingClientRect().width);
 for(let i=0;i<4;i++) await page.keyboard.press('k');
 const start=await panPosition(page);
 for(const [key,dx,dy] of [['w',0,80],['a',80,80],['s',80,0],['d',0,0]]) {
  await page.keyboard.press(key);
  await expect.poll(async()=>{const p=await panPosition(page);return Math.abs(p.x-start.x-dx)<2&&Math.abs(p.y-start.y-dy)<2;}).toBe(true);
 }
 const enlarged=await image.evaluate(i=>i.getBoundingClientRect().width);
 await page.keyboard.press('j');expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toBeCloseTo(enlarged/1.25,1);
 await page.keyboard.press('r');await contained(page);expect(await panPosition(page)).toEqual({x:0,y:0});
 expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toBeCloseTo(initialWidth,1);
 await page.keyboard.press('q');await expect(position).toHaveText('1 / 5');
 await page.keyboard.press('f');await contained(page);expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toBeGreaterThan(160);
 const expandedWidth=await image.evaluate(i=>i.getBoundingClientRect().width);
 await page.keyboard.press('h');expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toEqual(expandedWidth);
 await page.keyboard.press('Shift+R');await expect(image).toHaveCSS('width','160px');
 await page.keyboard.press('e');await expect(position).toHaveText('2 / 5');
 for(let i=0;i<4;i++) await page.keyboard.press('k');
 await page.keyboard.press('l');await expect(position).toHaveText('3 / 5');await contained(page);
 await page.keyboard.press('h');await expect(position).toHaveText('2 / 5');await contained(page);
 for(let i=0;i<5;i++) await page.keyboard.press('e');await expect(position).toHaveText('5 / 5');
 await page.keyboard.press('k');const lastWidth=await image.evaluate(i=>i.getBoundingClientRect().width);
 await page.keyboard.press('l');expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toEqual(lastWidth);
 await page.keyboard.press('0');await contained(page);expect(await panPosition(page)).toEqual({x:0,y:0});
});

test('Expo shortcuts ignore modified keys, composition and editable controls, and stay inside the viewer',async({page})=>{
 await page.goto(fixture);await open(page,'small');
 const image=viewer(page).locator('[data-td-expo-full]'), stage=viewer(page).locator('[data-td-expo-stage]');
 for(const key of ['Control+k','Meta+k','Alt+k']) await stage.press(key);
 await stage.dispatchEvent('keydown',{key:'k',bubbles:true,isComposing:true});
 await expect(image).toHaveCSS('width','160px');
 // Future caption/search editing must not be intercepted by viewer shortcuts.
 await viewer(page).evaluate(dialog=>{const input=document.createElement('input');input.id='expo-edit-test';dialog.append(input);});
 await page.locator('#expo-edit-test').fill('wasd qerf hjkl');await page.locator('#expo-edit-test').press('k');
 await expect(image).toHaveCSS('width','160px');await expect(viewer(page).locator('[data-td-expo-position]')).toHaveText('1 / 5');
 await page.keyboard.press('Escape');await expect(viewer(page)).toBeHidden();
 // The shell still owns page/language/chrome shortcuts outside the viewer.
 for(const key of ['k','j']) await page.keyboard.press(key);
 await expect(viewer(page)).toBeHidden();await expect(image).toHaveCSS('width','160px');
 await open(page,'small');await expect(image).toHaveCSS('width','160px');
});

test('Expo albums name their own section in the sidebar root switcher',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(album);
 // A home-level album must not borrow the first site section's label.
 await expect(page.locator('#td-shell-sidebar .td-shell-root__title').first()).toHaveText('Expo');
});

test('Expo double-click alternates between the initial fit and a closer look',async({page})=>{
 await page.setViewportSize({width:1280,height:800});await page.goto(fixture);
 const image=viewer(page).locator('[data-td-expo-full]');
 await open(page,'large');await contained(page);
 // A shrunk original opens at 100% under the pointer; the next double-click restores the fit.
 await image.dblclick();await expect(image).toHaveCSS('width','1800px');
 expect(await viewer(page).locator('[data-td-expo-stage]').evaluate(s=>s.scrollWidth>s.clientWidth)).toBe(true);
 await image.dblclick();await contained(page);
 await page.keyboard.press('Escape');
 // An original already at 100% expands instead.
 await open(page,'small');await image.dblclick();await contained(page);
 expect(await image.evaluate(i=>i.getBoundingClientRect().width)).toBeGreaterThan(160);
 await image.dblclick();await expect(image).toHaveCSS('width','160px');
});

test('Expo shows the grid preview while an original loads and warms the next image',async({page})=>{
 await page.setViewportSize({width:1280,height:800});await page.goto(fixture);
 let release;const gate=new Promise(resolve=>{release=resolve;});
 await page.route(/\/large\.png$/,async route=>{await gate;await route.continue();});
 const warmed=page.waitForRequest(/\/large\.png$/);
 await open(page,'small');await warmed;
 const image=viewer(page).locator('[data-td-expo-full]');
 await expect.poll(()=>image.evaluate(node=>node.naturalWidth)).toBe(160);
 await viewer(page).locator('[data-td-expo-next]').click();
 await expect(image).toHaveCSS('background-image',/url\(.+\.webp"?\)/);
 await expect.poll(()=>image.evaluate(node=>node.naturalWidth)).toBe(0);
 release();
 await expect(image).toHaveCSS('background-image','none');
});

test.describe('touch',()=>{
 test.use({hasTouch:true,viewport:{width:390,height:844}});
 test('Expo swipes between fitted images and leaves enlarged images to native scrolling',async({page})=>{
  await page.goto(fixture);await open(page,'small');
  const position=viewer(page).locator('[data-td-expo-position]');
  const swipe=async dx=>{
   const stage=viewer(page).locator('[data-td-expo-stage]');
   const box=await stage.boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
   const touch=clientX=>({identifier:1,clientX,clientY:y});
   // Playwright creates native Touch objects for each engine, including WebKit
   // where directly calling the Touch constructor is unsupported.
   await stage.dispatchEvent('touchstart',{touches:[touch(x)],changedTouches:[touch(x)]});
   await stage.dispatchEvent('touchend',{touches:[],changedTouches:[touch(x+dx)]});
  };
  await swipe(-120);await expect(position).toHaveText('2 / 5');
  await swipe(120);await expect(position).toHaveText('1 / 5');
  // Short movements and the album start leave the view unchanged.
  await swipe(20);await swipe(120);await expect(position).toHaveText('1 / 5');
  await swipe(-120);await expect(position).toHaveText('2 / 5');
  for(let i=0;i<4;i++) await viewer(page).locator('[data-td-expo-plus]').click();
  await swipe(-120);await expect(position).toHaveText('2 / 5');
 });
});
