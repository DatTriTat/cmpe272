import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  setExperiences,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newExperience, setNewExperience] = useState<Experience>({
    id: 0,
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const handleAddExperience = () => {
    const newId = Math.max(...experiences.map((exp) => exp.id), 0) + 1;
    setExperiences([{ ...newExperience, id: newId }, ...experiences]);
    setNewExperience({
      id: 0,
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setIsAdding(false);
  };

  const handleRemoveExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleCurrentChange = (checked: boolean) => {
    setNewExperience({
      ...newExperience,
      current: checked,
      endDate: checked ? "" : newExperience.endDate,
    });
  };

  return (
    <Card>
      <CardBody className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          {!isAdding && (
            <Button
              color="primary"
              onPress={() => setIsAdding(true)}
              startContent={<Icon icon="lucide:plus" />}
            >
              Add Experience
            </Button>
          )}
        </div>

        {isAdding && (
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold">Add New Experience</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company"
                placeholder="Company name"
                value={newExperience.company}
                onValueChange={(value) =>
                  setNewExperience({ ...newExperience, company: value })
                }
              />
              <Input
                label="Position"
                placeholder="Your job title"
                value={newExperience.position}
                onValueChange={(value) =>
                  setNewExperience({ ...newExperience, position: value })
                }
              />
            </div>

            <Input
              label="Location"
              placeholder="City, State, Country"
              value={newExperience.location}
              onValueChange={(value) =>
                setNewExperience({ ...newExperience, location: value })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={newExperience.startDate}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    startDate: e.target.value,
                  })
                }
              />
              <div className="flex flex-col">
                <Input
                  label="End Date"
                  type="month"
                  isDisabled={newExperience.current}
                  value={newExperience.endDate}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      endDate: e.target.value,
                    })
                  }
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newExperience.current}
                    onChange={(e) => handleCurrentChange(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">I currently work here</span>
                </label>
              </div>
            </div>

            <Textarea
              label="Description"
              placeholder="Describe your responsibilities and achievements"
              value={newExperience.description}
              onValueChange={(value) =>
                setNewExperience({ ...newExperience, description: value })
              }
              minRows={3}
            />

            <div className="flex justify-end gap-2">
              <Button variant="flat" onPress={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleAddExperience}
                isDisabled={
                  !newExperience.company ||
                  !newExperience.position ||
                  !newExperience.startDate
                }
              >
                Save
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="text-default-600">
                    {exp.company} • {exp.location}
                  </p>
                  <p className="text-sm text-default-500">
                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {exp.current
                      ? "Present"
                      : new Date(exp.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                  </p>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  color="danger"
                  onPress={() => handleRemoveExperience(exp.id)}
                >
                  <Icon icon="lucide:trash-2" />
                </Button>
              </div>
              <p
                className="text-default-600"
                style={{ whiteSpace: "pre-line" }}
              >
                {exp.description}
              </p>
              {index < experiences.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ExperienceSection;
