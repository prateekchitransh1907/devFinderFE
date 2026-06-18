import { useDispatch, useSelector } from "react-redux";
import { getPayments } from "../actions/payments";

export default function Premium() {
    const dispatch = useDispatch();

    const paymentStatus = useSelector(
        (state) => state.payments.getPayment.status
    );

    const plans = [
        {
            name: "Pro",
            membershipType: "pro",
            price: 49,
            icon: <p className="text-3xl">⚡️</p>,
            popular: false,
            features: [
                "Unlimited connection requests",
                "Profile analytics",
                "See profile visitors",
                "Advanced search filters",
                "Ad-free experience",
            ],
        },
        {
            name: "Gold",
            membershipType: "gold",
            price: 59,
            icon: <p className="text-3xl">⭐️</p>,
            popular: true,
            features: [
                "Everything in Pro",
                "Priority profile ranking",
                "Featured profile badge",
                "Weekly profile boost",
                "Early access features",
                "Premium support",
            ],
        },
    ];

    const handleBuyClick = async (membershipType) => {
        try {
            const result = await dispatch(
                getPayments({
                    membershipType,
                })
            );

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log("Payment Order Created:", result.data);

            //Razorpay Integration Next Step

            const options = {
                key: result.data.keyId,
                amount: result.data.amount,
                currency: result.data.currency,
                order_id: result.data.orderId,
                name: "DevFinder",
                description: `${membershipType} Membership`,
                prefill: {
                    name: result.data.notes.firstName + " " + result.data.notes.lastName
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();


        } catch (error) {
            console.error("Error initiating purchase:", error);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold">
                        Upgrade Your Networking
                    </h1>

                    <p className="text-base-content/70 mt-4 text-lg">
                        Unlock premium tools to grow your developer network faster.
                    </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-12">

                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`
                                card bg-base-100 shadow-xl border
                                transition-all duration-300 ease-out
                                hover:-translate-y-2
                                hover:scale-105
                                hover:shadow-2xl
                                ${plan.popular
                                    ? "border-warning"
                                    : "border-base-300"
                                }
                            `}
                        >
                            <div className="card-body">

                                {plan.popular && (
                                    <div className="badge badge-warning badge-lg self-start px-4">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    {plan.icon}
                                    <h2 className="card-title text-3xl">
                                        {plan.name}
                                    </h2>
                                </div>

                                <div className="my-4">
                                    <span className="text-5xl font-bold">
                                        ₹{plan.price}
                                    </span>

                                    <span className="text-base-content/60">
                                        /month
                                    </span>
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex gap-2 items-start"
                                        >
                                            <span className="text-success font-bold">
                                                ✓
                                            </span>

                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="card-actions mt-8">
                                    <button
                                        onClick={() =>
                                            handleBuyClick(
                                                plan.membershipType
                                            )
                                        }
                                        disabled={
                                            paymentStatus === "pending"
                                        }
                                        className={`btn w-full ${plan.popular
                                            ? "btn-warning"
                                            : "btn-primary"
                                            }`}
                                    >
                                        {paymentStatus === "pending"
                                            ? "Creating Order..."
                                            : `Choose ${plan.name}`}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-sm text-base-content/60">
                    Cancel anytime. No hidden fees.
                </div>
            </div>
        </div>
    );
}