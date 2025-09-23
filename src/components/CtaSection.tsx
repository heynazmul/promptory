import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Ready to Transform Your AI Interactions?
        </h2>
        <p className="text-xl mb-8 text-orange-100">
          Join thousands of users who are already getting better results with our prompts.
          Start your journey today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-orange-600"
          >
            View Pricing
          </Button>
        </div>
        <p className="text-orange-100 text-sm mt-4">
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
};

export default CtaSection;