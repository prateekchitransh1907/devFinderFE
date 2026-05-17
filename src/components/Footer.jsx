function Footer() {
    return (
        <footer className="w-full bg-base-200 border-t border-base-300 py-4 px-4 md:px-8">
            <p className="text-center text-sm text-base-content/50">
                @ {new Date().getFullYear()} DevFinder. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer;