import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, Baby, MapPin, Music2, Users, Send } from "lucide-react";

const steps = ["Select Child", "Select Branch", "Select Program", "Choose Teacher", "Confirm"];

const children = [
  { id: 1, name: "Emily Johnson", age: 12, avatar: "EJ", currentPrograms: ["Piano — Beginner"] },
  { id: 2, name: "Lucas Johnson", age: 9, avatar: "LJ", currentPrograms: ["Drums — Beginner"] },
];

const branches = [
  { id: 1, name: "Downtown Branch", address: "123 Music Ave, Downtown", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=60" },
  { id: 2, name: "Westside Branch", address: "456 Harmony Blvd, Westside", image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&q=60" },
  { id: 3, name: "Northside Branch", address: "789 Melody Lane, Northside", image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&q=60" },
  { id: 4, name: "Eastside Branch", address: "321 Rhythm Road, Eastside", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=60" },
];

const programs = [
  { id: 1, name: "Piano", icon: "🎹", levels: ["Beginner", "Intermediate", "Advanced"], ageRange: "5+" },
  { id: 2, name: "Violin", icon: "🎻", levels: ["Beginner", "Intermediate", "Advanced"], ageRange: "5+" },
  { id: 3, name: "Guitar", icon: "🎸", levels: ["Beginner", "Intermediate", "Advanced"], ageRange: "7+" },
  { id: 4, name: "Vocal", icon: "🎤", levels: ["Beginner", "Intermediate", "Advanced"], ageRange: "8+" },
  { id: 5, name: "Drums", icon: "🥁", levels: ["Beginner", "Intermediate", "Advanced"], ageRange: "6+" },
  { id: 6, name: "Ukulele", icon: "🎵", levels: ["Beginner", "Intermediate"], ageRange: "5+" },
];

const teachersByProgram: Record<string, Array<{ id: number; name: string; exp: string; spec: string; schedule: string; avatar: string }>> = {
  Piano: [
    { id: 1, name: "Dr. Sarah Mitchell", exp: "15 years", spec: "Classical & Contemporary Piano", schedule: "Mon, Wed, Fri — 9AM–5PM", avatar: "SM" },
    { id: 2, name: "Michael Chen", exp: "8 years", spec: "Jazz & Pop Piano", schedule: "Tue, Thu, Sat — 10AM–6PM", avatar: "MC" },
  ],
  Violin: [
    { id: 3, name: "Elena Vasquez", exp: "12 years", spec: "Classical Violin & Chamber Music", schedule: "Mon–Fri — 10AM–4PM", avatar: "EV" },
  ],
  Guitar: [
    { id: 4, name: "James Rodriguez", exp: "10 years", spec: "Acoustic, Electric & Classical Guitar", schedule: "Mon, Wed, Fri — 11AM–7PM", avatar: "JR" },
    { id: 5, name: "Alex Turner", exp: "7 years", spec: "Rock & Pop Guitar", schedule: "Tue, Thu, Sat — 9AM–5PM", avatar: "AT" },
  ],
  Vocal: [
    { id: 6, name: "Dr. Lisa Park", exp: "14 years", spec: "Classical Voice & Musical Theatre", schedule: "Mon–Thu — 10AM–6PM", avatar: "LP" },
  ],
  Drums: [
    { id: 7, name: "Marcus Wright", exp: "11 years", spec: "Drum Kit, Percussion & World Rhythms", schedule: "Tue, Thu, Sat — 10AM–6PM", avatar: "MW" },
  ],
  Ukulele: [
    { id: 8, name: "Sophie Kim", exp: "5 years", spec: "Ukulele & Folk Music", schedule: "Mon, Wed, Fri — 2PM–6PM", avatar: "SK" },
  ],
};

export default function ParentEnrollment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChild, setSelectedChild] = useState<(typeof children)[0] | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<(typeof branches)[0] | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<(typeof programs)[0] | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [selectedTeacher, setSelectedTeacher] = useState<{ id: number; name: string; exp: string; spec: string; schedule: string; avatar: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canProceed = [
    !!selectedChild,
    !!selectedBranch,
    !!selectedProgram,
    !!selectedTeacher,
    true,
  ][currentStep];

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl mb-3" style={{ fontStyle: "italic" }}>Enrollment Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-2">
            Your enrollment request for <strong className="text-foreground">{selectedChild?.name}</strong> in{" "}
            <strong className="text-foreground">{selectedProgram?.name}</strong> ({selectedLevel}) has been sent.
          </p>
          <p className="text-muted-foreground text-sm mb-6">Teacher: <strong className="text-foreground">{selectedTeacher?.name}</strong></p>
          <p className="text-xs text-muted-foreground mb-8">Our team will review and confirm within 1–2 business days.</p>
          <button
            onClick={() => { setSubmitted(false); setCurrentStep(0); setSelectedChild(null); setSelectedBranch(null); setSelectedProgram(null); setSelectedTeacher(null); }}
            className="bg-gold text-black px-6 py-3 rounded-xl font-semibold hover:bg-gold-light transition-all"
          >
            Enroll Another Child
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>New Enrollment</h2>
        <p className="text-sm text-muted-foreground">Enroll your child in a music program at Harmony Academy</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === currentStep ? "bg-gold text-black" :
              i < currentStep ? "bg-green-500/20 text-green-400" :
              "bg-muted text-muted-foreground"
            }`}>
              {i < currentStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-4 text-center">{i + 1}</span>}
              {step}
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          {/* Step 1: Select Child */}
          {currentStep === 0 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Baby className="w-4 h-4 text-gold" />Select Child</h3>
              <p className="text-sm text-muted-foreground mb-5">Choose which child to enroll</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${selectedChild?.id === child.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                        <span className="text-gold font-bold">{child.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{child.name}</p>
                        <p className="text-xs text-muted-foreground">{child.age} years old</p>
                      </div>
                      {selectedChild?.id === child.id && <CheckCircle2 className="w-4 h-4 text-gold ml-auto" />}
                    </div>
                    {child.currentPrograms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {child.currentPrograms.map((p) => (
                          <span key={p} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">{p}</span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Branch */}
          {currentStep === 1 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><MapPin className="w-4 h-4 text-gold" />Select Branch</h3>
              <p className="text-sm text-muted-foreground mb-5">Choose your preferred branch location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    className={`rounded-xl border-2 overflow-hidden text-left transition-all ${selectedBranch?.id === branch.id ? "border-gold" : "border-border hover:border-gold/50"}`}
                  >
                    <div className="h-28 overflow-hidden bg-muted">
                      <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{branch.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{branch.address}</p>
                      </div>
                      {selectedBranch?.id === branch.id && <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Program */}
          {currentStep === 2 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Music2 className="w-4 h-4 text-gold" />Select Program</h3>
              <p className="text-sm text-muted-foreground mb-5">Choose an instrument or program</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {programs.map((prog) => (
                  <button
                    key={prog.id}
                    onClick={() => setSelectedProgram(prog)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${selectedProgram?.id === prog.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}
                  >
                    <div className="text-3xl mb-2">{prog.icon}</div>
                    <p className="text-sm font-semibold">{prog.name}</p>
                    <p className="text-xs text-muted-foreground">Age {prog.ageRange}</p>
                    {selectedProgram?.id === prog.id && <CheckCircle2 className="w-4 h-4 text-gold mx-auto mt-2" />}
                  </button>
                ))}
              </div>
              {selectedProgram && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Select Level</p>
                  <div className="flex gap-3">
                    {selectedProgram.levels.map((level) => (
                      <button key={level} onClick={() => setSelectedLevel(level)} className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${selectedLevel === level ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-gold/40"}`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Choose Teacher */}
          {currentStep === 3 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Users className="w-4 h-4 text-gold" />Choose Teacher</h3>
              <p className="text-sm text-muted-foreground mb-5">Select a teacher for {selectedProgram?.name}</p>
              <div className="space-y-4">
                {(teachersByProgram[selectedProgram?.name || ""] || []).map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all ${selectedTeacher?.id === teacher.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gold font-bold text-sm">{teacher.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{teacher.name}</p>
                          {selectedTeacher?.id === teacher.id && <CheckCircle2 className="w-4 h-4 text-gold" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{teacher.spec}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">{teacher.exp} exp</span>
                          <span className="text-xs text-muted-foreground">{teacher.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {currentStep === 4 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Send className="w-4 h-4 text-gold" />Confirm Enrollment</h3>
              <p className="text-sm text-muted-foreground mb-5">Review your enrollment details before submitting</p>
              <div className="bg-muted rounded-xl p-5 space-y-3">
                {[
                  { label: "Child", value: selectedChild?.name },
                  { label: "Branch", value: selectedBranch?.name },
                  { label: "Program", value: `${selectedProgram?.name} — ${selectedLevel}` },
                  { label: "Teacher", value: selectedTeacher?.name },
                  { label: "Schedule", value: selectedTeacher?.schedule },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span className="text-xs text-muted-foreground w-20 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4" style={{ fontStyle: "normal" }}>
                By submitting, you agree to our enrollment terms. Our team will confirm your request within 1–2 business days.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed}
            className="px-5 py-2.5 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Enrollment
          </button>
        )}
      </div>
    </div>
  );
}
