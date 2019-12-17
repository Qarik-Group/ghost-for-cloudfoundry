const settingsCache = require('../settings/cache');
const MembersApi = require('@tryghost/members-api');
const common = require('../../lib/common');
const mail = require('../mail');
const models = require('../../models');
const signinEmail = require('./emails/signin');
const signupEmail = require('./emails/signup');
const subscribeEmail = require('./emails/subscribe');
const config = require('./config');

async function setMetadata(module, metadata) {
    if (module !== 'stripe') {
        return;
    }

    if (metadata.customer) {
        await models.MemberStripeCustomer.upsert(metadata.customer, {
            customer_id: metadata.customer.customer_id
        });
    }

    if (metadata.subscription) {
        await models.StripeCustomerSubscription.upsert(metadata.subscription, {
            subscription_id: metadata.subscription.subscription_id
        });
    }

    return;
}

async function getMetadata(module, member) {
    if (module !== 'stripe') {
        return;
    }

    const customers = (await models.MemberStripeCustomer.findAll({
        filter: `member_id:${member.id}`
    })).toJSON();

    const subscriptions = await customers.reduce(async (subscriptionsPromise, customer) => {
        const customerSubscriptions = await models.StripeCustomerSubscription.findAll({
            filter: `customer_id:${customer.customer_id}`
        });
        return (await subscriptionsPromise).concat(customerSubscriptions.toJSON());
    }, []);

    return {
        customers: customers,
        subscriptions: subscriptions
    };
}

const ghostMailer = new mail.GhostMailer();

module.exports = createApiInstance;

function createApiInstance() {
    const membersApiInstance = MembersApi({
        tokenConfig: config.getTokenConfig(),
        auth: {
            getSigninURL: config.getSigninURL,
            allowSelfSignup: config.getAllowSelfSignup(),
            secret: config.getAuthSecret()
        },
        mail: {
            transporter: {
                sendMail(message) {
                    if (process.env.NODE_ENV !== 'production') {
                        common.logging.warn(message.text);
                    }
                    let msg = Object.assign({
                        from: config.getEmailFromAddress(),
                        subject: 'Signin',
                        forceTextContent: true
                    }, message);

                    return ghostMailer.send(msg);
                }
            },
            getSubject(type) {
                const siteTitle = settingsCache.get('title');
                switch (type) {
                case 'subscribe':
                    return `📫 Confirm your subscription to ${siteTitle}`;
                case 'signup':
                    return `🙌 Complete your sign up to ${siteTitle}!`;
                case 'signin':
                default:
                    return `🔑 Secure sign in link for ${siteTitle}`;
                }
            },
            getText(url, type, email) {
                const siteTitle = settingsCache.get('title');
                switch (type) {
                case 'subscribe':
                    return `
                        Hey there,

                        You're one tap away from subscribing to ${siteTitle} — please confirm your email address with this link:

                        ${url}

                        For your security, the link will expire in 10 minutes time.

                        All the best!
                        The team at ${siteTitle}

                        ---

                        Sent to ${email}
                        If you did not make this request, you can simply delete this message. You will not be subscribed.
                        `;
                case 'signup':
                    return `
                        Hey there!

                        Thanks for signing up for ${siteTitle} — use this link to complete the sign up process and be automatically signed in:

                        ${url}

                        For your security, the link will expire in 10 minutes time.

                        See you soon!
                        The team at ${siteTitle}

                        ---

                        Sent to ${email}
                        If you did not make this request, you can simply delete this message. You will not be signed up, and no account will be created for you.
                        `;
                case 'signin':
                default:
                    return `
                        Hey there,

                        Welcome back! Use this link to securely sign in to your ${siteTitle} account:

                        ${url}

                        For your security, the link will expire in 10 minutes time.

                        See you soon!
                        The team at ${siteTitle}

                        ---

                        Sent to ${email}
                        If you did not make this request, you can safely ignore this email.
                        `;
                }
            },
            getHTML(url, type, email) {
                const siteTitle = settingsCache.get('title');
                switch (type) {
                case 'subscribe':
                    return subscribeEmail({url, email, siteTitle});
                case 'signup':
                    return signupEmail({url, email, siteTitle});
                case 'signin':
                default:
                    return signinEmail({url, email, siteTitle});
                }
            }
        },
        paymentConfig: {
            stripe: config.getStripePaymentConfig()
        },
        setMetadata,
        getMetadata,
        memberModel: models.Member,
        logger: common.logging
    });

    return membersApiInstance;
}
