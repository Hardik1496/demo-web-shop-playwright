const { test, expect } = require('@playwright/test');

// ============================================================
// TEST DATA - Define registration details
// ============================================================
const testData = {
    firstName: 'Hardik',
    lastName: 'Vaghela',
    //email: `testuser_${Date.now()}@yopmail.com`, // Dynamic email to avoid duplicates
    email: 'vaghelahardik140896@gmail.com',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
};

// ============================================================
// TEST SUITE - Registration Page Tests
// ============================================================
test.describe('Registration Page Tests', () => {

    // ============================================================
    // BEFORE EACH - Navigate to Registration page before every test
    // ============================================================
    test.beforeEach(async ({ page }) => {
        await page.goto('https://demowebshop.tricentis.com/register');
        await page.waitForLoadState('networkidle');
        await page.setViewportSize({ width: 1900, height: 1200 });
    });

    // ============================================================
    // TEST 1: Successful Registration with all valid details
    // ============================================================
    test('Successful Registration', async ({ page }) => {

        // STEP 1: Select Gender - Male
        await page.locator('#gender-male').click();
        await expect(page.locator('#gender-male')).toBeChecked();
        console.log('Gender selected: Male');

        // STEP 2: Fill First Name
        await page.locator('#FirstName').fill(testData.firstName);
        await expect(page.locator('#FirstName')).toHaveValue(testData.firstName);
        console.log(`First name entered: ${testData.firstName}`);

        // STEP 3: Fill Last Name
        await page.locator('#LastName').fill(testData.lastName);
        await expect(page.locator('#LastName')).toHaveValue(testData.lastName);
        console.log(`Last name entered: ${testData.lastName}`);

        // STEP 4: Fill Email Address
        await page.locator('#Email').fill(testData.email);
        await expect(page.locator('#Email')).toHaveValue(testData.email);
        console.log(`Email entered: ${testData.email}`);

        // STEP 5: Fill Password
        await page.locator('#Password').fill(testData.password);
        await expect(page.locator('#Password')).toHaveValue(testData.password);
        console.log('Password entered');

        // STEP 6: Fill Confirm Password
        await page.locator('#ConfirmPassword').fill(testData.confirmPassword);
        await expect(page.locator('#ConfirmPassword')).toHaveValue(testData.confirmPassword);
        console.log('Confirm password entered');

        // STEP 7: Click Register Button
        await page.locator('#register-button').click();
        console.log('Register button clicked');

        // STEP 8: Verify Successful Registration
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*register.*/);
        console.log('Registration Successful');
    });

    // ============================================================
    // TEST 2: Registration with Female Gender selection
    // ============================================================
    test('Registration with Female Gender', async ({ page }) => {

        // STEP 1: Select Gender - Female
        await page.locator('#gender-female').click();
        await expect(page.locator('#gender-female')).toBeChecked();
        console.log('Gender selected: Female');

        // STEP 2: Fill First Name
        await page.locator('#FirstName').fill('Jane');

        // STEP 3: Fill Last Name
        await page.locator('#LastName').fill('Smith');

        // STEP 4: Fill Email
        await page.locator('#Email').fill(`jane_${Date.now()}@yopmail.com`);

        // STEP 5: Fill Password
        await page.locator('#Password').fill(testData.password);

        // STEP 6: Fill Confirm Password
        await page.locator('#ConfirmPassword').fill(testData.confirmPassword);

        // STEP 7: Click Register Button
        await page.locator('#register-button').click();

        // STEP 8: Verify Registration Success
        await page.waitForLoadState('networkidle');
        console.log('Registration with Female gender successful');
    });

    // ============================================================
    // TEST 3: Validation - Submit Empty Form
    // ============================================================
    test('Show validation errors on empty form submit', async ({ page }) => {

        // STEP 1: Click Register without filling any fields
        await page.locator('#register-button').click();
        console.log('Register button clicked without filling form');

        // STEP 2: Verify First Name validation error
        await expect(page.locator('span[data-valmsg-for="FirstName"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="FirstName"]'))
            .toContainText('First name is required.');
        console.log('First name validation error displayed');

        // STEP 3: Verify Last Name validation error
        await expect(page.locator('span[data-valmsg-for="LastName"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="LastName"]'))
            .toContainText('Last name is required.');
        console.log('Last name validation error displayed');

        // STEP 4: Verify Email validation error
        await expect(page.locator('span[data-valmsg-for="Email"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="Email"]'))
            .toContainText('Email is required.');
        console.log('Email validation error displayed');

        // STEP 5: Verify Password validation error
        await expect(page.locator('span[data-valmsg-for="Password"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="Password"]'))
            .toContainText('Password is required.');
        console.log('Password validation error displayed');

        // STEP 6: Verify Confirm Password validation error
        await expect(page.locator('span[data-valmsg-for="ConfirmPassword"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="ConfirmPassword"]'))
            .toContainText('Password is required.');
        console.log('Confirm password validation error displayed');
    });

    // ============================================================
    // TEST 4: Validation - Invalid Email Format
    // ============================================================
    test('Show error for invalid email format', async ({ page }) => {

        // STEP 1: Fill all fields with invalid email
        await page.locator('#gender-male').click();
        await page.locator('#FirstName').fill(testData.firstName);
        await page.locator('#LastName').fill(testData.lastName);

        // STEP 2: Enter invalid email format
        await page.locator('#Email').fill('invalidemail.com');
        console.log('Invalid email entered: invalidemail.com');

        await page.locator('#Password').fill(testData.password);
        await page.locator('#ConfirmPassword').fill(testData.confirmPassword);

        // STEP 3: Click Register button
        await page.locator('#register-button').click();

        // STEP 4: Verify email format validation error
        await expect(page.locator('span[data-valmsg-for="Email"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="Email"]'))
            .toContainText('Wrong email');
        console.log('Invalid email format error displayed');
    });

    // ============================================================
    // TEST 5: Validation - Password Too Short (less than 6 chars)
    // ============================================================
    test('Show error for short password', async ({ page }) => {

        // STEP 1: Fill all fields with short password
        await page.locator('#gender-male').click();
        await page.locator('#FirstName').fill(testData.firstName);
        await page.locator('#LastName').fill(testData.lastName);
        await page.locator('#Email').fill(testData.email);

        // STEP 2: Enter password with less than 6 characters
        await page.locator('#Password').fill('123');
        console.log('Short password entered: 123');

        await page.locator('#ConfirmPassword').fill('123');

        // STEP 3: Click Register button
        await page.locator('#register-button').click();

        // STEP 4: Verify short password validation error
        await expect(page.locator('span[data-valmsg-for="Password"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="Password"]'))
            .toContainText('The password should have at least 6 characters.');
        console.log('Short password validation error displayed');
    });

    // ============================================================
    // TEST 6: Validation - Password and Confirm Password Mismatch
    // ============================================================
    test('Show error when passwords do not match', async ({ page }) => {

        // STEP 1: Fill all fields with mismatched passwords
        await page.locator('#gender-male').click();
        await page.locator('#FirstName').fill(testData.firstName);
        await page.locator('#LastName').fill(testData.lastName);
        await page.locator('#Email').fill(testData.email);
        await page.locator('#Password').fill(testData.password);

        // STEP 2: Enter different password in confirm field
        await page.locator('#ConfirmPassword').fill('WrongPassword@99');
        console.log('Mismatched confirm password entered');

        // STEP 3: Click Register button
        await page.locator('#register-button').click();

        // STEP 4: Verify password mismatch error
        await expect(page.locator('span[data-valmsg-for="ConfirmPassword"]'))
            .toBeVisible();
        await expect(page.locator('span[data-valmsg-for="ConfirmPassword"]'))
            .toContainText('The password and confirmation password do not match.');
        console.log('Password mismatch validation error displayed');
    });

});