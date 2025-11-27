"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AI_NAME } from "@/config";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-red-600 flex flex-col">
      <header className="bg-red-600 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center border-4 border-red-400">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{AI_NAME}</h1>
              <p className="text-xs text-red-200">Terms of Use</p>
            </div>
          </div>
          <Link href="/">
            <Button className="bg-white text-red-600 hover:bg-red-50 rounded-full px-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-4 overflow-y-auto">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Terms of Use</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Pokémon Battle Assistant ("the Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Description of Service</h2>
              <p>
                The Pokémon Battle Assistant is an AI-powered tool designed to provide information about Pokémon types, battle strategies, team building suggestions, and competitive tier information. The Service is intended for educational and entertainment purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Intellectual Property</h2>
              <p>
                Pokémon, Pokémon character names, and related indicia are trademarks of Nintendo, Game Freak, and The Pokémon Company. This Service is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, or The Pokémon Company. All Pokémon-related content is used for educational and informational purposes under fair use principles.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">4. User Conduct</h2>
              <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Use the Service in any way that violates applicable laws or regulations</li>
                <li>Attempt to interfere with or disrupt the Service</li>
                <li>Use the Service to transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of any information provided by the AI assistant. Battle strategies and recommendations are suggestions only and may not reflect optimal gameplay in all situations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Limitation of Liability</h2>
              <p>
                In no event shall Mansha and Anand, or Ringel.AI, be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">7. AI-Generated Content</h2>
              <p>
                The Service uses artificial intelligence to generate responses. While we strive for accuracy, AI-generated content may occasionally contain errors or inaccuracies. Users should verify critical information from official Pokémon sources when necessary.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Privacy</h2>
              <p>
                Conversations with the AI assistant may be processed to provide responses but are not permanently stored on our servers. We do not collect personal information beyond what is necessary to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">9. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Use at any time. Continued use of the Service after any modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">10. Contact</h2>
              <p>
                If you have any questions about these Terms of Use, please contact the developers through the appropriate channels.
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: November 2025
            </p>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center text-xs text-red-200 px-4 space-y-1">
        <p>© 2025 Mansha and Anand. Terms of Use.</p>
        <p>
          Pokémon is owned by Nintendo, Game Freak, and The Pokémon Company. This agent is for educational and strategy exploration only. Powered by{" "}
          <a href="https://ringel.ai/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            Ringel.AI
          </a>
        </p>
      </footer>
    </div>
  );
}
