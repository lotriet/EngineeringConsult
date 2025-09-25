import Head from 'next/head'
import Hero from '@/components/Hero'
import ValueProposition from '@/components/ValueProposition'
import Services from '@/components/Services'

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Engineering Consulting - Expert AI Solutions</title>
        <meta name="description" content="Transform your business with expert AI engineering consulting. Years of experience building production AI applications that deliver real results." />
        <meta name="keywords" content="AI engineering, machine learning consulting, AI development, artificial intelligence, AI applications" />
        <meta property="og:title" content="AI Engineering Consulting - Expert AI Solutions" />
        <meta property="og:description" content="Transform your business with expert AI engineering consulting. Years of experience building production AI applications." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://youraicompany.com" />
      </Head>

      <main className="min-h-screen">
        <Hero />
        <ValueProposition />
        <Services />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Engineering Consulting</h3>
                <p className="text-gray-400">
                  Expert AI solutions with years of proven experience in building production applications.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>AI Strategy & Consulting</li>
                  <li>Custom AI Development</li>
                  <li>AI Integration & Deployment</li>
                  <li>MLOps & Maintenance</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">
                  Ready to start your AI project?<br />
                  <a href="#" className="text-primary-400 hover:text-primary-300">
                    Get in touch for a consultation
                  </a>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 AI Engineering Consulting. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}