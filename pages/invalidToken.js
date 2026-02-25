export default `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Verified</title>

        <style>
            *,
            *::after,
            *::before {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            a {
                text-decoration: none;
                color: inherit;
            }

            .wrapper {
                min-height: 100vh;
                background-color: #fefefe;
                font-family: "Arial Narrow", Arial, sans-serif;
            }

            .container {
                max-width: 1024px;
                margin-inline: auto;
                padding: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: inherit;
            }

            .typography1 {
                color: rgba(0, 0, 0, 0.7);
                text-align: center;
            }

            .card {
                box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
                    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
                padding-bottom: 24px;
                cursor: default;
            }

            .card-content {
                padding: 24px;
            }

            .card {
                max-width: 600px;
            }

            .orange-button {
                background-color: #f7b10d;
                padding: 16px;
                color: white;
                border-radius: 5px;
                outline: none;
                border: none;
                font-size: 15px;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="card">
                    <div class="image">
                        <img
                            src="${process.env.SERVER_URL}/static/email.png"
                            alt="email verified"
                            style="width: 100%"
                        />
                    </div>
                    <div class="card-content">
                        <div class="typography1" style="font-size: 35px; color: #f00">Invalid Link</div>
                        <p style="font-size: 14px; padding-block: 8px" class="typography1">
                            The link you are trying to access is not valid
                            <br />
                            Please use the button below to login to your account.
                        </p>
                    </div>
                    <div style="text-align: center">
                        <a href="${process.env.DASHBOARD_URL}">
                            <button type="button" class="orange-button">
                                Login To Your Account
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
