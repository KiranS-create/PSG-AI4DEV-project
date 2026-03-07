import { useState } from "react";
import { Link } from "wouter";
import { usePatients, useCreatePatient } from "@/hooks/use-patients";
import { Card, Button, Input, Modal } from "@/components/ui";
import { Users, Plus, ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: patients, isLoading } = usePatients();
  const createPatient = useCreatePatient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', bloodType: '', medicalHistory: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPatient.mutate({
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      bloodType: formData.bloodType || null,
      medicalHistory: formData.medicalHistory || null,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: '', age: '', gender: 'Male', bloodType: '', medicalHistory: '' });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Patient Register</h1>
          <p className="text-muted-foreground mt-1">Manage and access centralized clinical patient profiles.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="lg" className="shrink-0 gap-2">
          <UserPlus className="w-5 h-5" />
          Register Patient
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : patients?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-white/10 bg-transparent">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Patients Registered</h3>
          <p className="text-muted-foreground mb-6 max-w-md">Add your first patient to begin utilizing the TrAIge agentic intelligence platform.</p>
          <Button onClick={() => setIsModalOpen(true)}>Add Patient</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients?.map((patient, i) => (
            <motion.div 
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-6 hover:border-primary/50 transition-colors group flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-display font-bold text-xl border border-primary/20">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground border border-white/5">
                    ID: {patient.id.toString().padStart(4, '0')}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">{patient.name}</h3>
                <div className="text-sm text-muted-foreground mb-6 flex items-center gap-3">
                  <span>{patient.age} yrs</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{patient.gender}</span>
                  {patient.bloodType && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-destructive/80 font-medium">{patient.bloodType}</span>
                    </>
                  )}
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5">
                  <Link href={`/patients/${patient.id}`} className="flex items-center justify-between w-full text-sm font-medium text-primary hover:text-primary-foreground hover:bg-primary px-4 py-2 rounded-lg transition-all duration-300">
                    View Clinical Profile
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Age</label>
              <Input required type="number" min="0" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="45" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Gender</label>
              <select 
                className="flex h-11 w-full rounded-xl border-2 border-border bg-background/50 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Blood Type (Optional)</label>
            <Input value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})} placeholder="O+" />
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createPatient.isPending}>
              {createPatient.isPending ? "Registering..." : "Register Patient"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
