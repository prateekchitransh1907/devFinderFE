import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-base-100">
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="text-center mb-14">
                    <h1 className="text-5xl font-bold text-primary mb-4">
                        Privacy Policy
                    </h1>

                    <p className="text-base-content/70 text-lg">
                        Your privacy matters. This policy explains how DevFinder collects,
                        uses, and protects your information.
                    </p>

                    <p className="text-base-content/50 text-sm mt-3">
                        Last Updated: June 2026
                    </p>
                </div>

                {/* Content Card */}
                <div className="card bg-base-200 shadow-xl border border-base-300">
                    <div className="card-body p-8 md:p-12">
                        {/* Section */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Information We Collect
                            </h2>

                            <p className="leading-8 text-base-content/80">
                                When you create an account on DevFinder, we may collect the
                                following information:
                            </p>

                            <ul className="list-disc ml-6 mt-4 space-y-2 text-base-content/80">
                                <li>Name and profile information</li>
                                <li>Email address</li>
                                <li>Professional skills and interests</li>
                                <li>Connection and networking activity</li>
                                <li>Usage and analytics data</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                How We Use Your Information
                            </h2>

                            <p className="leading-8 text-base-content/80">
                                DevFinder uses collected information to:
                            </p>

                            <ul className="list-disc ml-6 mt-4 space-y-2 text-base-content/80">
                                <li>Create and manage your account</li>
                                <li>Help developers discover and connect with each other</li>
                                <li>Provide platform features and recommendations</li>
                                <li>Send important account and service notifications</li>
                                <li>Improve performance, reliability, and security</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Payments
                            </h2>

                            <p className="leading-8 text-base-content/80">
                                Premium subscriptions are processed securely through trusted
                                payment providers. DevFinder does not store your complete
                                payment card information.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Third-Party Services
                            </h2>

                            <p className="leading-8 text-base-content/80">
                                We may use trusted third-party providers to operate DevFinder,
                                including:
                            </p>

                            <ul className="list-disc ml-6 mt-4 space-y-2 text-base-content/80">
                                <li>AWS for hosting and email services</li>
                                <li>MongoDB Atlas for database services</li>
                                <li>Razorpay for payment processing</li>
                                <li>Cloudflare for DNS and security services</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Data Security
                            </h2>

                            <p className="leading-8 text-base-content/80">
                                We take reasonable technical and organizational measures to
                                protect your personal information from unauthorized access,
                                disclosure, or misuse.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Your Rights
                            </h2>

                            <p className="leading-8 text-base-content/80">
                                You may request updates, corrections, or deletion of your
                                personal information by contacting us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Contact Us
                            </h2>

                            <p className="leading-8 text-base-content/80">
                                If you have questions regarding this Privacy Policy, please
                                contact:
                            </p>

                            <div className="mt-4 p-5 rounded-xl bg-base-300">
                                <p className="font-semibold">DevFinder Support</p>
                                <p className="text-primary">
                                    support@dev-finder.com
                                </p>
                                <p>https://dev-finder.com</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;