describe('The questions list on the profile page for @yuchenglin3', () => {
    it('loads the profile page and logs in', () => {
        const socialLoginOptions = {
            username: 'llamatester123',
            password: 'basToCToREBR123!',
            loginSelector: 'button[href="/auth/google"]',
            loginUrl: 'localhost:3000/#login',
            postLoginSelector: '#__next',
            getAllBrowserCookies: true,
        }

        const questionTitle = `Test Title - ${new Date().toISOString()}`;
        const questionText = 'Test Text';

        cy.clearCookies();
        cy.task('GoogleSocialLogin', socialLoginOptions)
            .then((result)=> {
                const { cookies } = result;
                cy.log(result);
                cy.log("cookies");
                cy.log(cookies); 
                const cookie = cookies.filter(cookie => cookie.name === 'atk').pop()
                if (cookie) {
                    cy.setCookie(cookie.name, cookie.value, {
                        domain: cookie.domain,
                        expiry: cookie.expires,
                        httpOnly: cookie.httpOnly,
                        path: cookie.path,
                        secure: cookie.secure
                    })

                    Cypress.Cookies.defaults({
                        whitelist: 'atk'
                    })
                }
            })
        cy.visit('/profile/@yuchenglin3');
        cy.findByText('Ask a question').click();
        cy.findByLabelText(/title/i).type(questionTitle);
        cy.findByPlaceholderText(/details/).type(questionText);
        cy.findByText('Submit').click();
        let question = cy.findByText(questionTitle).closest('a');
        let heartButton = question.findByTestId('question-like-icon');
        heartButton.should('have.text', '0');
        heartButton.click();
        heartButton.should('have.text', '1');
        cy.reload();
        question = cy.findByText(questionTitle).closest('a');
        heartButton = question.findByTestId('question-like-icon');
        heartButton.should('have.text', '1');
        cy.findByText(questionTitle).closest('a').findByTestId('question-more-icon').click();
        cy.findByText('Edit Post').click();
        cy.findByText('Delete').click();
        cy.findByRole('alertdialog').findByText('Delete').click();
        cy.findByText(questionTitle).should('not.be.visible');
    });

});