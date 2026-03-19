const {test, expect} = require('@playwright/test');
const billingData = {
    firstName: 'Hardik',
    lastName: 'Vaghela',
    email: 'vaghelahardik140896@gmail.com',
    company: 'Test Company',
    country: 'United States',
    city: 'New York',
    address1: '123 Main Street',
    address2: 'Apt 4B',
    zipCode: '10001',
    phoneNumber: '9876543210',
    faxNumber: '1234567890',
};

test('First Login Test', async function({page})
{
    // ============================================================
    // DECLARATIONS - Define locators and test data
    // ============================================================
    const login_link = page.getByText('Log in');
    const email = page.locator('#Email');
    const password = page.locator('#Password');
    const logout = page.getByRole('link', {name: "Log out"});
    const emailid = 'vaghelahardik140896@gmail.com';
    const quantity = '3';
 
 
    // ============================================================
    // STEP 1: Launch the application and set viewport
    // ============================================================
    await page.goto('https://demowebshop.tricentis.com/');
    page.setViewportSize({ width: 1900, height: 1200 });

    // Wait for the page to fully load before interacting
    await page.waitForLoadState('networkidle');


    // ============================================================
    // STEP 2: Navigate to Login Page
    // ============================================================
    await login_link.click();

    // Verify email input is visible before filling credentials
    await expect(email).toBeVisible();


    // ============================================================
    // STEP 3: Enter Login Credentials
    // ============================================================
    // Fill in the email address
    await email.fill(emailid);

    // Verify password field is visible before filling
    expect(password).toBeVisible();

    // Fill in the password
    await password.fill('Test@1234');


    // ============================================================
    // STEP 4: Click Login Button and Verify Successful Login
    // ============================================================
    const login = page.getByRole('button', {name: "Log in"});

    // Ensure login button is visible before clicking
    await expect(login).toBeVisible();
    await login.click();

    // Verify logout link is visible — confirms successful login
    await expect(logout).toBeVisible();
    console.log("Login Successful");


    // ============================================================
    // STEP 5: Navigate to the Product Page (Simple Computer)
    // ============================================================
    // Filter item boxes to find 'Simple Computer' and click Add to Cart
    await page.locator('.item-box').filter({hasText: 'Simple Computer'})
    .getByRole('button', {value: 'Add to cart'}).click();

    // Click the Add to Cart button on the product detail page
    await page.locator('#add-to-cart-button-75').click();
    console.log("Item added to the cart");


    // ============================================================
    // STEP 6: Select Product Attribute (e.g., RAM/HDD option)
    // ============================================================
    // Click the product attribute option (e.g., configuration/variant)
    await page.locator('#product_attribute_75_5_31_96').click();

    // Verify the notification bar appears after attribute selection
    await expect(page.locator('#bar-notification')).toBeVisible();

    // Verify the selected attribute is still visible on the page
    await expect(page.locator('#product_attribute_75_5_31_96')).toBeVisible();

    // Re-click the attribute to confirm or toggle the selection
    await page.locator('#product_attribute_75_5_31_96').click();

    // Pause for debugging — remove this in final test run
    await page.pause();
    

    // ============================================================
    // STEP 7: Check Cart Status and Handle Quantity Accordingly
    // ============================================================
    if(await page.locator('.cart-qty').innerText()==='(0)')
    {
        // Cart is empty — directly set the desired quantity
        await page.locator('#addtocart_75_EnteredQuantity').fill(quantity);
        console.log(`Quantity set to ${quantity} for the item`);
    }
    else
    {
        // Cart already has items — remove existing items before adding fresh
        console.log("Item already exists in the cart, removing the items from the cart");

        // Navigate to the Shopping Cart page
        await page.getByText('Shopping cart').first().click();

        // Check the remove checkbox to select the item for removal
        await page.locator('input[name="removefromcart"]').check();

        // Click Update Cart to apply the removal
        await page.locator('.update-cart-button').click();
        console.log("Item removed from the cart");

        // Navigate back to the product page (first goBack)
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.goBack(),
        ]);

        // Navigate back again to reach the product detail page (second goBack)
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.goBack(),
        ]);

        // Set the desired quantity on the product page after cart is cleared
        await page.locator('#addtocart_75_EnteredQuantity').fill(quantity);
        console.log(`Quantity set to ${quantity} for the item after removing the item from the cart`);
    }


    // ============================================================
    // STEP 8: Add Item with Updated Quantity to Cart
    // ============================================================
    // Click Add to Cart button with the new quantity filled in
    await page.locator('#add-to-cart-button-75').click();

    // Navigate to the Shopping Cart to verify the quantity
    await page.getByText('Shopping cart').first().click();
    console.log(`Quantity updated to ${quantity} in the cart`);


    // ============================================================
    // STEP 9: Verify Quantity in the Cart
    // ============================================================
    // Assert the quantity input in cart matches the expected quantity '3'
    // Using partial name match to handle dynamic product ID in name attribute
    await expect(page.locator('input[name*="itemquantity"]')).toHaveValue('3'); 
    console.log("Quantity verified in the cart");


    // ============================================================
    // STEP 10: Proceed to Checkout
    // ============================================================
    // Click the Checkout button to proceed with the order
    await page.locator('#checkout').click();


    // ============================================================
    // STEP 11: Handle Terms of Service Dialog
    // ============================================================
    // Verify the Terms of Service dialog appears
    await expect(page.locator('#ui-id-2')).toBeVisible();

    // Confirm the dialog title text is correct
    await expect(page.getByText('Terms of service', { exact: true })).toBeVisible();

    // Close the Terms of Service dialog by clicking the close button
    await page.getByRole('button', { name: 'close' }).click();
    //await page.getByRole('checkbox', { name: 'termsofservice' }).check();
    // Check the terms of service
    await page.locator('#termsofservice').check();
    // Click the Checkout button to proceed with the order
    await page.locator('#checkout').click();

    //Step 12: Billing Form data filling steps

    // STEP 12.1: Verify Billing form is visible
    await expect(page.locator('#co-billing-form')).toBeVisible();
    console.log('Billing form is visible');

    // STEP 12.2: Verify pre-filled First Name
    await expect(page.locator('#BillingNewAddress_FirstName'))
        .toHaveValue(billingData.firstName);
    console.log(`First name pre-filled: ${billingData.firstName}`);

    // STEP 12.3: Verify pre-filled Last Name
    await expect(page.locator('#BillingNewAddress_LastName'))
        .toHaveValue(billingData.lastName);
    console.log(`Last name pre-filled: ${billingData.lastName}`);

    // STEP 12.4: Verify pre-filled Email
    await expect(page.locator('#BillingNewAddress_Email'))
        .toHaveValue(billingData.email);
    console.log(`Email pre-filled: ${billingData.email}`);

    // STEP 12.5: Fill Company Name (optional field)
    await page.locator('#BillingNewAddress_Company').fill(billingData.company);
    await expect(page.locator('#BillingNewAddress_Company'))
        .toHaveValue(billingData.company);
    console.log(`Company filled: ${billingData.company}`);

    // STEP 12.6: Select Country from dropdown
    await page.locator('#BillingNewAddress_CountryId')
        .selectOption({ label: billingData.country });
    await expect(page.locator('#BillingNewAddress_CountryId'))
        .toHaveValue('1'); // United States = value 1
    await page.waitForLoadState('networkidle'); // Wait for states to load
    console.log(`Country selected: ${billingData.country}`);

    // STEP 12.7: Select State/Province from dropdown
    await page.locator('#BillingNewAddress_StateProvinceId')
        .selectOption({ index: 1 }); // Select first available state
    console.log('State/Province selected');

    // STEP 12.8: Fill City
    await page.locator('#BillingNewAddress_City').fill(billingData.city);
    await expect(page.locator('#BillingNewAddress_City'))
        .toHaveValue(billingData.city);
    console.log(`City filled: ${billingData.city}`);

    // STEP 12.9: Fill Address Line 1 (required)
    await page.locator('#BillingNewAddress_Address1').fill(billingData.address1);
    await expect(page.locator('#BillingNewAddress_Address1'))
        .toHaveValue(billingData.address1);
    console.log(`Address 1 filled: ${billingData.address1}`);

    // STEP 12.10: Fill Address Line 2 (optional)
    await page.locator('#BillingNewAddress_Address2').fill(billingData.address2);
    await expect(page.locator('#BillingNewAddress_Address2'))
        .toHaveValue(billingData.address2);
    console.log(`Address 2 filled: ${billingData.address2}`);

    // STEP 12.11: Fill Zip / Postal Code
    await page.locator('#BillingNewAddress_ZipPostalCode').fill(billingData.zipCode);
    await expect(page.locator('#BillingNewAddress_ZipPostalCode'))
        .toHaveValue(billingData.zipCode);
    console.log(`Zip code filled: ${billingData.zipCode}`);

    // STEP 12.12: Fill Phone Number
    await page.locator('#BillingNewAddress_PhoneNumber').fill(billingData.phoneNumber);
    await expect(page.locator('#BillingNewAddress_PhoneNumber'))
        .toHaveValue(billingData.phoneNumber);
    console.log(`Phone number filled: ${billingData.phoneNumber}`);

    // STEP 12.13: Fill Fax Number (optional)
    await page.locator('#BillingNewAddress_FaxNumber').fill(billingData.faxNumber);
    await expect(page.locator('#BillingNewAddress_FaxNumber'))
        .toHaveValue(billingData.faxNumber);
    console.log(`Fax number filled: ${billingData.faxNumber}`);

    // STEP 12.14: Click Continue button to proceed to next step
    await page.locator('input[onclick="Billing.save()"]').click();
    await page.waitForLoadState('networkidle');
    console.log('Billing form submitted successfully');

    //Step 13: Continue with Shipping, Shipping Method, Payment Method, Payment Info and Confirm Order steps
    await page.locator('input[onclick="Shipping.save()"]').click();

    //step 14: Click Continue button on Shipping Method page
    await page.locator('input[onclick="ShippingMethod.save()"]').click();

    //step 15: Click Continue button on Payment Method page
    await page.locator('input[onclick="PaymentMethod.save()"]').click();

    //step 16: Click Continue button on Payment Info page
    await page.locator('input[onclick="PaymentInfo.save()"]').click();

    //step 17: Click Continue button on Confirm Order page
    await page.locator('input[onclick="ConfirmOrder.save()"]').click();

    //step 18: Verify order confirmation message
    await expect(page.locator('h1')).toContainText('Thank you');
    await expect(page.locator('strong:has-text("Your order has been successfully processed!")')).toHaveText('Your order has been successfully processed!'); //                          
   console.log('Order confirmed successfully');

    //step 19: Click Logout button
    await logout.click();
    console.log("Logout Successful");
   
});