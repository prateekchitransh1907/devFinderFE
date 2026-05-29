import { Helmet } from 'react-helmet-async'

function SEO({
    title,
    description,
    keywords,
    image,
    url,
}) {
    return (
        <Helmet>

            {/* Page Title */}
            <title>{title}</title>

            {/* Basic SEO */}
            <meta
                name="description"
                content={description}
            />

            <meta
                name="keywords"
                content={keywords}
            />

            <meta
                name="robots"
                content="index, follow"
            />

            {/* Canonical URL */}
            {url && (
                <link
                    rel="canonical"
                    href={url}
                />
            )}

            {/* Open Graph */}
            <meta property="og:type" content="website" />

            <meta
                property="og:title"
                content={title}
            />

            <meta
                property="og:description"
                content={description}
            />

            {image && (
                <meta
                    property="og:image"
                    content={image}
                />
            )}

            {url && (
                <meta
                    property="og:url"
                    content={url}
                />
            )}

            {/* Twitter */}
            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={title}
            />

            <meta
                name="twitter:description"
                content={description}
            />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "DevFinder",
                    url: "https://dev-finder.com",
                    description:
                        "A platform for developers to connect, collaborate, and grow professionally.",
                })}
            </script>

        </Helmet>
    )
}

export default SEO