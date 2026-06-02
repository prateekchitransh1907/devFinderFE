function Pricing() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-4">
                Pricing
            </h1>

            <p className="text-center opacity-70 mb-12">
                Connect with developers and grow your professional network.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Free</h2>
                        <p className="text-4xl font-bold">₹0</p>

                        <ul className="space-y-2 mt-4">
                            <li>✓ Create Profile</li>
                            <li>✓ Send Connection Requests</li>
                            <li>✓ Accept Connections</li>
                            <li>✓ Developer Discovery</li>
                        </ul>
                    </div>
                </div>

                <div className="card bg-primary text-primary-content shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Premium</h2>
                        <p className="text-4xl font-bold">₹49/month (Coming Soon)</p>

                        <ul className="space-y-2 mt-4">
                            <li>✓ Unlimited Visibility</li>
                            <li>✓ Priority Profile Ranking</li>
                            <li>✓ Advanced Filters</li>
                            <li>✓ Premium Badge</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pricing