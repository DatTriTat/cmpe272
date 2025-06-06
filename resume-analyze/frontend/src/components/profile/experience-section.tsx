import React, { useState, useEffect } from "react";
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
  id?: string | number;
  _id?: string;
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
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editExperience, setEditExperience] = useState<Experience | null>(null);
  const [newExperience, setNewExperience] = useState<Experience>({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  useEffect(() => {
    const patched = experiences.map((exp) => ({
      ...exp,
      id: exp._id?.toString() || exp.id || Date.now() + Math.random(),
    }));
    setExperiences(patched);
  }, []);

  const handleAddExperience = () => {
    const newId = Date.now();
    const newExp = { ...newExperience, id: newId };
    setExperiences([newExp, ...experiences]);
    setNewExperience({
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

  const handleEdit = (exp: Experience) => {
    const cloned = JSON.parse(JSON.stringify(exp));
    setEditExperience(cloned);
    setEditingId(cloned.id!);
    setIsAdding(false);
  };

  const handleUpdateExperience = () => {
    if (!editExperience || editingId == null) return;
    const updated = experiences.map((exp) =>
      exp.id === editingId ? { ...editExperience } : exp
    );
    setExperiences(updated);
    setEditingId(null);
    setEditExperience(null);
  };

  const handleRemoveExperience = (id: string | number) => {
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
          {!isAdding && editingId === null && (
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
                value={newExperience.company}
                onValueChange={(val) =>
                  setNewExperience({ ...newExperience, company: val })
                }
              />
              <Input
                label="Position"
                value={newExperience.position}
                onValueChange={(val) =>
                  setNewExperience({ ...newExperience, position: val })
                }
              />
            </div>
            <Input
              label="Location"
              value={newExperience.location}
              onValueChange={(val) =>
                setNewExperience({ ...newExperience, location: val })
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
                  />
                  <span className="text-sm">I currently work here</span>
                </label>
              </div>
            </div>
            <Textarea
              label="Description"
              value={newExperience.description}
              onValueChange={(val) =>
                setNewExperience({ ...newExperience, description: val })
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

        {editingId !== null && editExperience && (
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold">Edit Experience</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company"
                value={editExperience.company}
                onValueChange={(val) =>
                  setEditExperience({ ...editExperience, company: val })
                }
              />
              <Input
                label="Position"
                value={editExperience.position}
                onValueChange={(val) =>
                  setEditExperience({ ...editExperience, position: val })
                }
              />
            </div>
            <Input
              label="Location"
              value={editExperience.location}
              onValueChange={(val) =>
                setEditExperience({ ...editExperience, location: val })
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={editExperience.startDate}
                onChange={(e) =>
                  setEditExperience({
                    ...editExperience,
                    startDate: e.target.value,
                  })
                }
              />
              <div className="flex flex-col">
                <Input
                  label="End Date"
                  type="month"
                  isDisabled={editExperience.current}
                  value={editExperience.endDate}
                  onChange={(e) =>
                    setEditExperience({
                      ...editExperience,
                      endDate: e.target.value,
                    })
                  }
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editExperience.current}
                    onChange={(e) =>
                      setEditExperience({
                        ...editExperience,
                        current: e.target.checked,
                        endDate: e.target.checked
                          ? ""
                          : editExperience.endDate,
                      })
                    }
                  />
                  <span className="text-sm">I currently work here</span>
                </label>
              </div>
            </div>
            <Textarea
              label="Description"
              value={editExperience.description}
              onValueChange={(val) =>
                setEditExperience({ ...editExperience, description: val })
              }
              minRows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="flat" onPress={() => setEditingId(null)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleUpdateExperience}
                isDisabled={
                  !editExperience.company ||
                  !editExperience.position ||
                  !editExperience.startDate
                }
              >
                Update
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {
            experiences.length === 0 &&
            <div className="text-gray-400">
              You have not include any experiences yet. Please consider add more experiences
            </div>
          }

          {experiences.map((exp, index) => (
            <div key={exp.id ?? exp._id ?? index} className="space-y-4">
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
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    color="primary"
                    onPress={() => handleEdit(exp)}
                  >
                    <Icon icon="lucide:pencil" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleRemoveExperience(exp.id!)}
                  >
                    <Icon icon="lucide:trash-2" />
                  </Button>
                </div>
              </div>
              <p className="text-default-600" style={{ whiteSpace: "pre-line" }}>
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
