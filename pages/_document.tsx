import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="AI Engineering Consulting - Expert AI application development with years of proven experience" />
        <meta name="keywords" content="AI engineering, machine learning consulting, AI applications, artificial intelligence development" />
        <meta name="author" content="AI Engineering Consultants" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Engineering Consulting - Expert AI Solutions" />
        <meta property="og:description" content="Transform your business with AI. Expert consultants with years of experience building production AI applications." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}