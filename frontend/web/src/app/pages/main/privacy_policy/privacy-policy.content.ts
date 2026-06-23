import { PrivacyPolicyContent } from './privacy-policy.types';

export const PRIVACY_POLICY_CONTENT: PrivacyPolicyContent = {
    title: 'Privacy Policy',
    lastUpdated: 'June 23rd, 2026',
    effectiveDate: 'June 23rd, 2026',
    intro: [
        'This Privacy Policy explains how Pocket Pilot, operated by Daniel Githiomi ("Pocket Pilot," "we," "us," or "our"), collects, uses, stores, shares, and protects information when you use the Pocket Pilot website, web application, mobile application when released, backend services, support channels, and any related services that link to this Privacy Policy (collectively, the "Services").',
        'Pocket Pilot is a personal finance tracking application. It helps users manually track accounts, balances, transactions, categories, bills, goals, preferences, shared expenses, and related financial records. Pocket Pilot is not a bank, broker, lender, payment processor, credit bureau, or financial adviser. AI-generated outputs, once introduced, are informational data-entry assistance only and do not constitute financial advice.'
    ],
    importantNotice:
        'Pocket Pilot does not currently connect to your bank, does not collect your online banking username or password, and does not collect bank account numbers, routing numbers, payment card numbers, Social Security numbers, tax identification numbers, credit reports, or brokerage credentials. User-entered financial tracking data is still sensitive and is treated with enhanced safeguards.',
    disagreementNotice: 'If you do not agree with this Privacy Policy, please do not use the services.',
    summaryBullets: [
        'We collect account registration information such as your name, email address, password hash, optional phone number, and optional profile picture.',
        'We collect the financial tracking data you choose to enter, such as account names, account types, currencies, balances, transactions, categories, bills, goals, and Splitr shared expense records.',
        'We do not collect personal banking login credentials, bank account numbers, routing numbers, payment card numbers, credit reports, or Social Security numbers.',
        'We use cookies and similar storage for authentication, session management, security, and application functionality.',
        'We currently use essential cookies only. If non-essential cookies or analytics are introduced, we will request consent where required by law.',
        'We use Redis caching to improve application performance and PostgreSQL to store application data. Redis-cached data is temporary and automatically expires after a short duration.',
        'We use AWS S3 features for user-uploaded profile pictures and may use AWS or similar cloud services for future receipt-scanning features.',
        'AI features are planned, disabled by default, and will require explicit opt-in consent before voice input, receipt images, OCR text, or AI prompts are processed.',
        'We do not sell or share your personal information or financial tracking data for cross-context behavioral advertising.',
        'We do not use financial tracking data for third-party advertising.',
        'You may request access, correction, deletion, export, or other rights available under applicable law by contacting us.'
    ],
    tableOfContents: [
        { number: 1, id: 'summary', title: 'Summary', shortTitle: 'Summary' },
        { number: 2, id: 'scope', title: 'Scope of This Policy', shortTitle: 'Scope' },
        { number: 3, id: 'information-we-collect', title: 'Information We Collect', shortTitle: 'Data We Collect' },
        {
            number: 4,
            id: 'information-we-do-not-collect',
            title: 'Information We Do Not Collect',
            shortTitle: "Data We Don't Collect"
        },
        { number: 5, id: 'how-we-use-information', title: 'How We Use Information', shortTitle: 'How We Use Data' },
        { number: 6, id: 'legal-basis', title: 'Legal Basis for Processing', shortTitle: 'Legal Basis' },
        { number: 7, id: 'ai-voice-receipt', title: 'AI, Voice Input, and Receipt Scanning', shortTitle: 'AI & Voice Input' },
        { number: 8, id: 'how-we-share-information', title: 'How We Share Information', shortTitle: 'How We Share' },
        {
            number: 9,
            id: 'cookies-storage',
            title: 'Cookies, Local Storage, and Similar Technologies',
            shortTitle: 'Cookies & Storage'
        },
        { number: 10, id: 'data-retention', title: 'Data Retention', shortTitle: 'Data Retention' },
        { number: 11, id: 'security', title: 'Security', shortTitle: 'Security' },
        { number: 12, id: 'breach-notification', title: 'Data Breach Notification', shortTitle: 'Breach Notice' },
        { number: 13, id: 'your-choices', title: 'Your Choices and Privacy Rights', shortTitle: 'Your Rights' },
        { number: 14, id: 'regional-disclosures', title: 'Regional Privacy Disclosures', shortTitle: 'Regional Disclosures' },
        { number: 15, id: 'childrens-privacy', title: "Children's Privacy", shortTitle: "Children's Privacy" },
        { number: 16, id: 'international-transfers', title: 'International Data Transfers', shortTitle: 'Intl. Transfers' },
        { number: 17, id: 'third-party-links', title: 'Third-Party Links and Services', shortTitle: 'Third-Party Links' },
        { number: 18, id: 'changes', title: 'Changes to This Policy', shortTitle: 'Policy Changes' },
        { number: 19, id: 'contact-us', title: 'Contact Us', shortTitle: 'Contact Us' }
    ],
    sections: [
        {
            id: 'summary',
            title: 'Summary',
            callout: {
                variant: 'info',
                title: 'Quick read',
                text: 'This summary is provided for convenience. Please read the full Privacy Policy for complete details.'
            },
            bullets: [
                'We collect account registration information such as your name, email address, password hash, optional phone number, and optional profile picture.',
                'We collect the financial tracking data you choose to enter, such as account names, account types, currencies, balances, transactions, categories, bills, goals, and Splitr shared expense records.',
                'We do not collect personal banking login credentials, bank account numbers, routing numbers, payment card numbers, credit reports, or Social Security numbers.',
                'We use cookies and similar storage for authentication, session management, security, and application functionality.',
                'We currently use essential cookies only. If non-essential cookies or analytics are introduced, we will request consent where required by law.',
                'We use Redis caching to improve application performance and PostgreSQL to store application data. Redis-cached data is temporary and automatically expires after a short duration.',
                'We use AWS S3 features for user-uploaded profile pictures and may use AWS or similar cloud services for future receipt-scanning features.',
                'AI features are planned, disabled by default, and will require explicit opt-in consent before voice input, receipt images, OCR text, or AI prompts are processed.',
                'We do not sell or share your personal information or financial tracking data for cross-context behavioral advertising.',
                'We do not use financial tracking data for third-party advertising.',
                'You may request access, correction, deletion, export, or other rights available under applicable law by contacting us.'
            ]
        },
        {
            id: 'scope',
            title: 'Scope of This Policy',
            paragraphs: [
                'This Privacy Policy applies to Pocket Pilot Services that link to or reference this Privacy Policy, including:'
            ],
            bullets: [
                'The Pocket Pilot web application.',
                'The Pocket Pilot API and backend services.',
                'The planned Pocket Pilot mobile application.',
                'Support, feedback, feature request, and account communication channels.',
                'Future AI-powered voice input and receipt scanning features.'
            ],
            subsections: [
                {
                    id: 'scope-exclusions',
                    title: 'What this policy does not cover',
                    paragraphs: [
                        'This Privacy Policy does not apply to third-party websites, services, operating systems, app stores, financial institutions, or cloud providers that have their own privacy policies.'
                    ]
                }
            ]
        },
        {
            id: 'information-we-collect',
            title: 'Information We Collect',
            paragraphs: ['We collect information in the following categories.'],
            subsections: [
                {
                    id: 'account-identity',
                    title: '1. Account and Identity Information',
                    paragraphs: ['When you create or use a Pocket Pilot account, we may collect:'],
                    bullets: [
                        'Name.',
                        'Email address.',
                        'Password, stored as a hashed password rather than plain text.',
                        'Optional phone number.',
                        'Profile picture upload key and signed profile picture URL.',
                        'Account creation and update timestamps.',
                        'Login-related security information, such as failed login attempts, last login time, and account lock status.',
                        'Authentication cookies or tokens used to keep you signed in.'
                    ]
                },
                {
                    id: 'financial-tracking',
                    title: '2. Financial Tracking Information You Provide',
                    paragraphs: [
                        'Pocket Pilot stores the finance tracking records you choose to create, update, or delete inside the Services. This may include:'
                    ],
                    bullets: [
                        'Account names, account types, currencies, balances, and account visibility preferences.',
                        'Income, expense, and transfer transactions.',
                        'Transaction amounts, dates, categories, source accounts, target accounts, and optional descriptions.',
                        'Custom income and expense categories.',
                        'Bills, including bill names, amounts, currencies, due dates, and bill types.',
                        'Financial goals, including goal names, descriptions, categories, statuses, target amounts, current amounts, monthly contributions, currencies, start dates, and end dates.',
                        'User preferences, including default currency, preferred language, monthly spending limit, and application theme.'
                    ],
                    closingParagraphs: [
                        'This information may reveal sensitive details about your personal finances because it describes your spending, income, goals, and financial habits. While Pocket Pilot does not connect to financial institutions, user-entered financial data is still sensitive and is treated with enhanced safeguards. We use it only as described in this Privacy Policy.'
                    ]
                },
                {
                    id: 'splitr',
                    title: '3. Splitr Shared Expense Information',
                    paragraphs: ['If you use Splitr, we may collect:'],
                    bullets: [
                        'Squad names.',
                        'Squad image keys, if you upload squad images.',
                        'Squad member names.',
                        'Shared event names, dates, members, billing currencies, verification totals, settlement status, and settlement timestamps.',
                        'Splittable items, quantities, unit prices, totals, and split strategies.',
                        'Bill payer names and payer amounts.',
                        'Quantity split records, including consumer names and quantities.'
                    ],
                    closingParagraphs: [
                        'Splitr data may include names or labels of other people that you enter. Where shared Splitr functionality is available, shared expense information is intended to be visible only to the account owner and explicitly authorized participants or recipients. You are responsible for ensuring that you have the right to enter information about other people into the Services.'
                    ]
                },
                {
                    id: 'feature-requests',
                    title: '4. Feature Requests, Feedback, Votes, and Comments',
                    paragraphs: [
                        'If you submit feedback or participate in feature request areas of the Services, we may collect:'
                    ],
                    bullets: [
                        'Feature titles and feature descriptions.',
                        'Feature category and status.',
                        'Votes, vote variants, vote counts, and feature scores.',
                        'Comments submitted on feature requests.',
                        'The user account associated with the submitted feature, vote, or comment.'
                    ],
                    closingParagraphs: [
                        'Some feedback or feature content may be visible to other users if we provide a public or community feature request area. Please do not submit sensitive personal information in feature requests, votes, or comments.'
                    ]
                },
                {
                    id: 'profile-uploads',
                    title: '5. Profile Pictures and Uploaded Files',
                    paragraphs: [
                        'Pocket Pilot currently supports profile picture uploads. For profile pictures, we may process:'
                    ],
                    bullets: [
                        'File type.',
                        'File size.',
                        'File name or generated storage key.',
                        'Image content selected by you.',
                        'Upload and retrieval metadata.'
                    ],
                    closingParagraphs: [
                        'Current profile picture upload validation permits common image types such as PNG, JPEG, JPG, and WEBP, subject to size limits.'
                    ]
                },
                {
                    id: 'voice-input',
                    title: '6. Future Voice Input Information',
                    paragraphs: [
                        'When voice input features are introduced, and only when you choose to use them, we may process:'
                    ],
                    bullets: [
                        'Audio recordings or audio streams captured through your device microphone.',
                        'Transcripts generated from your voice input.',
                        'Transaction-related details spoken by you, such as amount, merchant, date, account, category, currency, and description.',
                        'AI prompts, AI outputs, parsing results, confidence scores, and processing metadata needed to create transaction suggestions or entries.'
                    ],
                    closingParagraphs: [
                        'Voice input will be designed to help you log transactions quickly. You should avoid speaking sensitive information that is not needed to create a transaction, such as bank login credentials, payment card numbers, government identifiers, or private information about another person.'
                    ]
                },
                {
                    id: 'receipt-scanning',
                    title: '7. Future Receipt Scanning and OCR Information',
                    paragraphs: [
                        'When receipt scanning features are introduced, and only when you choose to use them, we may process:'
                    ],
                    bullets: [
                        'Receipt images captured with your camera or uploaded from your device.',
                        'Image metadata, which may include timestamps, device metadata, orientation, and other metadata embedded in the file.',
                        'OCR text extracted from the receipt.',
                        'Merchant names, purchased items, dates, totals, taxes, tips, currencies, and other receipt details.',
                        'AI prompts, AI outputs, parsing results, confidence scores, and processing metadata needed to create transaction suggestions or entries.'
                    ],
                    closingParagraphs: [
                        'Receipt images may contain personal information depending on what appears on the receipt, including merchant details, store addresses, loyalty identifiers, or partial payment card numbers. You should review receipts before uploading and avoid uploading receipts containing information you do not want processed. Where practical, Pocket Pilot will use filtering, extraction limits, or minimization techniques to avoid retaining receipt details that are not needed for transaction logging.'
                    ]
                },
                {
                    id: 'technical-usage',
                    title: '8. Technical, Usage, and Security Information',
                    paragraphs: ['When you use the Services, we may collect technical and security information, including:'],
                    bullets: [
                        'IP address.',
                        'Browser type and version.',
                        'Device type and operating system.',
                        'Request URLs, timestamps, status codes, and request identifiers.',
                        'Error logs, diagnostic logs, and performance information.',
                        'Cookie and session metadata.',
                        'Information needed to prevent fraud, detect abuse, investigate security incidents, and maintain service reliability.'
                    ]
                },
                {
                    id: 'communications',
                    title: '9. Communications and Support Information',
                    paragraphs: [
                        'If you contact us, request support, report bugs, or communicate with us through email or support channels, we may collect:'
                    ],
                    bullets: [
                        'Your name and contact information.',
                        'Your message content.',
                        'Attachments or screenshots you choose to send.',
                        'Information needed to investigate your request.'
                    ]
                }
            ]
        },
        {
            id: 'information-we-do-not-collect',
            title: 'Information We Do Not Collect',
            paragraphs: [
                'Pocket Pilot is intentionally designed as a manual finance tracking tool. Unless we update this Privacy Policy and obtain any legally required consent, we do not collect:'
            ],
            bullets: [
                'Online banking usernames or passwords.',
                'Bank account numbers.',
                'Bank routing numbers.',
                'Payment card numbers or card security codes.',
                'Social Security numbers or tax identification numbers.',
                'Credit reports or credit scores.',
                'Brokerage login credentials.',
                'Data directly imported from banks or financial institutions.',
                'Precise location data for transaction logging.',
                'Biometric identifiers for identity verification.',
                'Personal information for sale to data brokers.'
            ],
            callout: {
                variant: 'accent',
                title: 'Future features',
                text: 'If Pocket Pilot later adds bank aggregation, payment processing, precise location, biometric, or similar features, we will update this Privacy Policy and provide any required notices or consent flows before collecting that information.'
            }
        },
        {
            id: 'how-we-use-information',
            title: 'How We Use Information',
            paragraphs: ['We use information for the following purposes.'],
            subsections: [
                {
                    id: 'provide-operate',
                    title: '1. Provide and Operate the Services',
                    paragraphs: ['We use information to:'],
                    bullets: [
                        'Create and manage user accounts.',
                        'Authenticate users and maintain sessions.',
                        'Display accounts, balances, transactions, categories, bills, goals, preferences, Splitr records, and feature request activity.',
                        'Calculate balances, totals, split amounts, and goal progress.',
                        'Save user preferences and interface settings.',
                        'Generate API responses and maintain backend functionality.'
                    ]
                },
                {
                    id: 'improve-maintain',
                    title: '2. Improve and Maintain the Services',
                    paragraphs: ['We use information to:'],
                    bullets: [
                        'Debug errors.',
                        'Improve application performance.',
                        'Test and improve features.',
                        'Understand which parts of the Services are working or need improvement.',
                        'Develop new features, including planned mobile, AI voice, and receipt scanning functionality.'
                    ]
                },
                {
                    id: 'security-fraud',
                    title: '3. Security and Fraud Prevention',
                    paragraphs: ['We use information to:'],
                    bullets: [
                        'Protect user accounts.',
                        'Detect unauthorized access.',
                        'Enforce login protections and account lock rules.',
                        'Investigate abuse, suspicious activity, and security incidents.',
                        'Maintain audit, request, and error logs needed to secure the Services.'
                    ]
                },
                {
                    id: 'user-support',
                    title: '4. User Support and Communications',
                    paragraphs: ['We use information to:'],
                    bullets: [
                        'Respond to support requests.',
                        'Send account-related messages.',
                        'Notify users about important service changes.',
                        'Provide policy, security, or administrative notices.'
                    ]
                },
                {
                    id: 'legal-compliance',
                    title: '5. Legal Compliance and Enforcement',
                    paragraphs: ['We may use information to:'],
                    bullets: [
                        'Comply with applicable laws, regulations, legal processes, or governmental requests.',
                        'Enforce our terms, policies, and rights.',
                        'Protect the rights, privacy, safety, and property of Pocket Pilot, users, and others.'
                    ]
                }
            ]
        },
        {
            id: 'legal-basis',
            title: 'Legal Basis for Processing',
            paragraphs: [
                'Where privacy laws such as the GDPR or UK GDPR apply, we rely on one or more lawful bases depending on the processing purpose. We identify and document these bases before processing personal data for a covered purpose.'
            ],
            table: {
                headers: ['Processing purpose', 'Legal basis', 'Examples'],
                rows: [
                    [
                        'Providing the Services',
                        'Contract',
                        'Creating accounts, authenticating users, saving finance records, calculating balances, and displaying dashboard data.'
                    ],
                    [
                        'Security, fraud prevention, reliability, and debugging',
                        'Legitimate interests',
                        'Protecting accounts, detecting abuse, maintaining logs, monitoring errors, and improving service performance.'
                    ],
                    [
                        'Optional uploads and future AI features',
                        'Consent',
                        'Profile picture uploads, future voice input, future receipt scanning, OCR processing, and AI-assisted transaction creation.'
                    ],
                    [
                        'Legal compliance and rights enforcement',
                        'Legal obligation or legitimate interests',
                        'Responding to lawful requests, enforcing policies, preserving records where required, and handling disputes.'
                    ],
                    [
                        'Account-related communications',
                        'Contract or legitimate interests',
                        'Sending security notices, policy updates, support responses, and important service messages.'
                    ]
                ]
            },
            closingParagraphs: [
                'AI-powered voice and receipt features are strictly opt-in. They will be disabled by default and activated only after explicit user consent for the relevant feature. You may withdraw consent where required by law, although withdrawal will not affect processing already completed before withdrawal.'
            ]
        },
        {
            id: 'ai-voice-receipt',
            title: 'AI, Voice Input, and Receipt Scanning',
            paragraphs: [
                'Pocket Pilot may introduce AI-powered features to make transaction entry faster and easier. These features are intended to assist users with data entry, calculation, categorization, and receipt parsing. They are not intended to make credit, lending, insurance, employment, housing, legal, or similarly significant decisions about users. AI-generated outputs are informational only and do not constitute financial advice.'
            ],
            subsections: [
                {
                    id: 'ai-current-status',
                    title: 'Current AI Status',
                    paragraphs: [
                        'AI voice input and receipt scanning are planned features and may not yet be available in the Services. This section explains how we expect to handle those features once introduced.',
                        'AI features will be disabled by default. Each AI feature will require explicit, granular opt-in consent before Pocket Pilot processes voice input, receipt images, OCR text, transcripts, prompts, or AI outputs for that feature.'
                    ]
                },
                {
                    id: 'ai-processing-details',
                    title: 'AI Processing Details',
                    paragraphs: [
                        'AI processing may occur in Pocket Pilot systems, through cloud infrastructure, or through trusted third-party AI, OCR, speech-to-text, or receipt-processing providers. The exact provider and processing location may depend on the feature, deployment environment, and production configuration.',
                        'Where a third-party provider is used, we will send only the content reasonably needed to perform the user-requested task, such as a voice transcript, receipt image, OCR text, transaction amount, merchant, date, category, and related parsing context.',
                        'AI input and output data will not be used to train external general-purpose models unless you opt in or unless we update this Privacy Policy and obtain any consent required by law.'
                    ]
                },
                {
                    id: 'ai-voice-logging',
                    title: 'AI Voice Transaction Logging',
                    paragraphs: [
                        'When you choose to use voice input and provide consent, AI may process your voice input or a transcript of it to identify transaction details such as:'
                    ],
                    bullets: [
                        'Transaction amount.',
                        'Transaction type.',
                        'Merchant or payee.',
                        'Date.',
                        'Category.',
                        'Account.',
                        'Currency.',
                        'Description.'
                    ],
                    closingParagraphs: [
                        'The AI may then create a transaction suggestion or transaction entry in Pocket Pilot. Where practical, the feature will be designed so you can review, edit, or confirm AI-generated transaction details before they are saved.'
                    ]
                },
                {
                    id: 'ai-receipt-scanning',
                    title: 'AI Receipt Scanning',
                    paragraphs: [
                        'When you choose to scan or upload a receipt and provide consent, AI, OCR, or cloud processing services may process the receipt image to identify:'
                    ],
                    bullets: [
                        'Merchant name.',
                        'Receipt date.',
                        'Items.',
                        'Quantity.',
                        'Price.',
                        'Tax.',
                        'Tip.',
                        'Total.',
                        'Currency.',
                        'Category suggestions.'
                    ],
                    closingParagraphs: [
                        'The AI may then create a transaction suggestion or transaction entry in Pocket Pilot. Where practical, the feature will be designed so you can review, edit, or confirm AI-generated transaction details before they are saved.'
                    ]
                },
                {
                    id: 'ai-data-minimization',
                    title: 'AI Data Minimization',
                    paragraphs: [
                        'Pocket Pilot will design AI features to process only the information reasonably needed to perform the requested transaction logging or receipt parsing task. AI features are not intended to collect unnecessary personal information.',
                        'You should not provide bank login credentials, payment card numbers, Social Security numbers, government identifiers, or unrelated sensitive personal information in voice input, receipt uploads, or AI prompts.'
                    ]
                },
                {
                    id: 'ai-model-training',
                    title: 'AI Model Training',
                    paragraphs: [
                        'We do not use your personal or financial data to train machine learning models. We will not intentionally use your personal financial tracking data, voice input, receipt images, OCR text, or transaction history to train our own general-purpose AI models.',
                        'When we use third-party AI, speech-to-text, OCR, or cloud processing providers, we will select and configure provider settings, contracts, or API terms designed to restrict those providers from using your content to train their general models unless you opt in or unless we update this Privacy Policy and obtain any consent required by law.'
                    ]
                },
                {
                    id: 'ai-service-providers',
                    title: 'AI Service Providers',
                    paragraphs: [
                        'AI features may require us to share limited user-provided content with service providers that help perform speech recognition, text extraction, receipt analysis, transaction parsing, categorization, or calculation. These providers are expected to process information only to provide services to Pocket Pilot and according to applicable contractual and legal obligations.'
                    ]
                },
                {
                    id: 'ai-no-automated-decisions',
                    title: 'No Significant Automated Decisions',
                    paragraphs: [
                        'Pocket Pilot does not use AI to make automated decisions that produce legal or similarly significant effects about you. AI output may be imperfect. You remain responsible for reviewing the accuracy of AI-generated transaction entries, categories, calculations, and receipt results. AI-generated summaries, calculations, or categorizations are provided for convenience and are not financial, investment, tax, legal, or accounting advice.'
                    ]
                }
            ]
        },
        {
            id: 'how-we-share-information',
            title: 'How We Share Information',
            paragraphs: [
                'We do not sell your personal information or financial tracking data.',
                'We do not share personal information or financial tracking data for cross-context behavioral advertising.',
                'We may share information in the following limited circumstances.'
            ],
            subsections: [
                {
                    id: 'share-service-providers',
                    title: '1. Service Providers',
                    paragraphs: [
                        'We may share information with trusted vendors, contractors, service providers, processors, and subprocessors who help us operate the Services, such as:'
                    ],
                    bullets: [
                        'Hosting and infrastructure providers.',
                        'Database, cache, and storage providers.',
                        'AWS S3 or similar cloud storage providers.',
                        'AI, OCR, speech-to-text, and receipt processing providers, once those features are introduced.',
                        'Logging, monitoring, security, and error tracking providers.',
                        'Email, support, and communication providers.',
                        'Analytics providers, if introduced.'
                    ],
                    closingParagraphs: [
                        'Service providers are authorized to process information only as needed to provide services to Pocket Pilot, subject to applicable contractual and legal requirements. Where required, we use data processing agreements or equivalent contractual protections with processors and subprocessors.',
                        'Production data may be stored or processed in cloud regions selected for the deployed environment, including AWS regions or equivalent hosting regions. We will maintain or publish a subprocessor list when production operations require one or when applicable law requires it.'
                    ]
                },
                {
                    id: 'share-user-directed',
                    title: '2. User-Directed Sharing',
                    paragraphs: ['We may share or display information at your direction, such as:'],
                    bullets: [
                        'Splitr records involving member names, payer names, shared event details, and settlement information.',
                        'Feature requests, votes, or comments that you submit to a public or community feature area, if such a feature is made available.',
                        'Information you choose to send through support channels.'
                    ]
                },
                {
                    id: 'share-legal-safety',
                    title: '3. Legal, Safety, and Security Purposes',
                    paragraphs: ['We may disclose information if we believe disclosure is reasonably necessary to:'],
                    bullets: [
                        'Comply with applicable law, regulation, court order, subpoena, legal process, or governmental request.',
                        'Enforce our terms, agreements, or policies.',
                        'Protect the rights, property, or safety of Pocket Pilot, users, or others.',
                        'Detect, prevent, or investigate fraud, abuse, security incidents, or technical issues.'
                    ]
                },
                {
                    id: 'share-business-transfers',
                    title: '4. Business Transfers',
                    paragraphs: [
                        'If Pocket Pilot is involved in a merger, acquisition, financing, reorganization, bankruptcy, sale of assets, or similar business transaction, information may be transferred as part of that transaction. We will take reasonable steps to ensure that the recipient handles personal information consistently with this Privacy Policy or provides appropriate notice of any material changes.'
                    ]
                },
                {
                    id: 'share-aggregated',
                    title: '5. Aggregated or De-Identified Information',
                    paragraphs: [
                        'We may use and share aggregated or de-identified information that cannot reasonably identify you. For example, we may use aggregated information to understand feature usage, improve performance, or plan future functionality.'
                    ]
                }
            ]
        },
        {
            id: 'cookies-storage',
            title: 'Cookies, Local Storage, and Similar Technologies',
            paragraphs: ['Pocket Pilot uses cookies, local storage, and similar technologies to operate the Services.'],
            subsections: [
                {
                    id: 'auth-cookies',
                    title: 'Authentication Cookies',
                    paragraphs: [
                        'The backend uses authentication cookies to store access and refresh tokens. Authentication cookies are secured using HttpOnly, Secure, and SameSite attributes where supported by the production environment.'
                    ]
                },
                {
                    id: 'cookie-classification',
                    title: 'Cookie and Storage Classification',
                    paragraphs: [
                        'Pocket Pilot currently uses essential cookies and storage needed to operate authentication, session management, security, preferences, and application state. We do not currently use non-essential advertising cookies.'
                    ],
                    table: {
                        headers: ['Type', 'Purpose', 'Consent approach'],
                        rows: [
                            [
                                'Essential',
                                'Authentication, session management, CSRF/security protections, routing, and account access.',
                                'Required to provide the Services and generally not optional.'
                            ],
                            [
                                'Functional',
                                'Remembering user preferences, onboarding state, display settings, and local app state.',
                                'Used to provide requested app functionality.'
                            ],
                            [
                                'Analytics',
                                'Usage insights, diagnostics, and product improvement if introduced later.',
                                'Not currently used for financial tracking data. Consent will be requested where required before non-essential analytics are enabled.'
                            ],
                            [
                                'Advertising or tracking',
                                'Cross-context behavioral advertising or third-party ad tracking.',
                                'Not currently used. Pocket Pilot does not use financial tracking data for third-party advertising.'
                            ]
                        ]
                    },
                    closingParagraphs: [
                        'If we introduce non-essential cookies, analytics, or similar tracking technologies in the future, we will request user consent where required by law and provide appropriate controls.'
                    ]
                },
                {
                    id: 'local-storage',
                    title: 'Local Storage',
                    paragraphs: [
                        'The web application may use local storage to store session-related user data and onboarding state so the app can restore your session and route you correctly.'
                    ]
                },
                {
                    id: 'redis-cache',
                    title: 'Redis Caching',
                    paragraphs: [
                        'Pocket Pilot uses Redis caching to improve performance for frequently requested application data. Redis-cached data may include temporary copies of account, category, Splitr, or similar application records.',
                        'Redis-cached data is temporary, automatically expires after a short configured duration, and is invalidated when relevant records change. Redis is not intended to be a long-term storage system for user data.'
                    ]
                },
                {
                    id: 'functional-security',
                    title: 'Functional and Security Uses',
                    paragraphs: ['We use cookies and similar technologies to:'],
                    bullets: [
                        'Keep you signed in.',
                        'Protect your account.',
                        'Manage onboarding and application state.',
                        'Remember user preferences.',
                        'Diagnose and fix errors.',
                        'Maintain service reliability and security.'
                    ]
                },
                {
                    id: 'analytics-advertising',
                    title: 'Analytics and Advertising',
                    paragraphs: [
                        'Pocket Pilot does not currently use financial tracking data for third-party advertising. If we introduce analytics or advertising technologies in the future, we will update this Privacy Policy as required and provide any choices required by law.',
                        'Most browsers allow you to control cookies through browser settings. Blocking cookies may prevent authentication or other parts of the Services from working properly.'
                    ]
                }
            ]
        },
        {
            id: 'data-retention',
            title: 'Data Retention',
            paragraphs: [
                'We retain information for as long as reasonably necessary to provide the Services, comply with legal obligations, resolve disputes, enforce agreements, maintain security, and support legitimate business purposes.',
                'Retention periods vary depending on the type of information:'
            ],
            table: {
                headers: ['Data type', 'Retention period', 'Deletion notes'],
                rows: [
                    [
                        'Account and identity data',
                        'While your account is active.',
                        'Deleted or de-identified after account deletion unless retention is required for security, legal, dispute, or backup purposes.'
                    ],
                    [
                        'Financial tracking records',
                        'Until you delete the record, close your account, or request deletion.',
                        'Includes accounts, balances, transactions, categories, bills, goals, preferences, and Splitr records.'
                    ],
                    [
                        'Authentication cookies and tokens',
                        'For their configured lifespan or until logout/session clearing.',
                        'Access and refresh tokens expire according to the authentication configuration.'
                    ],
                    [
                        'Redis cache entries',
                        'Short-lived temporary cache duration.',
                        'Automatically expires and is invalidated when relevant records change.'
                    ],
                    [
                        'Profile pictures and uploaded images',
                        'While associated with your account or relevant feature.',
                        'Deleted or replaced when you remove or update the image, subject to backup retention.'
                    ],
                    [
                        'Security, diagnostic, and application logs',
                        'Typically 30 to 90 days.',
                        'May be retained longer when needed to investigate abuse, security incidents, legal claims, or service reliability issues.'
                    ],
                    [
                        'Support communications',
                        'As long as needed to respond, maintain support records, and improve support.',
                        'May be retained longer where necessary for legal, security, or dispute purposes.'
                    ],
                    [
                        'Future AI voice and receipt processing data',
                        'Transient processing by default, generally deleted within 24 hours after processing unless saved by you as part of a transaction or receipt record.',
                        'Saved transaction records remain until deleted by you or your account is deleted.'
                    ],
                    [
                        'Backups',
                        'Disaster recovery backups are retained for a limited period, generally up to 90 days.',
                        'Deleted records may remain in backups until the backup naturally expires or is securely overwritten.'
                    ]
                ]
            },
            closingParagraphs: [
                'When information is no longer needed, we will delete, de-identify, aggregate, or securely retain it as required or permitted by applicable law.',
                'When you request deletion, we will take reasonable steps to delete applicable active account data within 30 days after verifying the request, unless a different period is required or permitted by law. Backup deletion follows the backup lifecycle described above.'
            ]
        },
        {
            id: 'security',
            title: 'Security',
            paragraphs: [
                'Financial tracking data is treated as sensitive, even though Pocket Pilot does not connect directly to financial institutions. We use reasonable technical, administrative, and organizational safeguards designed to protect personal information and user-entered financial tracking data. These safeguards may include:'
            ],
            bullets: [
                'Encryption in transit using TLS/HTTPS in production environments.',
                'Encryption at rest through production database, storage, and cloud infrastructure controls where supported by the deployed provider.',
                'Password hashing using a modern password hashing algorithm such as Argon2.',
                'Secure authentication cookies using HttpOnly, Secure, and SameSite attributes where supported.',
                'Access controls.',
                'Least-privilege operational access where practical.',
                'Server-side validation.',
                'Database access restrictions.',
                'Redis cache expiry and cache invalidation controls.',
                'Secure cloud storage practices.',
                'File type and size validation for supported uploads.',
                'Audit, diagnostic, and security logging for reliability and incident investigation.'
            ],
            callout: {
                variant: 'warning',
                title: 'Your responsibility',
                text: 'No method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security, but we work to protect your information using safeguards appropriate to the nature of the information we process. You are responsible for maintaining the confidentiality of your account credentials and for using a strong, unique password.'
            }
        },
        {
            id: 'breach-notification',
            title: 'Data Breach Notification',
            paragraphs: [
                'If we become aware of a data breach affecting personal information, we will investigate promptly and take steps to contain, remediate, and assess the incident.',
                'Where required by applicable law, we will notify affected users and relevant authorities within the required timeframe. For example, certain GDPR-style frameworks may require notice to a supervisory authority within 72 hours after becoming aware of a qualifying personal data breach.',
                'Our notice may include, as appropriate, the nature of the incident, the categories of information involved, steps we have taken, steps users can take to protect themselves, and contact information for follow-up questions.'
            ]
        },
        {
            id: 'your-choices',
            title: 'Your Choices and Privacy Rights',
            paragraphs: [
                'Depending on where you live, you may have rights regarding your personal information. These rights may include the right to:'
            ],
            bullets: [
                'Access the personal information we hold about you.',
                'Correct inaccurate personal information.',
                'Delete personal information.',
                'Export or receive a copy of personal information in a portable format.',
                'Object to or restrict certain processing.',
                'Withdraw consent where processing is based on consent.',
                'Opt out of sale or sharing, where those terms are defined by applicable law.',
                'Limit use or disclosure of sensitive personal information where applicable.',
                'Appeal a decision we make about your privacy request, where applicable.'
            ],
            closingParagraphs: [
                'You can update certain account and finance tracking information directly in the Services. To submit a privacy request, contact us using the details in Contact Us.',
                'We may need to verify your identity before fulfilling a request. We will respond to privacy requests in accordance with applicable law.',
                'We will not discriminate against you for exercising privacy rights available under applicable law.'
            ]
        },
        {
            id: 'regional-disclosures',
            title: 'Regional Privacy Disclosures',
            subsections: [
                {
                    id: 'us-state-rights',
                    title: 'United States State Privacy Rights',
                    paragraphs: [
                        'Some U.S. state privacy laws provide residents with rights to know, access, correct, delete, obtain a copy of, and opt out of certain processing of personal information.',
                        'Pocket Pilot does not sell personal information and does not share personal information for cross-context behavioral advertising. Pocket Pilot does not use personal financial tracking data for third-party advertising.',
                        'For purposes of applicable U.S. state privacy laws, the categories of personal information we may collect include:'
                    ],
                    bullets: [
                        'Identifiers, such as name, email address, user ID, IP address, and optional phone number.',
                        'Account login information, such as authentication credentials and security information.',
                        'Internet or electronic network activity information, such as request logs, device/browser data, and app usage information.',
                        'Commercial or financial tracking information that you manually enter, such as transactions, balances, categories, goals, and bills.',
                        'User-generated content, such as feature requests, comments, support messages, Splitr names, and uploaded images.',
                        'Inferences or calculations generated from your finance tracking data, such as totals, balances, split amounts, or category summaries.',
                        'Sensitive personal information where applicable, such as account login credentials, precise financial tracking details, voice input, and receipt images when those optional features are used.'
                    ],
                    closingParagraphs: [
                        'We use sensitive personal information only for purposes reasonably necessary to provide the Services, maintain security, process user-directed features, or as otherwise permitted by law. We do not use sensitive personal information to infer characteristics for unrelated advertising.'
                    ]
                },
                {
                    id: 'california-shine',
                    title: 'California Shine the Light',
                    paragraphs: [
                        'California residents may request information about certain disclosures of personal information to third parties for their direct marketing purposes. We do not disclose personal financial tracking data to third parties for their direct marketing purposes.'
                    ]
                },
                {
                    id: 'nevada-residents',
                    title: 'Nevada Residents',
                    paragraphs: [
                        'Nevada law allows residents to opt out of certain sales of covered information. Pocket Pilot does not currently sell covered information as contemplated by Nevada law.'
                    ]
                },
                {
                    id: 'eea-uk',
                    title: 'European Economic Area, United Kingdom, and Similar Regions',
                    paragraphs: [
                        'If you are located in a region with data protection laws such as the GDPR or UK GDPR, our legal bases for processing personal information may include the bases described in Legal Basis for Processing and summarized below:'
                    ],
                    bullets: [
                        'Contract: to provide the Services you request.',
                        'Consent: for optional features such as uploads, future voice input, future receipt scanning, AI-assisted processing, or certain communications where consent is required.',
                        'Legitimate interests: to secure, maintain, improve, and support the Services.',
                        'Legal obligation: to comply with applicable laws and legal requests.'
                    ],
                    closingParagraphs: [
                        'Subject to applicable law, you may have the right to access, rectify, erase, restrict, object to processing, request portability, withdraw consent, and lodge a complaint with a data protection authority.'
                    ]
                }
            ]
        },
        {
            id: 'childrens-privacy',
            title: "Children's Privacy",
            paragraphs: [
                'Pocket Pilot is not intended for children under 13 years old, and we do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided personal information to us, please contact us and we will take appropriate steps to delete the information.',
                'If applicable law in your jurisdiction requires a higher minimum age for use of online services, you may use the Services only if you meet that minimum age.'
            ]
        },
        {
            id: 'international-transfers',
            title: 'International Data Transfers',
            paragraphs: [
                'Pocket Pilot may process and store information in countries other than the one where you live. These countries may have data protection laws that differ from your local laws.',
                'Where required, we will use appropriate safeguards for international transfers, such as contractual protections or other legally recognized mechanisms.'
            ]
        },
        {
            id: 'third-party-links',
            title: 'Third-Party Links and Services',
            paragraphs: [
                'The Services may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. You should review their privacy policies before providing information to them.',
                'When future AI, OCR, speech-to-text, cloud storage, or other third-party services are used to provide Pocket Pilot features, those providers may process information on our behalf as service providers or processors.'
            ]
        },
        {
            id: 'changes',
            title: 'Changes to This Policy',
            paragraphs: [
                'We may update this Privacy Policy from time to time. The updated version will be identified by an updated "Last updated" date.',
                'If we make material changes, we will provide notice as required by applicable law. Material changes may include new categories of personal information, materially different uses of information, new AI features that materially change data processing, or new sharing practices.',
                'Your continued use of the Services after an updated Privacy Policy becomes effective means you acknowledge the updated policy.'
            ]
        },
        {
            id: 'contact-us',
            title: 'Contact Us',
            paragraphs: [
                'If you have questions, requests, or concerns about this Privacy Policy or our privacy practices, contact us at:'
            ]
        }
    ],
    contact: {
        name: 'Pocket Pilot',
        email: 'support@pocketpilot.com',
        emailLink: 'mailto:support@pocketpilot.com',
        github: 'github.com/danielgithiomi',
        githubLink: 'https://github.com/danielgithiomi',
        website: 'danielgithiomi.com',
        websiteLink: 'https://danielgithiomi.com'
    }
};
