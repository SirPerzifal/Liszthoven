import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";
import BranchSelection from "../components/register/BranchSelection";
import LessonSelection from "../components/register/LessonSelection";
import TeacherSelection from "../components/register/TeacherSelection";
import BiodataForm from "../components/register/BiodataForm";
import Confirmation from "../components/register/Confirmation";

const steps = [
  { id: 1, name: "Branch", title: "Choose Your Branch" },
  { id: 2, name: "Lesson", title: "Select Your Lesson" },
  { id: 3, name: "Teacher", title: "Choose Your Teacher" },
  { id: 4, name: "Details", title: "Your Information" },
  { id: 5, name: "Confirm", title: "Confirmation" }
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    branch: null,
    lesson: null,
    teacher: null,
    biodata: null
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.branch !== null;
      case 2: return formData.lesson !== null;
      case 3: return formData.teacher !== null;
      case 4: return formData.biodata !== null;
      default: return true;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="Register"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Begin Your Journey
            </div>
            <h1 className="text-6xl md:text-8xl mb-6 tracking-tight" style={{ fontStyle: 'italic' }}>
              Course Registration
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed" style={{ fontStyle: 'normal' }}>
              Start your musical journey with us in just a few simple steps
            </p>
          </motion.div>
        </div>
      </ParallaxHero>

      {/* Progress Steps */}
      <div className="bg-muted border-b border-border sticky top-20 z-40 backdrop-blur-md bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-gold border-gold text-primary"
                        : currentStep === step.id
                        ? "border-gold text-gold"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.name}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? "bg-gold" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl mb-4" style={{ fontStyle: 'italic' }}>
                {steps[currentStep - 1].title}
              </h2>
              <div className="w-20 h-1 bg-gold mx-auto" />
            </div>

            {currentStep === 1 && (
              <BranchSelection
                selected={formData.branch}
                onSelect={(branch) => updateFormData("branch", branch)}
              />
            )}
            {currentStep === 2 && (
              <LessonSelection
                selected={formData.lesson}
                onSelect={(lesson) => updateFormData("lesson", lesson)}
              />
            )}
            {currentStep === 3 && (
              <TeacherSelection
                lesson={formData.lesson}
                selected={formData.teacher}
                onSelect={(teacher) => updateFormData("teacher", teacher)}
              />
            )}
            {currentStep === 4 && (
              <BiodataForm
                data={formData.biodata}
                onSubmit={(data) => {
                  updateFormData("biodata", data);
                  nextStep();
                }}
              />
            )}
            {currentStep === 5 && (
              <Confirmation formData={formData} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-12 pt-8 border-t border-border">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 backdrop-blur-sm text-foreground border border-border hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gold text-primary hover:bg-gold-light shadow-xl"
            >
              {currentStep === 4 ? "Review" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
