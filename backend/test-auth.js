async function runAuthTest() {
    const signupData = {
        fullName: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
    };

    console.log('--- SIGNUP TEST ---');
    try {
        const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });
        const signupJson = await signupRes.json();
        console.log('Signup Status:', signupRes.status);
        console.log('Signup Response:', signupJson);

        if (signupRes.status === 201) {
            console.log('\n--- LOGIN TEST ---');
            const loginRes = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: signupData.email,
                    password: signupData.password
                })
            });
            const loginJson = await loginRes.json();
            console.log('Login Status:', loginRes.status);
            console.log('Login Response:', loginJson);
        }
    } catch (err) {
        console.error('Auth Test Error:', err.message);
    }
}

runAuthTest();
