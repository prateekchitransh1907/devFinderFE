import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="w-full bg-base-200 border-t border-base-300 py-6 px-4 md:px-8">
            <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <Link
                        to="/pricing"
                        className="link link-hover text-base-content/70"
                    >
                        Pricing
                    </Link>

                    <Link
                        to="/privacy-policy"
                        className="link link-hover text-base-content/70"
                    >
                        Privacy Policy
                    </Link>

                    <Link
                        to="/terms-of-service"
                        className="link link-hover text-base-content/70"
                    >
                        Terms of Service
                    </Link>

                    <Link
                        to="/refund-policy"
                        className="link link-hover text-base-content/70"
                    >
                        Refund Policy
                    </Link>

                    <Link
                        to="/contact-us"
                        className="link link-hover text-base-content/70"
                    >
                        Contact Us
                    </Link>
                </div>

                <p className="text-center text-sm text-base-content/50">
                    © {new Date().getFullYear()} DevFinder. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;