export type QuestionType = "boolean" | "text" | "textarea" | "number" | "select";

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
}

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export const FORMS: Record<string, FormDefinition> = {
  safety: {
    id: "safety",
    name: "Safety Inspection",
    description: "General workplace safety checklist",
    questions: [
      { id: "fire_ext", label: "Fire extinguisher available", type: "boolean" },
      { id: "exit_access", label: "Emergency exit accessible", type: "boolean" },
      { id: "ppe", label: "PPE worn correctly", type: "boolean" },
      { id: "no_slip", label: "No slipping hazards", type: "boolean" },
      { id: "first_aid", label: "First–aid kit stocked", type: "boolean" },

      { id: "room_temp", label: "Average room temperature (°C)", type: "number" },
      {
        id: "risk_level",
        label: "Overall risk level",
        type: "select",
        options: ["Low", "Medium", "High"],
      },
      { id: "supervisor", label: "Supervisor on duty", type: "text" },
      { id: "notes", label: "Additional notes", type: "textarea" },
    ],
  },

  vehicle: {
    id: "vehicle",
    name: "Vehicle Inspection",
    description: "Vehicle condition inspection checklist",
    questions: [
      { id: "headlights", label: "Headlights functioning", type: "boolean" },
      { id: "brakes", label: "Brake performance good", type: "boolean" },
      { id: "oil", label: "Oil level sufficient", type: "boolean" },
      { id: "engine_sound", label: "No unusual engine sounds", type: "boolean" },
      { id: "seatbelts", label: "Seat belts working", type: "boolean" },

      { id: "odometer", label: "Odometer reading (km)", type: "number" },
      {
        id: "vehicle_condition",
        label: "Vehicle condition",
        type: "select",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
      { id: "driver_name", label: "Driver name", type: "text" },
      { id: "vehicle_notes", label: "Additional comments", type: "textarea" },
    ],
  },

  equipment: {
    id: "equipment",
    name: "Equipment Audit",
    description: "Operational and compliance checks",
    questions: [
      { id: "operational", label: "Equipment operational", type: "boolean" },
      { id: "damage", label: "No visible damage", type: "boolean" },
      { id: "maintenance", label: "Maintenance up to date", type: "boolean" },

      { id: "equipment_type", label: "Equipment Type", type: "text" },
      { id: "last_service", label: "Last service date", type: "text" },
      {
        id: "condition",
        label: "Condition rating",
        type: "select",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
      { id: "equipment_notes", label: "Notes", type: "textarea" },
    ],
  },
};
