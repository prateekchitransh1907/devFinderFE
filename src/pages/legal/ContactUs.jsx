function ContactUs() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

            <p className="mb-6">
                We'd love to hear from you.
            </p>

            <div className="space-y-4">
                <div>
                    <h2 className="font-semibold">Email</h2>
                    <p>support@dev-finder.com</p>
                </div>

                <div>
                    <h2 className="font-semibold">Business Inquiries</h2>
                    <p>business@dev-finder.com</p>
                </div>

                <div>
                    <h2 className="font-semibold">Website</h2>
                    <p>https://dev-finder.com</p>
                </div>
            </div>

            <p className="mt-10">
                We aim to respond to all inquiries within 2–3 business days.
            </p>
        </div>
    )
}

export default ContactUs