const {test, expect} = require('@playwright/test');
 
test('First Login Test', async function({page})
{
    // Declarations
    const login_link = page.getByText('Log in');
    const email = page.locator('#Email');
    const password = page.locator('#Password');
    const logout = page.getByRole('link', {name: "Log out"});
    const emailid = 'sidtest@yopmail.com';
    const quantity = '3';
 
 
    // Test Steps for Login
    await page.goto('https://demowebshop.tricentis.com/');
    page.setViewportSize({ width: 1900, height: 1200 });
    await page.waitForLoadState('networkidle');
    await login_link.click();
    await expect(email).toBeVisible();
    await email.fill(emailid);
    expect(password).toBeVisible();
    await password.fill('Test@1234');
    // await page.getByRole('button', {name: "Log in"}).click();
    const login = page.getByRole('button', {name: "Log in"});
    await expect(login).toBeVisible();
    await login.click();    
    await expect(logout).toBeVisible();
    console.log("Login Successful");
    // page.waitForTimeout(5000);
   
    await page.locator('.item-box').filter({hasText: 'Simple Computer'})
    .getByRole('button', {value: 'Add to cart'}).click();
    await page.locator('#add-to-cart-button-75').click();
    console.log("Item added to the cart");
 
    await page.locator('#product_attribute_75_5_31_96').click();
    await expect(page.locator('#bar-notification')).toBeVisible();
    await expect(page.locator('#product_attribute_75_5_31_96')).toBeVisible();
    await page.locator('#product_attribute_75_5_31_96').click();
    await page.pause();
    
    if(await page.locator('.cart-qty').innerText()==='(0)')
    {
        await page.locator('#addtocart_75_EnteredQuantity').fill(quantity);
        console.log(`Quantity set to ${quantity} for the item`);
    }
    else
    {
        console.log("Item already exists in the cart, removing the items from the cart");
        await page.getByText('Shopping cart').first().click()
        await page.locator('input[name="removefromcart"]').check();

        await page.locator('.update-cart-button').click();
        console.log("Item removed from the cart");
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.goBack(),
          ]);
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.goBack(),
          ]);
        await page.locator('#addtocart_75_EnteredQuantity').fill(quantity);
        console.log(`Quantity set to ${quantity} for the item after removing the item from the cart`);
    }
    await page.locator('#add-to-cart-button-75').click();
    await page.getByText('Shopping cart').first().click();
    console.log(`Quantity updated to ${quantity} in the cart`);
    await expect(page.locator('input[name*="itemquantity"]')).toHaveValue('3'); 
    console.log("Quantity verified in the cart");
    await page.locator('#checkout').click();
    // page.on('dialog', (dialog => dialog.dismiss()));
    await expect(page.locator('#ui-id-2')).toBeVisible();
    await expect(page.getByText('Terms of service', { exact: true })).toBeVisible();
    //await page.getByRole('button', { title: 'close'}).click();
    await page.getByRole('button', { name: 'close' }).click();
 
   
 
   
 
    // Test Steps for Logout
    await logout.click();
    console.log("Logout Successful");
    await expect(login_link).toBeVisible();
   
});
 