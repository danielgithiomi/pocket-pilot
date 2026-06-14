# Pocket Pilot Privacy Policy

Effective date: June 14, 2026

Last updated: June 14, 2026

This Privacy Policy explains how Pocket Pilot, operated by Daniel Githiomi
("Pocket Pilot," "we," "us," or "our"), collects, uses, stores, shares, and
protects information when you use the Pocket Pilot website, web application,
mobile application when released, backend services, support channels, and any
related services that link to this Privacy Policy (collectively, the
"Services").

Pocket Pilot is a personal finance tracking application. It helps users manually
track accounts, balances, transactions, categories, bills, goals, preferences,
shared expenses, and related financial records. Pocket Pilot is not a bank,
broker, lender, payment processor, credit bureau, or financial adviser.

Important: Pocket Pilot does not currently connect to your bank, does not
collect your online banking username or password, and does not collect bank
account numbers, routing numbers, payment card numbers, Social Security numbers,
tax identification numbers, credit reports, or brokerage credentials.

If you do not agree with this Privacy Policy, please do not use the Services.

## Table of Contents

1. [Summary](#summary)
2. [Scope of This Policy](#scope-of-this-policy)
3. [Information We Collect](#information-we-collect)
4. [Information We Do Not Collect](#information-we-do-not-collect)
5. [How We Use Information](#how-we-use-information)
6. [AI, Voice Input, and Receipt Scanning](#ai-voice-input-and-receipt-scanning)
7. [How We Share Information](#how-we-share-information)
8. [Cookies, Local Storage, and Similar Technologies](#cookies-local-storage-and-similar-technologies)
9. [Data Retention](#data-retention)
10. [Security](#security)
11. [Your Choices and Privacy Rights](#your-choices-and-privacy-rights)
12. [Regional Privacy Disclosures](#regional-privacy-disclosures)
13. [Children's Privacy](#childrens-privacy)
14. [International Data Transfers](#international-data-transfers)
15. [Third-Party Links and Services](#third-party-links-and-services)
16. [Changes to This Policy](#changes-to-this-policy)
17. [Contact Us](#contact-us)

## Summary

This summary is provided for convenience. Please read the full Privacy Policy
for complete details.

- We collect account registration information such as your name, email address,
  password hash, optional phone number, and optional profile picture.
- We collect the financial tracking data you choose to enter, such as account
  names, account types, currencies, balances, transactions, categories, bills,
  goals, and Splitr shared expense records.
- We do not collect personal banking login credentials, bank account numbers,
  routing numbers, payment card numbers, credit reports, or Social Security
  numbers.
- We use cookies and similar storage for authentication, session management,
  security, and application functionality.
- We use Redis caching to improve application performance and PostgreSQL to
  store application data.
- We use AWS S3 features for user-uploaded profile pictures and may use AWS or
  similar cloud services for future receipt-scanning features.
- We may introduce AI features that process user-approved voice input,
  transcripts, receipt images, OCR text, and transaction details to help log
  transactions and calculate financial entries. These AI features are designed
  to assist the user, not to collect unnecessary personal information.
- We do not sell your personal information or financial tracking data.
- We do not use financial tracking data for third-party advertising.
- You may request access, correction, deletion, export, or other rights
  available under applicable law by contacting us.

## Scope of This Policy

This Privacy Policy applies to Pocket Pilot Services that link to or reference
this Privacy Policy, including:

- The Pocket Pilot web application.
- The Pocket Pilot API and backend services.
- The planned Pocket Pilot mobile application.
- Support, feedback, feature request, and account communication channels.
- Future AI-powered voice input and receipt scanning features.

This Privacy Policy does not apply to third-party websites, services, operating
systems, app stores, financial institutions, or cloud providers that have their
own privacy policies.

## Information We Collect

We collect information in the following categories.

### 1. Account and Identity Information

When you create or use a Pocket Pilot account, we may collect:

- Name.
- Email address.
- Password, stored as a hashed password rather than plain text.
- Optional phone number.
- Profile picture upload key and signed profile picture URL.
- Account creation and update timestamps.
- Login-related security information, such as failed login attempts, last login
  time, and account lock status.
- Authentication cookies or tokens used to keep you signed in.

### 2. Financial Tracking Information You Provide

Pocket Pilot stores the finance tracking records you choose to create, update,
or delete inside the Services. This may include:

- Account names, account types, currencies, balances, and account visibility
  preferences.
- Income, expense, and transfer transactions.
- Transaction amounts, dates, categories, source accounts, target accounts, and
  optional descriptions.
- Custom income and expense categories.
- Bills, including bill names, amounts, currencies, due dates, and bill types.
- Financial goals, including goal names, descriptions, categories, statuses,
  target amounts, current amounts, monthly contributions, currencies, start
  dates, and end dates.
- User preferences, including default currency, preferred language, monthly
  spending limit, and application theme.

This information may reveal sensitive details about your personal finances
because it describes your spending, income, goals, and financial habits. We use
it only as described in this Privacy Policy.

### 3. Splitr Shared Expense Information

If you use Splitr, we may collect:

- Squad names.
- Squad image keys, if you upload squad images.
- Squad member names.
- Shared event names, dates, members, billing currencies, verification totals,
  settlement status, and settlement timestamps.
- Splittable items, quantities, unit prices, totals, and split strategies.
- Bill payer names and payer amounts.
- Quantity split records, including consumer names and quantities.

Splitr data may include names or labels of other people that you enter. You are
responsible for ensuring that you have the right to enter information about
other people into the Services.

### 4. Feature Requests, Feedback, Votes, and Comments

If you submit feedback or participate in feature request areas of the Services,
we may collect:

- Feature titles and feature descriptions.
- Feature category and status.
- Votes, vote variants, vote counts, and feature scores.
- Comments submitted on feature requests.
- The user account associated with the submitted feature, vote, or comment.

Some feedback or feature content may be visible to other users if we provide a
public or community feature request area. Please do not submit sensitive
personal information in feature requests, votes, or comments.

### 5. Profile Pictures and Uploaded Files

Pocket Pilot currently supports profile picture uploads. For profile pictures,
we may process:

- File type.
- File size.
- File name or generated storage key.
- Image content selected by you.
- Upload and retrieval metadata.

Current profile picture upload validation permits common image types such as
PNG, JPEG, JPG, and WEBP, subject to size limits.

### 6. Future Voice Input Information

When voice input features are introduced, and only when you choose to use them,
we may process:

- Audio recordings or audio streams captured through your device microphone.
- Transcripts generated from your voice input.
- Transaction-related details spoken by you, such as amount, merchant, date,
  account, category, currency, and description.
- AI prompts, AI outputs, parsing results, confidence scores, and processing
  metadata needed to create transaction suggestions or entries.

Voice input will be designed to help you log transactions quickly. You should
avoid speaking sensitive information that is not needed to create a transaction,
such as bank login credentials, payment card numbers, government identifiers,
or private information about another person.

### 7. Future Receipt Scanning and OCR Information

When receipt scanning features are introduced, and only when you choose to use
them, we may process:

- Receipt images captured with your camera or uploaded from your device.
- Image metadata, which may include timestamps, device metadata, orientation,
  and other metadata embedded in the file.
- OCR text extracted from the receipt.
- Merchant names, purchased items, dates, totals, taxes, tips, currencies, and
  other receipt details.
- AI prompts, AI outputs, parsing results, confidence scores, and processing
  metadata needed to create transaction suggestions or entries.

Receipt images may contain personal information depending on what appears on
the receipt. You should review receipts before uploading and avoid uploading
receipts containing information you do not want processed.

### 8. Technical, Usage, and Security Information

When you use the Services, we may collect technical and security information,
including:

- IP address.
- Browser type and version.
- Device type and operating system.
- Request URLs, timestamps, status codes, and request identifiers.
- Error logs, diagnostic logs, and performance information.
- Cookie and session metadata.
- Information needed to prevent fraud, detect abuse, investigate security
  events, and maintain service reliability.

### 9. Communications and Support Information

If you contact us, request support, report bugs, or communicate with us through
email or support channels, we may collect:

- Your name and contact information.
- Your message content.
- Attachments or screenshots you choose to send.
- Information needed to investigate your request.

## Information We Do Not Collect

Pocket Pilot is intentionally designed as a manual finance tracking tool. Unless
we update this Privacy Policy and obtain any legally required consent, we do not
collect:

- Online banking usernames or passwords.
- Bank account numbers.
- Bank routing numbers.
- Payment card numbers or card security codes.
- Social Security numbers or tax identification numbers.
- Credit reports or credit scores.
- Brokerage login credentials.
- Data directly imported from banks or financial institutions.
- Precise location data for transaction logging.
- Biometric identifiers for identity verification.
- Personal information for sale to data brokers.

If Pocket Pilot later adds bank aggregation, payment processing, precise
location, biometric, or similar features, we will update this Privacy Policy and
provide any required notices or consent flows before collecting that information.

## How We Use Information

We use information for the following purposes:

### 1. Provide and Operate the Services

We use information to:

- Create and manage user accounts.
- Authenticate users and maintain sessions.
- Display accounts, balances, transactions, categories, bills, goals,
  preferences, Splitr records, and feature request activity.
- Calculate balances, totals, split amounts, and goal progress.
- Save user preferences and interface settings.
- Generate API responses and maintain backend functionality.

### 2. Improve and Maintain the Services

We use information to:

- Debug errors.
- Improve application performance.
- Test and improve features.
- Understand which parts of the Services are working or need improvement.
- Develop new features, including planned mobile, AI voice, and receipt scanning
  functionality.

### 3. Security and Fraud Prevention

We use information to:

- Protect user accounts.
- Detect unauthorized access.
- Enforce login protections and account lock rules.
- Investigate abuse, suspicious activity, and security incidents.
- Maintain audit, request, and error logs needed to secure the Services.

### 4. User Support and Communications

We use information to:

- Respond to support requests.
- Send account-related messages.
- Notify users about important service changes.
- Provide policy, security, or administrative notices.

### 5. Legal Compliance and Enforcement

We may use information to:

- Comply with applicable laws, regulations, legal processes, or governmental
  requests.
- Enforce our terms, policies, and rights.
- Protect the rights, privacy, safety, and property of Pocket Pilot, users, and
  others.

## AI, Voice Input, and Receipt Scanning

Pocket Pilot may introduce AI-powered features to make transaction entry faster
and easier. These features are intended to assist users with data entry,
calculation, categorization, and receipt parsing. They are not intended to make
credit, lending, insurance, employment, housing, legal, or similarly significant
decisions about users.

### Current AI Status

AI voice input and receipt scanning are planned features and may not yet be
available in the Services. This section explains how we expect to handle those
features once introduced.

### AI Voice Transaction Logging

When you choose to use voice input, AI may process your voice input or a
transcript of it to identify transaction details such as:

- Transaction amount.
- Transaction type.
- Merchant or payee.
- Date.
- Category.
- Account.
- Currency.
- Description.

The AI may then create a transaction suggestion or transaction entry in Pocket
Pilot. Where practical, the feature will be designed so you can review, edit, or
confirm AI-generated transaction details.

### AI Receipt Scanning

When you choose to scan or upload a receipt, AI, OCR, or cloud processing
services may process the receipt image to identify:

- Merchant name.
- Receipt date.
- Items.
- Quantity.
- Price.
- Tax.
- Tip.
- Total.
- Currency.
- Category suggestions.

The AI may then create a transaction suggestion or transaction entry in Pocket
Pilot. Where practical, the feature will be designed so you can review, edit, or
confirm AI-generated transaction details.

### AI Data Minimization

Pocket Pilot will design AI features to process only the information reasonably
needed to perform the requested transaction logging or receipt parsing task. AI
features are not intended to collect unnecessary personal information.

You should not provide bank login credentials, payment card numbers, Social
Security numbers, government identifiers, or unrelated sensitive personal
information in voice input, receipt uploads, or AI prompts.

### AI Model Training

We will not intentionally use your personal financial tracking data, voice
input, receipt images, OCR text, or transaction history to train our own
general-purpose AI models.

When we use third-party AI, speech-to-text, OCR, or cloud processing providers,
we will select and configure provider settings, contracts, or API terms designed
to restrict those providers from using your content to train their general
models unless you opt in or unless we update this Privacy Policy and obtain any
consent required by law.

### AI Service Providers

AI features may require us to share limited user-provided content with service
providers that help perform speech recognition, text extraction, receipt
analysis, transaction parsing, categorization, or calculation. These providers
are expected to process information only to provide services to Pocket Pilot
and according to applicable contractual and legal obligations.

### No Significant Automated Decisions

Pocket Pilot does not use AI to make automated decisions that produce legal or
similarly significant effects about you. AI output may be imperfect. You remain
responsible for reviewing the accuracy of AI-generated transaction entries,
categories, calculations, and receipt results.

## How We Share Information

We do not sell your personal information or financial tracking data.

We may share information in the following limited circumstances.

### 1. Service Providers

We may share information with vendors, contractors, and service providers who
help us operate the Services, such as:

- Hosting and infrastructure providers.
- Database, cache, and storage providers.
- AWS S3 or similar cloud storage providers.
- AI, OCR, speech-to-text, and receipt processing providers, once those
  features are introduced.
- Logging, monitoring, security, and error tracking providers.
- Email, support, and communication providers.
- Analytics providers, if introduced.

Service providers are authorized to process information only as needed to
provide services to Pocket Pilot, subject to applicable contractual and legal
requirements.

### 2. User-Directed Sharing

We may share or display information at your direction, such as:

- Splitr records involving member names, payer names, shared event details, and
  settlement information.
- Feature requests, votes, or comments that you submit to a public or community
  feature area, if such a feature is made available.
- Information you choose to send through support channels.

### 3. Legal, Safety, and Security Purposes

We may disclose information if we believe disclosure is reasonably necessary to:

- Comply with applicable law, regulation, court order, subpoena, legal process,
  or governmental request.
- Enforce our terms, agreements, or policies.
- Protect the rights, property, or safety of Pocket Pilot, users, or others.
- Detect, prevent, or investigate fraud, abuse, security incidents, or technical
  issues.

### 4. Business Transfers

If Pocket Pilot is involved in a merger, acquisition, financing, reorganization,
bankruptcy, sale of assets, or similar business transaction, information may be
transferred as part of that transaction. We will take reasonable steps to ensure
that the recipient handles personal information consistently with this Privacy
Policy or provides appropriate notice of any material changes.

### 5. Aggregated or De-Identified Information

We may use and share aggregated or de-identified information that cannot
reasonably identify you. For example, we may use aggregated information to
understand feature usage, improve performance, or plan future functionality.

## Cookies, Local Storage, and Similar Technologies

Pocket Pilot uses cookies, local storage, and similar technologies to operate
the Services.

### Authentication Cookies

The backend uses authentication cookies to store access and refresh tokens. The
application is designed to set these cookies as HTTP-only and secure cookies
where supported.

### Local Storage

The web application may use local storage to store session-related user data and
onboarding state so the app can restore your session and route you correctly.

### Functional and Security Uses

We use cookies and similar technologies to:

- Keep you signed in.
- Protect your account.
- Manage onboarding and application state.
- Remember user preferences.
- Diagnose and fix errors.
- Maintain service reliability and security.

### Analytics and Advertising

Pocket Pilot does not currently use financial tracking data for third-party
advertising. If we introduce analytics or advertising technologies in the
future, we will update this Privacy Policy as required and provide any choices
required by law.

Most browsers allow you to control cookies through browser settings. Blocking
cookies may prevent authentication or other parts of the Services from working
properly.

## Data Retention

We retain information for as long as reasonably necessary to provide the
Services, comply with legal obligations, resolve disputes, enforce agreements,
maintain security, and support legitimate business purposes.

Retention periods vary depending on the type of information:

- Account information is generally retained while your account is active.
- Financial tracking records are generally retained until you delete them, close
  your account, or request deletion, subject to legal, backup, security, or
  operational requirements.
- Authentication cookies and tokens are retained for their configured lifespan.
- Redis cache entries are temporary and used to improve performance.
- Profile pictures are retained while associated with your account unless
  deleted or replaced.
- Support communications may be retained as needed to respond to requests,
  maintain records, and improve support.
- AI voice recordings, transcripts, receipt images, OCR text, prompts, and
  outputs, once those features are introduced, will be retained only as long as
  reasonably necessary to provide the requested feature unless you choose to save
  the related receipt, transaction, or attachment in your account.
- Backup copies may remain for a limited period after deletion before they are
  overwritten or securely deleted.

When information is no longer needed, we will delete, de-identify, aggregate, or
securely retain it as required or permitted by applicable law.

## Security

We use reasonable technical, administrative, and organizational safeguards
designed to protect personal information. These safeguards may include:

- Password hashing.
- Secure authentication cookies.
- Access controls.
- Server-side validation.
- Database access restrictions.
- Redis cache controls.
- Secure cloud storage practices.
- File type and size validation for supported uploads.
- Logging and monitoring for reliability and security.

No method of transmission over the internet or electronic storage is completely
secure. We cannot guarantee absolute security, but we work to protect your
information using safeguards appropriate to the nature of the information we
process.

You are responsible for maintaining the confidentiality of your account
credentials and for using a strong, unique password.

## Your Choices and Privacy Rights

Depending on where you live, you may have rights regarding your personal
information. These rights may include the right to:

- Access the personal information we hold about you.
- Correct inaccurate personal information.
- Delete personal information.
- Export or receive a copy of personal information in a portable format.
- Object to or restrict certain processing.
- Withdraw consent where processing is based on consent.
- Opt out of sale or sharing, where those terms are defined by applicable law.
- Limit use or disclosure of sensitive personal information where applicable.
- Appeal a decision we make about your privacy request, where applicable.

You can update certain account and finance tracking information directly in the
Services. To submit a privacy request, contact us using the details in
[Contact Us](#contact-us).

We may need to verify your identity before fulfilling a request. We will respond
to privacy requests in accordance with applicable law.

We will not discriminate against you for exercising privacy rights available
under applicable law.

## Regional Privacy Disclosures

### United States State Privacy Rights

Some U.S. state privacy laws provide residents with rights to know, access,
correct, delete, obtain a copy of, and opt out of certain processing of personal
information.

Pocket Pilot does not sell personal information and does not use personal
financial tracking data for cross-context behavioral advertising.

For purposes of applicable U.S. state privacy laws, the categories of personal
information we may collect include:

- Identifiers, such as name, email address, user ID, IP address, and optional
  phone number.
- Account login information, such as authentication credentials and security
  information.
- Internet or electronic network activity information, such as request logs,
  device/browser data, and app usage information.
- Commercial or financial tracking information that you manually enter, such as
  transactions, balances, categories, goals, and bills.
- User-generated content, such as feature requests, comments, support messages,
  Splitr names, and uploaded images.
- Inferences or calculations generated from your finance tracking data, such as
  totals, balances, split amounts, or category summaries.
- Sensitive personal information where applicable, such as account login
  credentials, precise financial tracking details, voice input, and receipt
  images when those optional features are used.

We use sensitive personal information only for purposes reasonably necessary to
provide the Services, maintain security, process user-directed features, or as
otherwise permitted by law. We do not use sensitive personal information to
infer characteristics for unrelated advertising.

### California Shine the Light

California residents may request information about certain disclosures of
personal information to third parties for their direct marketing purposes. We do
not disclose personal financial tracking data to third parties for their direct
marketing purposes.

### Nevada Residents

Nevada law allows residents to opt out of certain sales of covered information.
Pocket Pilot does not currently sell covered information as contemplated by
Nevada law.

### European Economic Area, United Kingdom, and Similar Regions

If you are located in a region with data protection laws such as the GDPR or UK
GDPR, our legal bases for processing personal information may include:

- Contract: to provide the Services you request.
- Consent: for optional features such as uploads, future voice input, future
  receipt scanning, or certain communications where consent is required.
- Legitimate interests: to secure, maintain, improve, and support the Services.
- Legal obligation: to comply with applicable laws and legal requests.

Subject to applicable law, you may have the right to access, rectify, erase,
restrict, object to processing, request portability, withdraw consent, and lodge
a complaint with a data protection authority.

## Children's Privacy

Pocket Pilot is not intended for children under 13 years old, and we do not
knowingly collect personal information from children under 13. If you believe a
child under 13 has provided personal information to us, please contact us and we
will take appropriate steps to delete the information.

If applicable law in your jurisdiction requires a higher minimum age for use of
online services, you may use the Services only if you meet that minimum age.

## International Data Transfers

Pocket Pilot may process and store information in countries other than the one
where you live. These countries may have data protection laws that differ from
your local laws.

Where required, we will use appropriate safeguards for international transfers,
such as contractual protections or other legally recognized mechanisms.

## Third-Party Links and Services

The Services may contain links to third-party websites or services. We are not
responsible for the privacy practices of those third parties. You should review
their privacy policies before providing information to them.

When future AI, OCR, speech-to-text, cloud storage, or other third-party
services are used to provide Pocket Pilot features, those providers may process
information on our behalf as service providers or processors.

## Changes to This Policy

We may update this Privacy Policy from time to time. The updated version will be
identified by an updated "Last updated" date.

If we make material changes, we will provide notice as required by applicable
law. Material changes may include new categories of personal information,
materially different uses of information, new AI features that materially change
data processing, or new sharing practices.

Your continued use of the Services after an updated Privacy Policy becomes
effective means you acknowledge the updated policy.

## Contact Us

If you have questions, requests, or concerns about this Privacy Policy or our
privacy practices, contact us at:

Pocket Pilot

Email: support@pocketpilot.com

GitHub: https://github.com/danielgithiomi

Website: https://danielgithiomi.com
