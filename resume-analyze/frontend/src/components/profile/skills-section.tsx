import React, { useState } from "react";
import { Card, CardBody, Input, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Skill {
  name: string;
  level: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, setSkills }) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setSkills([...skills, { name: newSkill.trim(), level: "Intermediate" }]);
    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
  };

  const handleLevelChange = (index: number, newLevel: string) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill, i) => (i === index ? { ...skill, level: newLevel } : skill))
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "success";
      case "Advanced":
        return "primary";
      case "Intermediate":
        return "warning";
      case "Beginner":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardBody className="space-y-6">
        {/* Add Skill */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <Input
              label="Add Skill"
              placeholder="e.g., React, Python, Project Management"
              value={newSkill}
              onValueChange={setNewSkill}
              onKeyDown={(e) => e.key === "Enter"}
            />
          </div>
          <Button
            color="primary"
            onPress={handleAddSkill}
            isDisabled={!newSkill.trim()}
          >
            Add Skill
          </Button>
        </div>

        {/* Skills List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Chip
              key={index}
              onClose={() => handleRemoveSkill(index)}
              variant="flat"
              color={getLevelColor(skill.level) as any}
              classNames={{
                base: "py-2 px-3",
                content: "text-sm font-medium",
              }}
            >
              {skill.name}
              <select
                value={skill.level}
                onChange={(e) => {
                  const updatedSkills = [...skills];
                  updatedSkills[index].level = e.target.value;
                  setSkills(updatedSkills);
                }}
                className="ml-2 text-xs bg-transparent border-none focus:outline-none text-current"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </Chip>
            ))}
          </div>
        </div>

        {/* Skill Tip */}
        <div className="bg-content2 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Icon icon="lucide:lightbulb" className="text-warning" />
            <span>Skills Tip</span>
          </h4>
          <p className="text-sm">
            Include a mix of technical skills (programming languages, tools) and soft skills (communication, leadership) relevant to your target roles. Regularly update your skills to reflect your current expertise level.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default SkillsSection;
