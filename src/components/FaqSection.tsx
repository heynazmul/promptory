import { useState } from "react";
import { Card } from "@/components/ui/card";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Promptify?",
      answer: "Promptify is a platform that provides high-quality AI prompts for various use cases. Our prompts are designed to help you get better results from AI models like ChatGPT, Claude, and others."
    },
    {
      question: "How do I use the prompts?",
      answer: "Simply browse our collection, find a prompt that fits your needs, and click the copy button. You can then paste it into your AI tool of choice and customize it as needed."
    },
    {
      question: "Are the prompts free to use?",
      answer: "Yes! Our basic prompts are completely free. We also offer premium prompts and advanced features for Pro and Enterprise users."
    },
    {
      question: "Can I contribute my own prompts?",
      answer: "Absolutely! We encourage our community to share their best prompts. Pro users can create and share custom prompts with the community."
    },
    {
      question: "Do you offer API access?",
      answer: "Yes, our Enterprise plan includes API access, allowing you to integrate our prompts directly into your applications and workflows."
    },
    {
      question: "How often do you add new prompts?",
      answer: "We add new prompts regularly based on user feedback and emerging AI trends. Our team continuously works to expand and improve our collection."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-saas-black to-[#1c160c]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about Promptify
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-gray-700">
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;