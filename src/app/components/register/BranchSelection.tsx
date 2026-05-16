import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react";
import { branches, companies, getBranchesByCompany } from "../../data/branches";

interface BranchSelectionProps {
  selected: any;
  onSelect: (branch: any) => void;
}

export default function BranchSelection({ selected, onSelect }: BranchSelectionProps) {
  return (
    <div className="space-y-12">
      {companies.map((company, companyIndex) => {
        const companyBranches = getBranchesByCompany(company.id);

        return (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: companyIndex * 0.1 }}
          >
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl mb-2" style={{ fontStyle: 'italic' }}>
                {company.name}
              </h3>
              <p className="text-muted-foreground">{company.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyBranches.map((branch, index) => {
                const isSelected = selected?.id === branch.id;

                return (
                  <motion.button
                    key={branch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (companyIndex * companyBranches.length + index) * 0.05 }}
                    onClick={() => onSelect(branch)}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-gold bg-gold/5"
                        : "border-border hover:border-gold/50 bg-card/50 backdrop-blur-sm"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={branch.image}
                        alt={branch.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {isSelected && (
                        <div className="absolute top-4 right-4 w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                          <Check className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors" style={{ fontStyle: 'italic' }}>
                        {branch.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {branch.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                          <span>{branch.address}, {branch.city}, {branch.state} {branch.zipCode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{branch.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{branch.operatingHours.weekdays}</span>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex flex-wrap gap-2">
                          {branch.facilities.slice(0, 3).map((facility, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gold/10 text-gold text-xs rounded"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
