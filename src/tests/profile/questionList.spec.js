describe("The questions list on the profile page for @yuchenglin3", () => {
  before(() => {
    const socialLoginOptions = {
      username: "llamatester123",
      password: "basToCToREBR123!",
      loginSelector: 'button[href="/auth/google"]',
      loginUrl: "localhost:3000/#login",
      postLoginSelector: "#__next",
      getAllBrowserCookies: true,
    };

    cy.clearCookies();
    cy.task("GoogleSocialLogin", socialLoginOptions).then((result) => {
      const { cookies } = result;
      cy.log(result);
      cy.log("cookies");
      cy.log(cookies);
      const cookie = cookies.filter((cookie) => cookie.name === "atk").pop();
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        });

        Cypress.Cookies.defaults({
          whitelist: "atk",
        });
      }
    });
  });

  it("loads the profile page and logs in", () => {
    const questionTitle = `Test Title - ${new Date().toISOString()}`;
    const questionText = "Test Text";
    cy.log("Starting test");
    cy.visit("/profile/@yuchenglin3");
    cy.findByTestId("header-balance-tag");
    cy.findByText("Ask a question").click();
    cy.findByLabelText(/title/i).type(questionTitle);
    cy.findByPlaceholderText(/details/).type(questionText);
    cy.findByText("Submit").click();
    cy.findByTestId("header-balance-tag");
    cy.findByText(questionTitle).closest("a").as("question");
    cy.get("@question").findByTestId("question-like-icon").as("heartButton");
    cy.get("@heartButton").should("have.text", "0");
    cy.get("@heartButton").click();
    cy.get("@heartButton").should("have.text", "1");
    cy.reload();
    cy.findByTestId("header-balance-tag");
    cy.findByText(questionTitle).closest("a").as("question");
    cy.get("@question").findByTestId("question-like-icon").as("heartButton");
    cy.get("@heartButton").should("have.text", "1");
    cy.get("@heartButton").click();
    cy.get("@heartButton").should("have.text", "0");
    cy.get("@question").findByTestId("question-more-icon").click();
    cy.findByText("Edit Post").click();
    cy.findByText("Delete").click();
    cy.findByRole("alertdialog").findByText("Delete").click();
    cy.findByText(questionTitle).should("not.be.visible");
  });
});
